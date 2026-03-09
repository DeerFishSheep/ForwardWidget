// =============UserScript=============
// @name         IMDB 权威榜单聚合
// @version      2.3.0
// @description  IMDB 全球权威影视排行榜
// @author       白了个鹿
// =============UserScript=============

var WidgetMetadata = {
    id: "imdb_top_charts",
    title: "IMDB 榜单大全",
    description: "IMDB 全球权威影视排行榜",
    author: "白了个鹿",
    site: "https://www.imdb.com",
    version: "2.3.0",
    requiredVersion: "0.0.1",
    modules: [
        {
            title: "IMDB 榜单",
            description: "浏览 IMDB 官方影视排行榜",
            requiresWebView: false,
            functionName: "loadImdbCharts",
            params: [
                {
                    name: "chart_url", 
                    title: "🏆 榜单选择", 
                    type: "enumeration", 
                    value: "https://m.imdb.com/chart/top/",
                    enumOptions: [
                        { title: "🎬 Top 250 电影", value: "https://m.imdb.com/chart/top/" },
                        { title: "🎬 当前最受欢迎电影", value: "https://m.imdb.com/chart/moviemeter/" },
                        { title: "📺 Top 250 剧集", value: "https://m.imdb.com/chart/toptv/" },
                        { title: "📺 当前最受欢迎剧集", value: "https://m.imdb.com/chart/tvmeter/" }
                    ]
                },
                {
                    name: "sort_mode", 
                    title: "🔽 排序方式", 
                    type: "enumeration", 
                    // 💡 UI 配置中只保留纯净的字段名，不包含 asc/desc
                    value: "rank",
                    enumOptions: [
                        { title: "🏆 默认排行", value: "rank" },
                        { title: "⭐ IMDB评分", value: "user_rating" },
                        { title: "🔥 人气指数", value: "popularity" },
                        { title: "📊 评分数量", value: "num_votes" }
                    ]
                },
                // 保留 page 参数，用于底层捕获页码实现切片加载
                { name: "page", title: "页码", type: "page" }
            ]
        }
    ]
};

// ==========================================
// 💡 IMDB 数据抓取与 TMDB 转换引擎 (含切片分页与智能排序)
// ==========================================
async function loadImdbCharts(params = {}) {
    const baseUrl = params.chart_url;
    const baseSortMode = params.sort_mode || "rank";
    
    // 💡 智能排序方向补全逻辑
    let fullSortParam = baseSortMode;
    if (baseSortMode === "user_rating" || baseSortMode === "num_votes") {
        fullSortParam += ",desc"; // 评分和数量：从高到低降序
    } else {
        fullSortParam += ",asc";  // 排行和人气：从小到大升序
    }
    
    // 获取播放器传来的页码，默认每页展示 20 条
    const page = parseInt(params.page) || 1;
    const limit = 20; 
    
    // 动态拼接 URL 与带方向的排序参数 (encodeURIComponent 会自动将 , 转换为 %2C)
    const url = baseUrl.includes("?") 
        ? `${baseUrl}&sort=${encodeURIComponent(fullSortParam)}` 
        : `${baseUrl}?sort=${encodeURIComponent(fullSortParam)}`;
    
    const headers = {
        'Host': 'm.imdb.com',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://m.imdb.com/'
    };

    try {
        console.log(`[IMDB] 正在请求榜单数据: ${url}`);
        const response = await Widget.http.get(url, { headers: headers });
        
        // 使用 Cheerio 提取数据
        const $ = Widget.html.load(response.data);
        let rawItems = [];
        
        $('script[type="application/ld+json"]').each((index, element) => {
            try {
                const jsonStr = $(element).html();
                const jsonData = JSON.parse(jsonStr);
                
                if (jsonData["@type"] === "ItemList" && Array.isArray(jsonData.itemListElement)) {
                    rawItems = jsonData.itemListElement;
                }
            } catch (e) {
                console.log("[IMDB] 解析 JSON-LD 失败...");
            }
        });

        if (rawItems.length === 0) {
            console.error("[IMDB] 未能提取到榜单数据！");
            return [];
        }

        // ==========================================
        // 🌟 核心分页切片逻辑 🌟
        // ==========================================
        const startIdx = (page - 1) * limit;
        const endIdx = startIdx + limit;
        
        // 仅截取当前页码需要的 20 条数据
        const pagedItems = rawItems.slice(startIdx, endIdx);
        
        // 如果截取后为空，说明已经翻到底了，直接返回空数组通知播放器停止加载
        if (pagedItems.length === 0) {
            console.log(`[IMDB] 第 ${page} 页：已无更多数据。`);
            return [];
        }

        console.log(`[IMDB] 第 ${page} 页：提取榜单第 ${startIdx + 1} 到 ${startIdx + pagedItems.length} 名，开始 TMDB 反查...`);

        // 仅针对这 20 条数据发起 TMDB 查验，极大地提升渲染速度
        const fetchPromises = pagedItems.map(async (element) => {
            const show = element.item || {};
            if (!show.url) return null;

            const idMatch = show.url.match(/\/title\/(tt\d+)\//i);
            if (!idMatch) return null;
            const imdbId = idMatch[1];
            
            const fallbackRating = show.aggregateRating?.ratingValue || "0";

            try {
                // 利用 external_source 直接通过 IMDB ID 查找 TMDB
                const tmdbResp = await Widget.tmdb.get(`/find/${imdbId}`, { 
                    params: { 
                        external_source: 'imdb_id', // ⚠️ 这里必须是小写 imdb_id 才能被 TMDB 识别
                        language: 'zh-CN' 
                    } 
                });

                const data = tmdbResp.data || tmdbResp;
                let tmdbMatch = null;
                let mediaType = "movie";

                // TMDB 反查出结果，优先读取 movie_results，再读取 tv_results
                if (data.movie_results && data.movie_results.length > 0) {
                    tmdbMatch = data.movie_results[0];
                    mediaType = "movie";
                } else if (data.tv_results && data.tv_results.length > 0) {
                    tmdbMatch = data.tv_results[0];
                    mediaType = "tv";
                }

                if (tmdbMatch) {
                    return {
                        id: String(tmdbMatch.id),
                        type: "tmdb",
                        title: tmdbMatch.title || tmdbMatch.name, 
                        description: tmdbMatch.overview || show.description || "",
                        releaseDate: tmdbMatch.release_date || tmdbMatch.first_air_date || "",
                        posterPath: tmdbMatch.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMatch.poster_path}` : show.image,
                        backdropPath: tmdbMatch.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbMatch.backdrop_path}` : "",
                        rating: tmdbMatch.vote_average ? String(tmdbMatch.vote_average.toFixed(1)) : String(fallbackRating),
                        mediaType: mediaType,
                        genreTitle: show.genre ? (Array.isArray(show.genre) ? show.genre.join('•') : show.genre) : ""
                    };
                }

                return null;

            } catch (tmdbError) {
                console.error(`[IMDB] TMDB 反查失败 (${imdbId}):`, tmdbError);
                return null; 
            }
        });

        const results = await Promise.all(fetchPromises);
        return results.filter(i => i !== null); 

    } catch (error) {
        console.error("[IMDB] 整体请求或解析流程崩溃:", error);
        throw error;
    }
}
