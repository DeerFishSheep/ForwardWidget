// =============UserScript=============
// @name         IMDb 权威榜单聚合
// @version      1.0.0
// @description  提取 IMDb JSON-LD 数据，通过 TMDB 精准反查，输出全中文高清影视列表
// @author       YourName
// =============UserScript=============

var WidgetMetadata = {
    id: "imdb_top_charts",
    title: "IMDb 榜单",
    description: "IMDb 全球权威影视排行榜",
    author: "YourName",
    site: "https://www.imdb.com",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    modules: [
        {
            title: "IMDb 榜单大全",
            description: "浏览 IMDb 官方各大权威排行榜",
            requiresWebView: false,
            functionName: "loadImdbCharts",
            params: [
                {
                    name: "chart_url", 
                    title: "🏆 榜单选择", 
                    type: "enumeration", 
                    value: "https://m.imdb.com/chart/toptv/?sort=user_rating%2Cdesc",
                    enumOptions: [
                        { title: "Top 250 剧集", value: "https://m.imdb.com/chart/toptv/?sort=user_rating%2Cdesc" },
                        { title: "Top 250 电影", value: "https://m.imdb.com/chart/top/?sort=user_rating%2Cdesc" },
                        { title: "当前最受欢迎剧集", value: "https://m.imdb.com/chart/tvmeter/" },
                        { title: "当前最受欢迎电影", value: "https://m.imdb.com/chart/moviemeter/" }
                    ]
                }
            ]
        }
    ]
};

// ==========================================
// 💡 IMDb 数据抓取与 TMDB 转换引擎
// ==========================================
async function loadImdbCharts(params = {}) {
    const url = params.chart_url;
    
    // 1. 完全复刻你的请求头，伪装移动端 Safari
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
        
        // 2. 使用官方推荐的 Cheerio 句柄解析 HTML
        const $ = Widget.html.load(response.data);
        
        let rawItems = [];
        
        // 3. 提取带有 JSON-LD 的 script 标签
        $('script[type="application/ld+json"]').each((index, element) => {
            try {
                const jsonStr = $(element).html();
                const jsonData = JSON.parse(jsonStr);
                
                // IMDb 的榜单数据通常包裹在 @type 为 ItemList 的对象中
                if (jsonData["@type"] === "ItemList" && Array.isArray(jsonData.itemListElement)) {
                    rawItems = jsonData.itemListElement;
                }
            } catch (e) {
                console.log("[IMDb] 解析单块 JSON-LD 失败，跳过...");
            }
        });

        if (rawItems.length === 0) {
            console.error("[IMDb] 未能在页面中找到包含 itemListElement 的 JSON-LD 数据！");
            return [];
        }

        console.log(`[IMDb] 成功提取 ${rawItems.length} 条数据，开始通过 TMDB 进行反查映射...`);

        // 4. 遍历处理每个 IMDb 条目，将其交给 TMDB 接口反查
        const fetchPromises = rawItems.map(async (element) => {
            const show = element.item || {};
            if (!show.url) return null;

            // 从 IMDb 的 URL 中提取 IMDb ID (如: /title/tt0903747/ -> tt0903747)
            const idMatch = show.url.match(/\/title\/(tt\d+)\//i);
            if (!idMatch) return null;
            const imdbId = idMatch[1];
            
            // 提取基础数据（如果 TMDB 查不到可以用作兜底）
            const fallbackTitle = show.name || "未知名称";
            const fallbackRating = show.aggregateRating?.ratingValue || "0";

            try {
                // 💡 神级 API：利用 external_source 直接通过 IMDb ID 查找 TMDB 数据库
                // 这个接口 100% 精准，绝对不会出现重名歧义的问题
                const tmdbResp = await Widget.tmdb.get(`/find/${imdbId}`, { 
                    params: { 
                        external_source: 'imdb_id', 
                        language: 'zh-CN' 
                    } 
                });

                const data = tmdbResp.data || tmdbResp;
                let tmdbMatch = null;
                let mediaType = "movie";

                // TMDB 返回的结果会根据类型分类存放在不同数组中
                if (data.movie_results && data.movie_results.length > 0) {
                    tmdbMatch = data.movie_results[0];
                    mediaType = "movie";
                } else if (data.tv_results && data.tv_results.length > 0) {
                    tmdbMatch = data.tv_results[0];
                    mediaType = "tv";
                }

                // 如果 TMDB 找到了结果，直接组装返回完美的高清中文数据
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

                // 如果 TMDB 彻底没查到 (极少数冷门老片)，触发宁缺毋滥原则，丢弃
                return null;

            } catch (tmdbError) {
                console.error(`[IMDb] TMDB 反查失败 (${imdbId}):`, tmdbError);
                return null; // 宁缺毋滥
            }
        });

        const results = await Promise.all(fetchPromises);
        return results.filter(i => i !== null); // 过滤掉 null 的数据

    } catch (error) {
        console.error("[IMDb] 整体请求或解析流程崩溃:", error);
        throw error;
    }
}
