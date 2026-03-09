// =============UserScript=============
// @name         IMDb 权威榜单聚合
// @version      2.1.0
// @description  IMDb 全球权威影视排行榜
// @author       白了个鹿
// =============UserScript=============

var WidgetMetadata = {
    id: "imdb_top_charts",
    title: "IMDb 榜单大全",
    description: "IMDb 全球权威影视排行榜",
    author: "白了个鹿",
    site: "https://www.imdb.com",
    version: "2.1.0",
    requiredVersion: "0.0.1",
    modules: [
        // --- 模块 1：IMDb·电影 ---
        {
            title: "IMDb·电影",
            description: "浏览 IMDb 官方电影排行榜",
            requiresWebView: false,
            functionName: "loadImdbCharts",
            params: [
                {
                    name: "chart_url", 
                    title: "🎬 榜单选择", 
                    type: "enumeration", 
                    value: "https://m.imdb.com/chart/top/",
                    enumOptions: [
                        { title: "Top 250 经典电影", value: "https://m.imdb.com/chart/top/" },
                        { title: "当前最受欢迎电影", value: "https://m.imdb.com/chart/moviemeter/" }
                    ]
                },
                {
                    name: "sort_mode", 
                    title: "🔽 排序方式", 
                    type: "enumeration", 
                    value: "rank", // 💡 移除了 %2C，换成原生逗号
                    enumOptions: [
                        { title: "🏆 默认排行", value: "rank" },
                        { title: "⭐ IMDb评分", value: "user_rating,desc" },
                        { title: "🔥 人气指数", value: "popularity" },
                        { title: "📊 评分数量", value: "num_votes,desc" }
                    ]
                },
                // 💡 保留 page 参数，用于底层捕获页码
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // --- 模块 2：IMDb·剧集 ---
        {
            title: "IMDb·剧集",
            description: "浏览 IMDb 官方剧集排行榜",
            requiresWebView: false,
            functionName: "loadImdbCharts",
            params: [
                {
                    name: "chart_url", 
                    title: "📺 榜单选择", 
                    type: "enumeration", 
                    value: "https://m.imdb.com/chart/toptv/",
                    enumOptions: [
                        { title: "Top 250 经典剧集", value: "https://m.imdb.com/chart/toptv/" },
                        { title: "当前最受欢迎剧集", value: "https://m.imdb.com/chart/tvmeter/" }
                    ]
                },
                {
                    name: "sort_mode", 
                    title: "🔽 排序方式", 
                    type: "enumeration", 
                    value: "rank",
                    enumOptions: [
                        { title: "🏆 默认排行", value: "rank" },
                        { title: "⭐ IMDb评分", value: "user_rating,desc" },
                        { title: "🔥 人气指数", value: "popularity" },
                        { title: "📊 评分数量", value: "num_votes,desc" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        }
    ]
};

// ==========================================
// 💡 IMDb 数据抓取与 TMDB 转换引擎 (含切片分页)
// ==========================================
async function loadImdbCharts(params = {}) {
    const baseUrl = params.chart_url;
    const sortMode = params.sort_mode || "rank";
    
    // 💡 获取播放器传来的页码，默认每页展示 20 条
    const page = parseInt(params.page) || 1;
    const limit = 20; 
    
    // 动态拼接 URL 与排序参数 (使用 encodeURIComponent 自动将逗号转为标准编码)
    const url = baseUrl.includes("?") 
        ? `${baseUrl}&sort=${encodeURIComponent(sortMode)}` 
        : `${baseUrl}?sort=${encodeURIComponent(sortMode)}`;
    
    const headers = {
        'Host': 'm.imdb.com',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://m.imdb.com/'
    };

    try {
        console.log(`[IMDb] 正在请求榜单数据: ${url}`);
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
                console.log("[IMDb] 解析 JSON-LD 失败...");
            }
        });

        if (rawItems.length === 0) {
            console.error("[IMDb] 未能提取到榜单数据！");
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
            console.log(`[IMDb] 第 ${page} 页：已无更多数据。`);
            return [];
        }

        console.log(`[IMDb] 第 ${page} 页：提取榜单第 ${startIdx + 1} 到 ${startIdx + pagedItems.length} 名，开始 TMDB 反查...`);

        // 仅针对这 20 条数据发起 TMDB 查验，极大地提升渲染速度
        const fetchPromises = pagedItems.map(async (element) => {
            const show = element.item || {};
            if (!show.url) return null;

            const idMatch = show.url.match(/\/title\/(tt\d+)\//i);
            if (!idMatch) return null;
            const imdbId = idMatch[1];
            
            const fallbackRating = show.aggregateRating?.ratingValue || "0";

            try {
                // 利用 external_source 直接通过 IMDb ID 查找 TMDB
                const tmdbResp = await Widget.tmdb.get(`/find/${imdbId}`, { 
                    params: { 
                        external_source: 'imdb_id', 
                        language: 'zh-CN' 
                    } 
                });

                const data = tmdbResp.data || tmdbResp;
                let tmdbMatch = null;
                let mediaType = "movie";

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
                console.error(`[IMDb] TMDB 反查失败 (${imdbId}):`, tmdbError);
                return null; 
            }
        });

        const results = await Promise.all(fetchPromises);
        return results.filter(i => i !== null); 

    } catch (error) {
        console.error("[IMDb] 整体请求或解析流程崩溃:", error);
        throw error;
    }
}
