// =============UserScript=============
// @name         豆瓣榜单大全
// @version      12.1.0
// @description  修复导入失败问题，提供顶部静态配置区，支持快捷增删片单与模块移动
// @author       YourName
// =============UserScript=============

var WidgetMetadata = {
    id: "douban_unified_engine_pure",
    title: "豆瓣影视全聚合",
    description: "聚合豆瓣所有榜单与高级筛选发现",
    author: "白了个鹿",
    site: "https://m.douban.com",
    version: "12.1.0",
    requiredVersion: "0.0.1",
    modules: [
        // ========================================================
        // ⚙️ 快捷配置区 1：自定义片单 (在这里直接增删你的片单)
        // ========================================================
        {
            title: "豆瓣·自定义片单",
            requiresWebView: false,
            functionName: "loadDoubanCustomList",
            params: [
                {
                    name: "url", title: "🔗 片单地址", type: "input", 
                    // 👇 格式：{ title: "名字", value: "链接" }，增加时直接在下方追加一行，注意英文逗号
                    placeholders: [
                        { title: "IMDB科幻电影Top 200", value: "https://www.douban.com/doulist/240612/?dt_dapp=1" }
											  ,{ title: "2000年来最获好评的150部电影", value: "https://www.douban.com/doulist/3486551/?dt_dapp=1" }
                        // ,{ title: "你的新片单名称", value: "https://www.douban.com/doulist/XXXXXX/" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ========================================================
        // ⚙️ 快捷配置区 2：模块排序区 
        // (要想改变模块在界面的显示顺序，直接将下方的完整模块块【剪切并粘贴】调整上下位置即可)
        // ========================================================

        // --- 模块 2：豆瓣·热门电影 ---
        {
            title: "豆瓣·热门电影",
            requiresWebView: false,
            functionName: "loadDoubanHotGaia",
            params: [
                {
                    name: "area", title: "🌍 地区", type: "enumeration", value: "全部",
                    enumOptions: [
                        { title: "全部", value: "全部" }, { title: "华语", value: "华语" },
                        { title: "欧美", value: "欧美" }, { title: "韩国", value: "韩国" },
                        { title: "日本", value: "日本" }
                    ]
                },
                {
                    name: "sort", title: "🔽 排序方式", type: "enumeration", value: "recommend",
                    enumOptions: [
                        { title: "热度", value: "recommend" }, { title: "最新", value: "time" },
                        { title: "评分", value: "rank" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        
        // --- 模块 3：豆瓣·实时热榜 ---
        {
            title: "豆瓣·实时热榜",
            requiresWebView: false,
            functionName: "loadDoubanHotList",
            params: [
                {
                    name: "hot_type", title: "🔥 热榜分类", type: "enumeration", value: "movie_real_time_hotest",
                    enumOptions: [
                        { title: "电影实时热榜", value: "movie_real_time_hotest" },
                        { title: "电视剧实时热榜", value: "tv_real_time_hotest" },
                        { title: "书影音实时热榜", value: "subject_real_time_hotest" }
                    ]
                }
            ]
        },
        
        // --- 模块 4：豆瓣·一周口碑榜 ---
        {
            title: "豆瓣·一周口碑榜",
            requiresWebView: false,
            functionName: "loadDoubanWeeklyBest",
            params: [
                {
                    name: "list_type", title: "🏆 榜单分类", type: "enumeration", value: "movie_weekly_best",
                    enumOptions: [
                        { title: "一周电影口碑榜", value: "movie_weekly_best" },
                        { title: "华语剧集口碑榜", value: "tv_chinese_best_weekly" },
                        { title: "全球剧集口碑榜", value: "tv_global_best_weekly" },
                        { title: "国内综艺口碑榜", value: "show_chinese_best_weekly" },
                        { title: "国外综艺口碑榜", value: "show_global_best_weekly" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        
        // --- 模块 5：豆瓣·类型榜单大全 ---
        {
            title: "豆瓣·类型榜单大全",
            description: "豆瓣官方细分影视榜单矩阵",
            requiresWebView: false,
            functionName: "loadDoubanGenreRankings",
            params: [
                {
                    name: "media_type", title: "🎬 影视类型", type: "enumeration", value: "movie",
                    enumOptions: [ { title: "电影", value: "movie" }, { title: "电视剧", value: "tv" } ]
                },
                {
                    name: "movie_cat", title: "📁 电影分类", type: "enumeration", value: "剧情",
                    belongTo: { paramName: "media_type", value: ["movie"] },
                    enumOptions: [
                        { title: "剧情", value: "剧情" }, { title: "喜剧", value: "喜剧" }, { title: "爱情", value: "爱情" }, { title: "动作", value: "动作" }, { title: "科幻", value: "科幻" }, { title: "动画", value: "动画" }, { title: "悬疑", value: "悬疑" }, { title: "犯罪", value: "犯罪" }, { title: "惊悚", value: "惊悚" }, { title: "冒险", value: "冒险" }, { title: "家庭", value: "家庭" }, { title: "儿童", value: "儿童" }, { title: "音乐", value: "音乐" }, { title: "历史", value: "历史" }, { title: "奇幻", value: "奇幻" }, { title: "恐怖", value: "恐怖" }, { title: "战争", value: "战争" }, { title: "传记", value: "传记" }, { title: "歌舞", value: "歌舞" }, { title: "武侠", value: "武侠" }, { title: "情色", value: "情色" }, { title: "灾难", value: "灾难" }, { title: "西部", value: "西部" }, { title: "古装", value: "古装" }, { title: "运动", value: "运动" }, { title: "短片", value: "短片" }
                    ]
                },
                {
                    name: "tv_cat", title: "📁 剧集分类", type: "enumeration", value: "大陆剧",
                    belongTo: { paramName: "media_type", value: ["tv"] },
                    enumOptions: [
                        { title: "大陆剧", value: "大陆剧" }, { title: "美剧", value: "美剧" }, { title: "英剧", value: "英剧" }, { title: "日剧", value: "日剧" }, { title: "韩剧", value: "韩剧" }, { title: "港剧", value: "港剧" }, { title: "台剧", value: "台剧" }, { title: "泰剧", value: "泰剧" }, { title: "欧洲剧", value: "欧洲剧" }, { title: "动画剧集", value: "动画剧集" }
                    ]
                },
                // 电影三级分类 (26个)
                { name: "movie_sub_剧情", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_27", belongTo: { paramName: "movie_cat", value: ["剧情"] }, enumOptions: [ { title: "高分经典剧情片榜", value: "film_genre_27" } ] },
                { name: "movie_sub_喜剧", title: "🔖 榜单名称", type: "enumeration", value: "ECAYN54KI", belongTo: { paramName: "movie_cat", value: ["喜剧"] }, enumOptions: [ { title: "近期热门喜剧片榜", value: "ECAYN54KI" }, { title: "高分经典喜剧片榜", value: "movie_comedy" }, { title: "华语喜剧片榜", value: "ECVUOUD7A" }, { title: "欧洲喜剧片榜", value: "ECPQO4BPA" }, { title: "中国大陆喜剧片榜", value: "ECKIO6SXI" }, { title: "美国喜剧片榜", value: "ECGUO62ZA" }, { title: "中国香港喜剧片榜", value: "ECOYO2QPA" }, { title: "中国台湾喜剧片榜", value: "ECEAOX2BI" }, { title: "日本喜剧片榜", value: "ECFIOT7JA" }, { title: "韩国喜剧片榜", value: "ECOIOVQPY" }, { title: "英国喜剧片榜", value: "EC6IOYROI" }, { title: "法国喜剧片榜", value: "ECIEOY5UI" }, { title: "德国喜剧片榜", value: "ECFQO5B4A" }, { title: "意大利喜剧片榜", value: "ECREOTSEI" }, { title: "西班牙喜剧片榜", value: "EC6UO37NQ" }, { title: "瑞典喜剧片榜", value: "ECPMPBHBI" }, { title: "印度喜剧片榜", value: "ECTIOYBOY" }, { title: "泰国喜剧片榜", value: "ECAIO3EWI" }, { title: "加拿大喜剧片榜", value: "ECYUPAHZY" }, { title: "澳大利亚喜剧片榜", value: "ECKMOXL6Q" }, { title: "爱尔兰喜剧片榜", value: "ECOAOZY7Y" }, { title: "冷门佳作喜剧片榜", value: "ECLYOFOKA" } ] },
                { name: "movie_sub_爱情", title: "🔖 榜单名称", type: "enumeration", value: "ECSAOJFTA", belongTo: { paramName: "movie_cat", value: ["爱情"] }, enumOptions: [ { title: "近期热门爱情片榜", value: "ECSAOJFTA" }, { title: "高分经典爱情片榜", value: "movie_love" }, { title: "华语爱情片榜", value: "ECOIOTUGY" }, { title: "欧洲爱情片榜", value: "ECUAOYUCA" }, { title: "中国大陆爱情片榜", value: "EC64OQVEQ" }, { title: "美国爱情片榜", value: "EC4EOSAQA" }, { title: "中国台湾爱情片榜", value: "ECWQOQO4A" }, { title: "日本爱情片榜", value: "ECKMOVF3Y" }, { title: "韩国爱情片榜", value: "ECHIOXXIQ" }, { title: "英国爱情片榜", value: "ECHAO4AAQ" }, { title: "法国爱情片榜", value: "ECTAOT7GQ" }, { title: "德国爱情片榜", value: "ECNIOS7EQ" }, { title: "意大利爱情片榜", value: "EC3UOSWUY" }, { title: "西班牙爱情片榜", value: "ECU4OWMMI" }, { title: "瑞典爱情片榜", value: "ECCEOUVAA" }, { title: "印度爱情片榜", value: "ECLUOQWVY" }, { title: "泰国爱情片榜", value: "ECYQO7YPQ" }, { title: "加拿大爱情片榜", value: "ECEAOXFIQ" }, { title: "澳大利亚爱情片榜", value: "ECOUOXYUA" }, { title: "爱尔兰爱情片榜", value: "ECJMO2O5Y" }, { title: "冷门佳作爱情片榜", value: "EC2UOKRRQ" } ] },
                { name: "movie_sub_动作", title: "🔖 榜单名称", type: "enumeration", value: "ECBUOLQGY", belongTo: { paramName: "movie_cat", value: ["动作"] }, enumOptions: [ { title: "近期热门动作片榜", value: "ECBUOLQGY" }, { title: "高分经典动作片榜", value: "movie_action" }, { title: "华语动作片榜", value: "EC2YO2M2A" }, { title: "欧洲动作片榜", value: "ECHUOXOUA" }, { title: "美国动作片榜", value: "ECPMPC7JA" }, { title: "中国台湾动作片榜", value: "ECTMO64KY" }, { title: "日本动作片榜", value: "ECBAPBW2Y" }, { title: "韩国动作片榜", value: "ECWQOU2HI" }, { title: "英国动作片榜", value: "ECCUPDBHQ" }, { title: "法国动作片榜", value: "EC5UOWEFY" }, { title: "德国动作片榜", value: "EC7AOW57Q" }, { title: "印度动作片榜", value: "ECMQO4F2I" }, { title: "加拿大动作片榜", value: "ECUQPDN7Y" }, { title: "澳大利亚动作片榜", value: "EC4QPALEI" }, { title: "冷门佳作动作片榜", value: "ECVIOHY6A" } ] },
                { name: "movie_sub_科幻", title: "🔖 榜单名称", type: "enumeration", value: "ECZYOJPLI", belongTo: { paramName: "movie_cat", value: ["科幻"] }, enumOptions: [ { title: "近期热门科幻片榜", value: "ECZYOJPLI" }, { title: "高分经典科幻片榜", value: "movie_scifi" }, { title: "欧洲科幻片榜", value: "ECX4O7JAA" }, { title: "美国科幻片榜", value: "ECDAO6XZI" }, { title: "日本科幻片榜", value: "ECSYOV6GY" }, { title: "英国科幻片榜", value: "EC4UOZQ4Y" }, { title: "法国科幻片榜", value: "EC3MO34NI" }, { title: "德国科幻片榜", value: "ECOUO2ETY" }, { title: "加拿大科幻片榜", value: "ECX4PAGTA" }, { title: "澳大利亚科幻片榜", value: "ECTAOXLWQ" }, { title: "冷门佳作科幻片榜", value: "EC2IOENJA" } ] },
                { name: "movie_sub_动画", title: "🔖 榜单名称", type: "enumeration", value: "EC3UOBDQY", belongTo: { paramName: "movie_cat", value: ["动画"] }, enumOptions: [ { title: "近期热门动画片榜", value: "EC3UOBDQY" }, { title: "高分经典动画片榜", value: "film_genre_31" }, { title: "华语动画片榜", value: "ECFMOYMKA" }, { title: "欧洲动画片榜", value: "ECLYO57HA" }, { title: "美国动画片榜", value: "EC4IPDWYI" }, { title: "日本动画片榜", value: "ECLYO6JQQ" }, { title: "英国动画片榜", value: "ECWUO3RJA" }, { title: "法国动画片榜", value: "ECIQPF7NY" }, { title: "加拿大动画片榜", value: "EC3YPB7WQ" }, { title: "冷门佳作动画片榜", value: "ECTUO3I3A" } ] },
                { name: "movie_sub_悬疑", title: "🔖 榜单名称", type: "enumeration", value: "ECPQOJP5Q", belongTo: { paramName: "movie_cat", value: ["悬疑"] }, enumOptions: [ { title: "近期热门悬疑片榜", value: "ECPQOJP5Q" }, { title: "高分经典悬疑片榜", value: "film_genre_32" }, { title: "华语悬疑片榜", value: "ECRMOX2JI" }, { title: "欧洲悬疑片榜", value: "ECUMPB7SA" }, { title: "美国悬疑片榜", value: "ECJUO3L7I" }, { title: "中国香港悬疑片榜", value: "ECV4OU2WA" }, { title: "日本悬疑片榜", value: "ECVYOVDIA" }, { title: "韩国悬疑片榜", value: "ECSYOYZWI" }, { title: "英国悬疑片榜", value: "EC5YPE3OI" }, { title: "法国悬疑片榜", value: "ECQUO7FVQ" }, { title: "德国悬疑片榜", value: "ECZQO7KSQ" }, { title: "意大利悬疑片榜", value: "ECVEO7MPI" }, { title: "西班牙悬疑片榜", value: "ECAYOVXFA" }, { title: "加拿大悬疑片榜", value: "ECYMPDCTI" }, { title: "澳大利亚悬疑片榜", value: "ECIMOWR2I" }, { title: "冷门佳作悬疑片榜", value: "ECK4OEBJY" } ] },
                { name: "movie_sub_犯罪", title: "🔖 榜单名称", type: "enumeration", value: "ECLAN6LHQ", belongTo: { paramName: "movie_cat", value: ["犯罪"] }, enumOptions: [ { title: "近期热门犯罪片榜", value: "ECLAN6LHQ" }, { title: "高分经典犯罪片榜", value: "film_genre_46" }, { title: "华语犯罪片榜", value: "ECVUO4O4Q" }, { title: "欧洲犯罪片榜", value: "EC5QO2HUI" }, { title: "中国大陆犯罪片榜", value: "ECWAPHUIA" }, { title: "美国犯罪片榜", value: "ECEAPADKY" }, { title: "中国香港犯罪片榜", value: "EC3AOZZUY" }, { title: "日本犯罪片榜", value: "ECVUO43DY" }, { title: "韩国犯罪片榜", value: "ECGYO2SPA" }, { title: "英国犯罪片榜", value: "ECVYOZNAI" }, { title: "法国犯罪片榜", value: "ECFEPCR2A" }, { title: "德国犯罪片榜", value: "ECVAPBWRI" }, { title: "意大利犯罪片榜", value: "ECRMO4X7I" }, { title: "西班牙犯罪片榜", value: "ECPAPDKZA" }, { title: "加拿大犯罪片榜", value: "EC2MPBOOI" }, { title: "澳大利亚犯罪片榜", value: "ECEMOZ6DI" }, { title: "冷门佳作犯罪片榜", value: "EC7EOG3RI" } ] },
                { name: "movie_sub_惊悚", title: "🔖 榜单名称", type: "enumeration", value: "ECBUOL2DA", belongTo: { paramName: "movie_cat", value: ["惊悚"] }, enumOptions: [ { title: "近期热门惊悚片榜", value: "ECBUOL2DA" }, { title: "高分经典惊悚片榜", value: "film_genre_33" }, { title: "华语惊悚片榜", value: "EC5MPCA7Y" }, { title: "欧洲惊悚片榜", value: "ECTMPCZTY" }, { title: "美国惊悚片榜", value: "ECSYO3JKQ" }, { title: "日本惊悚片榜", value: "ECFUO25PI" }, { title: "韩国惊悚片榜", value: "ECTMPDECI" }, { title: "英国惊悚片榜", value: "ECU4O6QYQ" }, { title: "法国惊悚片榜", value: "ECPMPHOMI" }, { title: "德国惊悚片榜", value: "ECJIPH4JA" }, { title: "意大利惊悚片榜", value: "EC2QPBTHY" }, { title: "西班牙惊悚片榜", value: "ECLMPAEZY" }, { title: "瑞典惊悚片榜", value: "ECMIPBWCY" }, { title: "印度惊悚片榜", value: "ECRQPBSYI" }, { title: "加拿大惊悚片榜", value: "ECZMPDHQI" }, { title: "澳大利亚惊悚片榜", value: "EC7QPFMYA" }, { title: "冷门佳作惊悚片榜", value: "ECY4ODRSY" } ] },
                { name: "movie_sub_冒险", title: "🔖 榜单名称", type: "enumeration", value: "ECDYOE7WY", belongTo: { paramName: "movie_cat", value: ["冒险"] }, enumOptions: [ { title: "近期热门冒险片榜", value: "ECDYOE7WY" }, { title: "高分经典冒险片榜", value: "film_genre_49" }, { title: "华语冒险片榜", value: "ECAUOWGNQ" }, { title: "欧洲冒险片榜", value: "ECW4O3GHY" }, { title: "美国冒险片榜", value: "ECOMON43Q" }, { title: "日本冒险片榜", value: "ECOUOVT2Q" }, { title: "英国冒险片榜", value: "ECFUORHLY" }, { title: "法国冒险片榜", value: "EC5YO53DI" }, { title: "德国冒险片榜", value: "ECMYOXC2Y" }, { title: "加拿大冒险片榜", value: "ECRYO5ULY" }, { title: "澳大利亚冒险片榜", value: "ECFIOR3MY" }, { title: "冷门佳作冒险片榜", value: "ECEMN5MLA" } ] },
                { name: "movie_sub_家庭", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_41", belongTo: { paramName: "movie_cat", value: ["家庭"] }, enumOptions: [ { title: "高分经典家庭片榜", value: "film_genre_41" } ] },
                { name: "movie_sub_儿童", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_42", belongTo: { paramName: "movie_cat", value: ["儿童"] }, enumOptions: [ { title: "高分经典儿童片榜", value: "film_genre_42" } ] },
                { name: "movie_sub_音乐", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_39", belongTo: { paramName: "movie_cat", value: ["音乐"] }, enumOptions: [ { title: "高分经典音乐片榜", value: "film_genre_39" }, { title: "欧洲音乐片榜", value: "ECAQO25QI" }, { title: "美国音乐片榜", value: "ECUAOV5NA" }, { title: "日本音乐片榜", value: "ECFYORPYQ" }, { title: "英国音乐片榜", value: "ECAQO3LYY" }, { title: "法国音乐片榜", value: "ECYAORESI" }, { title: "冷门佳作音乐片榜", value: "EC2UOKJFQ" } ] },
                { name: "movie_sub_历史", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_44", belongTo: { paramName: "movie_cat", value: ["历史"] }, enumOptions: [ { title: "高分经典历史片榜", value: "film_genre_44" }, { title: "华语历史片榜", value: "ECV4N7YWY" }, { title: "欧洲历史片榜", value: "ECIAOE4OY" }, { title: "美国历史片榜", value: "ECK4OGBSA" }, { title: "中国香港历史片榜", value: "ECPYOEZNY" }, { title: "日本历史片榜", value: "EC54OCODY" }, { title: "韩国历史片榜", value: "ECMAOINLA" }, { title: "英国历史片榜", value: "ECSEOEISY" }, { title: "法国历史片榜", value: "ECUMONVJQ" }, { title: "德国历史片榜", value: "ECNQODGKI" }, { title: "意大利历史片榜", value: "ECL4OLRCY" }, { title: "冷门佳作历史片榜", value: "ECBAOKDHQ" } ] },
                { name: "movie_sub_奇幻", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_48", belongTo: { paramName: "movie_cat", value: ["奇幻"] }, enumOptions: [ { title: "高分经典奇幻片榜", value: "film_genre_48" }, { title: "华语奇幻片榜", value: "EC5MOJAZY" }, { title: "欧洲奇幻片榜", value: "ECUMOLXQY" }, { title: "美国奇幻片榜", value: "ECVIOIPDI" }, { title: "中国香港奇幻片榜", value: "ECUUOJIFA" }, { title: "日本奇幻片榜", value: "ECEIOJZTQ" }, { title: "韩国奇幻片榜", value: "ECDAOLOSI" }, { title: "英国奇幻片榜", value: "ECRAOGHZY" }, { title: "法国奇幻片榜", value: "EC6QOILRA" }, { title: "德国奇幻片榜", value: "EC4YOCBLQ" }, { title: "冷门佳作奇幻片榜", value: "ECCMOLZQA" } ] },
                { name: "movie_sub_恐怖", title: "🔖 榜单名称", type: "enumeration", value: "ECV4N4FBI", belongTo: { paramName: "movie_cat", value: ["恐怖"] }, enumOptions: [ { title: "近期热门恐怖片榜", value: "ECV4N4FBI" }, { title: "高分经典恐怖片榜", value: "film_genre_34" }, { title: "华语恐怖片榜", value: "EC54OE5HA" }, { title: "欧洲恐怖片榜", value: "ECFAOK5WQ" }, { title: "美国恐怖片榜", value: "ECGMORRUY" }, { title: "日本恐怖片榜", value: "EC6QOMMWY" }, { title: "韩国恐怖片榜", value: "ECFEOMHIQ" }, { title: "英国恐怖片榜", value: "ECFUOGJDQ" }, { title: "法国恐怖片榜", value: "ECHIOLPXA" }, { title: "西班牙恐怖片榜", value: "ECWUOILKA" }, { title: "泰国恐怖片榜", value: "EC2AOMMKY" }, { title: "加拿大恐怖片榜", value: "ECVYODZIA" }, { title: "澳大利亚恐怖片榜", value: "ECFYOIWBQ" }, { title: "冷门佳作恐怖片榜", value: "ECTMOHSQY" } ] },
                { name: "movie_sub_战争", title: "🔖 榜单名称", type: "enumeration", value: "EC6MOCTVQ", belongTo: { paramName: "movie_cat", value: ["战争"] }, enumOptions: [ { title: "近期热门战争片榜", value: "EC6MOCTVQ" }, { title: "高分经典战争片榜", value: "film_genre_45" }, { title: "华语战争片榜", value: "ECWUOKOLY" }, { title: "欧洲战争片榜", value: "ECUIOKO6I" }, { title: "美国战争片榜", value: "ECDYONLLI" }, { title: "中国香港战争片榜", value: "ECO4OUYWI" }, { title: "日本战争片榜", value: "ECFYOK3AQ" }, { title: "韩国战争片榜", value: "EC2UOS6AQ" }, { title: "英国战争片榜", value: "ECVIOP57A" }, { title: "法国战争片榜", value: "EC6UOQ3TY" }, { title: "德国战争片榜", value: "ECV4OGCIA" }, { title: "意大利战争片榜", value: "ECYUOU5TA" }, { title: "俄罗斯战争片榜", value: "ECF4OMYDQ" }, { title: "冷门佳作战争片榜", value: "ECGEOIWRA" } ] },
                { name: "movie_sub_传记", title: "🔖 榜单名称", type: "enumeration", value: "EC3EOHEYY", belongTo: { paramName: "movie_cat", value: ["传记"] }, enumOptions: [ { title: "近期热门传记片榜", value: "EC3EOHEYY" }, { title: "高分经典传记片榜", value: "film_genre_43" }, { title: "华语传记片榜", value: "ECVYOEEUA" }, { title: "欧洲传记片榜", value: "ECZIOQ6LY" }, { title: "美国传记片榜", value: "ECE4OHQQY" }, { title: "英国传记片榜", value: "ECNMONJTQ" }, { title: "法国传记片榜", value: "ECYIOK3PY" }, { title: "德国传记片榜", value: "ECAYOFADY" }, { title: "意大利传记片榜", value: "ECLEOKFFQ" }, { title: "加拿大传记片榜", value: "ECCUOUMXQ" }, { title: "冷门佳作传记片榜", value: "ECRAODXXI" } ] },
                { name: "movie_sub_歌舞", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_40", belongTo: { paramName: "movie_cat", value: ["歌舞"] }, enumOptions: [ { title: "高分经典歌舞片榜", value: "film_genre_40" }, { title: "欧洲歌舞片榜", value: "EC3QOS5MA" }, { title: "美国歌舞片榜", value: "ECYQOXMSA" }, { title: "冷门佳作歌舞片榜", value: "ECZMOHQ3Q" } ] },
                { name: "movie_sub_武侠", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_50", belongTo: { paramName: "movie_cat", value: ["武侠"] }, enumOptions: [ { title: "高分经典武侠片榜", value: "film_genre_50" }, { title: "华语武侠片榜", value: "ECEAOOAHI" }, { title: "中国大陆武侠片榜", value: "EC6YOLGQQ" }, { title: "冷门佳作武侠片榜", value: "ECWAOLLZQ" } ] },
                { name: "movie_sub_情色", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_37", belongTo: { paramName: "movie_cat", value: ["情色"] }, enumOptions: [ { title: "高分经典情色片榜", value: "film_genre_37" }, { title: "华语情色片榜", value: "ECKQOVFTY" }, { title: "欧洲情色片榜", value: "ECVUONKTI" }, { title: "美国情色片榜", value: "ECTQOQ6XQ" }, { title: "日本情色片榜", value: "ECLUOK4TA" }, { title: "韩国情色片榜", value: "ECDMOZMVI" }, { title: "英国情色片榜", value: "ECA4OSUNA" }, { title: "法国情色片榜", value: "ECDAOW2PY" }, { title: "意大利情色片榜", value: "ECM4OVMRY" }, { title: "冷门佳作情色片榜", value: "ECGYN6NHI" } ] },
                { name: "movie_sub_灾难", title: "🔖 榜单名称", type: "enumeration", value: "natural_disasters", belongTo: { paramName: "movie_cat", value: ["灾难"] }, enumOptions: [ { title: "高分经典灾难片榜", value: "natural_disasters" }, { title: "欧洲灾难片榜", value: "EC5IOQ75I" }, { title: "美国灾难片榜", value: "EC4IOWGKA" }, { title: "冷门佳作灾难片榜", value: "ECHMOGZLQ" } ] },
                { name: "movie_sub_西部", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_47", belongTo: { paramName: "movie_cat", value: ["西部"] }, enumOptions: [ { title: "高分经典西部片榜", value: "film_genre_47" }, { title: "欧洲西部片榜", value: "ECM4OWDGI" }, { title: "美国西部片榜", value: "ECU4ORYVI" } ] },
                { name: "movie_sub_古装", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_51", belongTo: { paramName: "movie_cat", value: ["古装"] }, enumOptions: [ { title: "高分经典古装片榜", value: "film_genre_51" } ] },
                { name: "movie_sub_运动", title: "🔖 榜单名称", type: "enumeration", value: "ECCEPGM4Y", belongTo: { paramName: "movie_cat", value: ["运动"] }, enumOptions: [ { title: "高分经典运动片榜", value: "ECCEPGM4Y" } ] },
                { name: "movie_sub_短片", title: "🔖 榜单名称", type: "enumeration", value: "film_genre_36", belongTo: { paramName: "movie_cat", value: ["短片"] }, enumOptions: [ { title: "高分经典短片榜", value: "film_genre_36" } ] },
                
                // 电视剧三级分类 (10个)
                { name: "tv_sub_大陆剧", title: "🔖 榜单名称", type: "enumeration", value: "EC74443FY", belongTo: { paramName: "tv_cat", value: ["大陆剧"] }, enumOptions: [ { title: "近期热门大陆剧榜", value: "EC74443FY" }, { title: "高分经典大陆剧榜", value: "ECT45KVZI" }, { title: "喜剧大陆剧榜", value: "ECVQ47BUI" }, { title: "爱情大陆剧榜", value: "ECZM5H55I" }, { title: "悬疑大陆剧榜", value: "ECIU5AZDA" }, { title: "家庭大陆剧榜", value: "ECJU5D3PY" }, { title: "古装大陆剧榜", value: "ECTU453WI" }, { title: "犯罪大陆剧榜", value: "EC4Q5JNKI" }, { title: "历史大陆剧榜", value: "ECN45K75A" }, { title: "冷门佳作大陆剧榜", value: "ECRI46YZQ" } ] },
                { name: "tv_sub_美剧", title: "🔖 榜单名称", type: "enumeration", value: "ECFA5DI7Q", belongTo: { paramName: "tv_cat", value: ["美剧"] }, enumOptions: [ { title: "近期热门美剧榜", value: "ECFA5DI7Q" }, { title: "高分经典美剧榜", value: "ECVACWVGI" }, { title: "喜剧美剧榜", value: "ECX45ISGQ" }, { title: "爱情美剧榜", value: "ECA45D3RQ" }, { title: "悬疑美剧榜", value: "ECKI5JNJI" }, { title: "动作美剧榜", value: "ECME44L4Y" }, { title: "科幻美剧榜", value: "ECL45GQ4I" }, { title: "犯罪美剧榜", value: "EC2Y5CTPA" }, { title: "惊悚美剧榜", value: "ECMM5ALJQ" }, { title: "奇幻美剧榜", value: "ECHU473PI" }, { title: "恐怖美剧榜", value: "ECRE46B7Y" }, { title: "冷门佳作美剧榜", value: "ECGI5HUQI" } ] },
                { name: "tv_sub_英剧", title: "🔖 榜单名称", type: "enumeration", value: "ECVACXBWI", belongTo: { paramName: "tv_cat", value: ["英剧"] }, enumOptions: [ { title: "高分经典英剧榜", value: "ECVACXBWI" }, { title: "喜剧英剧榜", value: "ECZE5BCZA" }, { title: "悬疑英剧榜", value: "ECTM5HMAI" }, { title: "犯罪英剧榜", value: "EC5I5EOCQ" }, { title: "冷门佳作英剧榜", value: "ECEM4373Q" } ] },
                { name: "tv_sub_日剧", title: "🔖 榜单名称", type: "enumeration", value: "ECNA46YBA", belongTo: { paramName: "tv_cat", value: ["日剧"] }, enumOptions: [ { title: "近期热门日剧榜", value: "ECNA46YBA" }, { title: "高分经典日剧榜", value: "ECBQCUATA" }, { title: "喜剧日剧榜", value: "ECWM5LNJI" }, { title: "爱情日剧榜", value: "ECEA5D2RQ" }, { title: "悬疑日剧榜", value: "ECHI5FDTQ" }, { title: "冷门佳作日剧榜", value: "ECEA5DW5Q" } ] },
                { name: "tv_sub_韩剧", title: "🔖 榜单名称", type: "enumeration", value: "ECBE5CBEI", belongTo: { paramName: "tv_cat", value: ["韩剧"] }, enumOptions: [ { title: "近期热门韩剧榜", value: "ECBE5CBEI" }, { title: "高分经典韩剧榜", value: "EC6EC5GBQ" }, { title: "喜剧韩剧榜", value: "ECS45ISKI" }, { title: "爱情韩剧榜", value: "ECOU5ECZQ" }, { title: "冷门佳作韩剧榜", value: "ECZY5IDOY" } ] },
                { name: "tv_sub_港剧", title: "🔖 榜单名称", type: "enumeration", value: "ECVM47WUA", belongTo: { paramName: "tv_cat", value: ["港剧"] }, enumOptions: [ { title: "高分经典港剧榜", value: "ECVM47WUA" }, { title: "喜剧港剧榜", value: "ECXI5EIII" }, { title: "爱情港剧榜", value: "EC3Y5ISIQ" }, { title: "古装港剧榜", value: "ECIE5FVTI" }, { title: "犯罪港剧榜", value: "EC3A46RGQ" }, { title: "冷门佳作港剧榜", value: "EC3U5ASKQ" } ] },
                { name: "tv_sub_台剧", title: "🔖 榜单名称", type: "enumeration", value: "ECBI5EL6A", belongTo: { paramName: "tv_cat", value: ["台剧"] }, enumOptions: [ { title: "高分经典台剧榜", value: "ECBI5EL6A" }, { title: "爱情台剧榜", value: "ECBU5LX3A" }, { title: "冷门佳作台剧榜", value: "ECJQ5LAFY" } ] },
                { name: "tv_sub_泰剧", title: "🔖 榜单名称", type: "enumeration", value: "ECRM5BIFQ", belongTo: { paramName: "tv_cat", value: ["泰剧"] }, enumOptions: [ { title: "高分经典泰剧榜", value: "ECRM5BIFQ" }, { title: "冷门佳作泰剧榜", value: "EC2Y5FJTY" } ] },
                { name: "tv_sub_欧洲剧", title: "🔖 榜单名称", type: "enumeration", value: "EC6I5FYHA", belongTo: { paramName: "tv_cat", value: ["欧洲剧"] }, enumOptions: [ { title: "近期热门欧洲剧榜", value: "EC6I5FYHA" }, { title: "高分经典欧洲剧榜", value: "ECZY5KBOQ" }, { title: "喜剧欧洲剧榜", value: "ECJQ5LPXY" }, { title: "爱情欧洲剧榜", value: "ECSA5KEKY" }, { title: "悬疑欧洲剧榜", value: "ECEU47F2I" }, { title: "犯罪欧洲剧榜", value: "ECGM5NIQA" }, { title: "冷门佳作欧洲剧榜", value: "ECTM5JVYA" } ] },
                { name: "tv_sub_动画剧集", title: "🔖 榜单名称", type: "enumeration", value: "ECR4CRXHA", belongTo: { paramName: "tv_cat", value: ["动画剧集"] }, enumOptions: [ { title: "高分经典动画剧集榜", value: "ECR4CRXHA" } ] },
                
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // --- 模块 6：豆瓣·Top 250 电影 ---
        {
            title: "豆瓣·Top 250 电影",
            requiresWebView: false,
            functionName: "loadDoubanTop250",
            params: [
                { name: "page", title: "页码", type: "page" },
                { name: "limit", title: "🔢 每页数量", type: "constant", value: "20" }
            ]
        },

        // --- 模块 7：豆瓣·电影推荐 ---
        {
            title: "豆瓣·电影推荐",
            requiresWebView: false,
            functionName: "loadDoubanRecommendMovies",
            params: [
                {
                    name: "category", title: "🏷️ 分类", type: "enumeration", value: "全部",
                    enumOptions: [ 
                        { title: "全部", value: "全部" }, { title: "热门电影", value: "热门" }, 
                        { title: "最新电影", value: "最新" }, { title: "豆瓣高分", value: "豆瓣高分" }, 
                        { title: "冷门佳片", value: "冷门佳片" } 
                    ]
                },
                {
                    name: "type", title: "🌍 地区", type: "enumeration", value: "全部",
                    belongTo: { paramName: "category", value: ["热门","最新","豆瓣高分","冷门佳片"] },
                    enumOptions: [ { title: "全部", value: "全部" }, { title: "华语", value: "华语" }, { title: "欧美", value: "欧美" }, { title: "韩国", value: "韩国" }, { title: "日本", value: "日本" } ]
                },
                {
                    name: "filter_genre", title: "🎭 类型", type: "enumeration", value: "",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "全部", value: "" }, { title: "喜剧", value: "喜剧" }, { title: "爱情", value: "爱情" }, { title: "动作", value: "动作" }, { title: "科幻", value: "科幻" }, { title: "动画", value: "动画" }, { title: "悬疑", value: "悬疑" }, { title: "犯罪", value: "犯罪" }, { title: "惊悚", value: "惊悚" }, { title: "冒险", value: "冒险" }, { title: "音乐", value: "音乐" }, { title: "历史", value: "历史" }, { title: "奇幻", value: "奇幻" }, { title: "恐怖", value: "恐怖" }, { title: "战争", value: "战争" }, { title: "传记", value: "传记" }, { title: "歌舞", value: "歌舞" }, { title: "武侠", value: "武侠" }, { title: "情色", value: "情色" }, { title: "灾难", value: "灾难" }, { title: "西部", value: "西部" }, { title: "纪录片", value: "纪录片" }, { title: "短片", value: "短片" }
                    ]
                },
                {
                    name: "filter_region", title: "🌍 地区", type: "enumeration", value: "",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "全部", value: "" }, { title: "华语", value: "华语" }, { title: "欧美", value: "欧美" }, { title: "韩国", value: "韩国" }, { title: "日本", value: "日本" }, { title: "中国大陆", value: "中国大陆" }, { title: "美国", value: "美国" }, { title: "中国香港", value: "中国香港" }, { title: "中国台湾", value: "中国台湾" }, { title: "英国", value: "英国" }, { title: "法国", value: "法国" }, { title: "德国", value: "德国" }, { title: "意大利", value: "意大利" }, { title: "西班牙", value: "西班牙" }, { title: "印度", value: "印度" }, { title: "泰国", value: "泰国" }, { title: "俄罗斯", value: "俄罗斯" }, { title: "加拿大", value: "加拿大" }, { title: "澳大利亚", value: "澳大利亚" }, { title: "爱尔兰", value: "爱尔兰" }, { title: "瑞典", value: "瑞典" }, { title: "巴西", value: "巴西" }, { title: "丹麦", value: "丹麦" }
                    ]
                },
                {
                    name: "filter_year", title: "📅 年代", type: "enumeration", value: "",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "全部", value: "" }, { title: "2020年代", value: "2020年代" }, { title: "2026", value: "2026" }, { title: "2025", value: "2025" }, { title: "2024", value: "2024" }, { title: "2023", value: "2023" }, { title: "2022", value: "2022" }, { title: "2021", value: "2021" }, { title: "2020", value: "2020" }, { title: "2019", value: "2019" }, { title: "2010年代", value: "2010年代" }, { title: "2000年代", value: "2000年代" }, { title: "90年代", value: "90年代" }, { title: "80年代", value: "80年代" }, { title: "70年代", value: "70年代" }, { title: "60年代", value: "60年代" }, { title: "更早", value: "更早" }
                    ]
                },
                {
                    name: "filter_sort", title: "🔽 排序方式", type: "enumeration", value: "U",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "近期热度", value: "U" }, { title: "综合排序", value: "T" }, { title: "首映时间", value: "R" }, { title: "高分优先", value: "S" }
                    ]
                },
                {
                    name: "filter_score", title: "⭐ 最低评分", type: "enumeration", value: "4",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "0", value: "0" }, { title: "1", value: "1" }, { title: "2", value: "2" }, { title: "3", value: "3" }, 
                        { title: "4", value: "4" }, { title: "5", value: "5" }, { title: "6", value: "6" }, { title: "7", value: "7" }, 
                        { title: "8", value: "8" }, { title: "9", value: "9" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // --- 模块 8：豆瓣·剧集推荐 ---
        {
            title: "豆瓣·剧集推荐",
            requiresWebView: false,
            functionName: "loadDoubanRecommendShows",
            params: [
                {
                    name: "category", title: "🏷️ 分类", type: "enumeration", value: "全部",
                    enumOptions: [
                        { title: "全部", value: "全部" }, { title: "综合", value: "tv" }, { title: "国产剧", value: "tv_domestic" }, 
                        { title: "欧美剧", value: "tv_american" }, { title: "日剧", value: "tv_japanese" }, 
                        { title: "韩剧", value: "tv_korean" }, { title: "动画", value: "tv_animation" }, 
                        { title: "综艺", value: "show" }, { title: "纪录片", value: "tv_documentary" } 
                    ]
                },
                {
                    name: "tv_filter_genre", title: "🎭 类型", type: "enumeration", value: "",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "全部", value: "" }, { title: "电视剧", value: "电视剧" }, { title: "综艺", value: "综艺" }, { title: "喜剧", value: "喜剧" }, { title: "爱情", value: "爱情" }, { title: "悬疑", value: "悬疑" }, { title: "动画", value: "动画" }, { title: "武侠", value: "武侠" }, { title: "古装", value: "古装" }, { title: "家庭", value: "家庭" }, { title: "犯罪", value: "犯罪" }, { title: "科幻", value: "科幻" }, { title: "恐怖", value: "恐怖" }, { title: "历史", value: "历史" }, { title: "战争", value: "战争" }, { title: "动作", value: "动作" }, { title: "冒险", value: "冒险" }, { title: "传记", value: "传记" }, { title: "剧情", value: "剧情" }, { title: "奇幻", value: "奇幻" }, { title: "惊悚", value: "惊悚" }, { title: "灾难", value: "灾难" }, { title: "歌舞", value: "歌舞" }, { title: "音乐", value: "音乐" }, { title: "真人秀", value: "真人秀" }, { title: "脱口秀", value: "脱口秀" }, { title: "动物", value: "动物" }, { title: "西部", value: "西部" }, { title: "史诗", value: "史诗" }, { title: "选秀", value: "选秀" }, { title: "运动", value: "运动" }, { title: "军事", value: "军事" }, { title: "都市", value: "都市" }, { title: "侦探", value: "侦探" }
                    ]
                },
                {
                    name: "tv_filter_region", title: "🌍 地区", type: "enumeration", value: "",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "全部", value: "" }, { title: "华语", value: "华语" }, { title: "欧美", value: "欧美" }, { title: "国外", value: "国外" }, { title: "韩国", value: "韩国" }, { title: "日本", value: "日本" }, { title: "中国大陆", value: "中国大陆" }, { title: "中国香港", value: "中国香港" }, { title: "美国", value: "美国" }, { title: "英国", value: "英国" }, { title: "泰国", value: "泰国" }, { title: "中国台湾", value: "中国台湾" }, { title: "意大利", value: "意大利" }, { title: "法国", value: "法国" }, { title: "德国", value: "德国" }, { title: "西班牙", value: "西班牙" }, { title: "俄罗斯", value: "俄罗斯" }, { title: "瑞典", value: "瑞典" }, { title: "巴西", value: "巴西" }, { title: "丹麦", value: "丹麦" }, { title: "印度", value: "印度" }, { title: "加拿大", value: "加拿大" }, { title: "爱尔兰", value: "爱尔兰" }, { title: "澳大利亚", value: "澳大利亚" }
                    ]
                },
                {
                    name: "tv_filter_year", title: "📅 年代", type: "enumeration", value: "",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "全部", value: "" }, { title: "2020年代", value: "2020年代" }, { title: "2026", value: "2026" }, { title: "2025", value: "2025" }, { title: "2024", value: "2024" }, { title: "2023", value: "2023" }, { title: "2022", value: "2022" }, { title: "2021", value: "2021" }, { title: "2020", value: "2020" }, { title: "2019", value: "2019" }, { title: "2010年代", value: "2010年代" }, { title: "2000年代", value: "2000年代" }, { title: "90年代", value: "90年代" }, { title: "80年代", value: "80年代" }, { title: "70年代", value: "70年代" }, { title: "60年代", value: "60年代" }, { title: "更早", value: "更早" }
                    ]
                },
                {
                    name: "tv_filter_platform", title: "📺 平台", type: "enumeration", value: "",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "全部", value: "" }, { title: "腾讯视频", value: "腾讯视频" }, { title: "爱奇艺", value: "爱奇艺" }, { title: "优酷", value: "优酷" }, { title: "湖南卫视", value: "湖南卫视" }, { title: "Netflix", value: "Netflix" }, { title: "HBO", value: "HBO" }, { title: "BBC", value: "BBC" }, { title: "NHK", value: "NHK" }, { title: "CBS", value: "CBS" }, { title: "NBC", value: "NBC" }, { title: "tvN", value: "tvN" }
                    ]
                },
                {
                    name: "tv_filter_sort", title: "🔽 排序方式", type: "enumeration", value: "U",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "近期热度", value: "U" }, { title: "综合排序", value: "T" }, { title: "首播时间", value: "R" }, { title: "高分优先", value: "S" }
                    ]
                },
                {
                    name: "tv_filter_score", title: "⭐ 最低评分", type: "enumeration", value: "4",
                    belongTo: { paramName: "category", value: ["全部"] },
                    enumOptions: [
                        { title: "0", value: "0" }, { title: "1", value: "1" }, { title: "2", value: "2" }, { title: "3", value: "3" }, 
                        { title: "4", value: "4" }, { title: "5", value: "5" }, { title: "6", value: "6" }, { title: "7", value: "7" }, 
                        { title: "8", value: "8" }, { title: "9", value: "9" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // --- 模块 9：豆瓣·影院热映 ---
        {
            title: "豆瓣·影院热映",
            requiresWebView: false,
            functionName: "loadDoubanInTheaters",
            params: [
                { name: "page", title: "页码", type: "page" }
            ]
        }
    ]
};

// ==========================================
// 💡 统一转换引擎：处理所有豆瓣流进入 TMDB
// ==========================================
async function processAndEnhanceDoubanItems(rawItems) {
    const validItems = rawItems.filter(i => {
        const strictType = String(i.type || "").toLowerCase();
        if (strictType === "playlist" || strictType === "ad") return false; 
        const t = String(i.item_type || i.type || "").toLowerCase();
        return t === "movie" || t === "tv" || t === "subject";
    });

    const fetchPromises = validItems.map(async (item) => {
        if (!item.title) return null;

        const originalTitle = String(item.title).trim();
        let searchTitle = originalTitle;

        let searchType = "multi";
        const rawType = String(item.item_type || item.type || "").toLowerCase();
        if (rawType === "movie") searchType = "movie";
        else if (rawType === "tv") searchType = "tv";

        if (searchType === "tv" || searchType === "multi") {
            const seasonRegex = /(.+?)\s*(?:第([一二三四五六七八九十零百\d]+)季|Season\s*\d+|S\d+)(?:\s*.*)?$/i;
            const match = originalTitle.match(seasonRegex);
            if (match) {
                searchTitle = match[1].trim(); 
            }
        }

        let releaseYear = item.year || "";
        if (!releaseYear && item.card_subtitle) {
            const yearMatch = String(item.card_subtitle).match(/^(\d{4})/);
            if (yearMatch) releaseYear = yearMatch[1];
        } else if (!releaseYear && item.release_date) {
            releaseYear = String(item.release_date).substring(0, 4);
        }
        const extractedGenres = extractGenresFromText(item.card_subtitle || item.description || item.info || "");

        try {
            const searchParams = { query: searchTitle, language: 'zh-CN' };
            if (releaseYear && searchType !== "multi") {
                searchParams.year = releaseYear;
            }

            let tmdbResponse = await Widget.tmdb.get(`/search/${searchType}`, { params: searchParams });
            let tmdbResults = tmdbResponse.data ? tmdbResponse.data.results : tmdbResponse.results;

            if ((!tmdbResults || tmdbResults.length === 0) && releaseYear && searchType !== "multi") {
                delete searchParams.year; 
                const retryResp = await Widget.tmdb.get(`/search/${searchType}`, { params: searchParams });
                tmdbResults = retryResp.data ? retryResp.data.results : retryResp.results;
            }

            if (!tmdbResults || tmdbResults.length === 0) {
                let fallbackTitle = searchTitle;
                let titleChanged = false;

                if (fallbackTitle.includes("·")) {
                    fallbackTitle = fallbackTitle.split("·")[0].trim();
                    titleChanged = true;
                }
                
                const numSuffixRegex = /^(.*?[^\d\s])\s*\d+$/; 
                const matchNum = fallbackTitle.match(numSuffixRegex);
                if (matchNum) {
                    fallbackTitle = matchNum[1].trim();
                    titleChanged = true;
                }

                if (titleChanged && fallbackTitle) {
                    searchTitle = fallbackTitle; 
                    searchParams.query = fallbackTitle;
                    delete searchParams.year;    
                    const fallbackResp = await Widget.tmdb.get(`/search/${searchType}`, { params: searchParams });
                    tmdbResults = fallbackResp.data ? fallbackResp.data.results : fallbackResp.results;
                }
            }

            if (tmdbResults && tmdbResults.length > 0) {
                if (searchType === "multi") {
                    tmdbResults = tmdbResults.filter(r => r.media_type !== "person"); 
                }

                let bestMatch = tmdbResults.find(r => {
                    const tTitle = (r.title || r.name || "").trim();
                    const tOrig = (r.original_title || r.original_name || "").trim();
                    return tTitle === searchTitle || tOrig === searchTitle;
                });

                if (!bestMatch && tmdbResults.length > 0) {
                    bestMatch = tmdbResults[0];
                }

                if (bestMatch && bestMatch.id) {
                    return {
                        id: String(bestMatch.id),
                        type: "tmdb",
                        title: originalTitle,
                        description: bestMatch.overview || item.card_subtitle || item.description || item.info || "",
                        releaseDate: releaseYear || bestMatch.release_date || bestMatch.first_air_date || "",
                        posterPath: bestMatch.poster_path ? `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}` : extractDoubanCover(item),
                        backdropPath: bestMatch.backdrop_path ? `https://image.tmdb.org/t/p/w780${bestMatch.backdrop_path}` : "",
                        rating: bestMatch.vote_average ? String(bestMatch.vote_average.toFixed(1)) : (item.rating?.value ? String(item.rating.value) : "0"),
                        mediaType: bestMatch.media_type || (searchType === "multi" ? "movie" : searchType),
                        genreTitle: extractedGenres
                    };
                }
            }
            return null;
        } catch (error) {
            console.error(`[${originalTitle}] TMDB检索异常:`, error);
            return null;
        }
    });

    const results = await Promise.all(fetchPromises);
    return results.filter(i => i !== null);
}

// ==========================================
// 辅助工具函数
// ==========================================
function extractGenresFromText(text) {
    if (!text) return "";
    const genreKeywords = ["动作", "科幻", "灾难", "爱情", "喜剧", "悬疑", "犯罪", "冒险", "奇幻", "战争", "历史", "武侠", "惊悚", "恐怖", "情色", "动画", "剧情", "西部", "家庭", "音乐", "运动", "古装", "歌舞", "传记", "短片", "纪录片", "真人秀", "脱口秀", "综艺"];
    const parts = text.split(/[\/／]/).map(p => p.trim());
    for (const part of parts) {
        const words = part.split(/[\s、]+/);
        if (words.some(w => genreKeywords.includes(w))) return part;
    }
    return "";
}

function extractDoubanCover(item) {
    return item.cover_url || (item.pic && item.pic.normal) || (item.cover && item.cover.url) || "";
}

function parseDoubanAppDispatchUrl(url) {
    const match = url.match(/uri=([^&]+)/);
    if (!match) return url;
    const uri = decodeURIComponent(match[1]);
    const cleanUri = uri.startsWith('/') ? uri.substring(1) : uri;
    if (cleanUri.includes('subject_collection/')) return `https://m.douban.com/${cleanUri}`;
    else if (cleanUri.includes('doulist/')) return `https://www.douban.com/${cleanUri}`;
    return url;
}

function getPageParams(params, count = 20) {
    let page = parseInt(params.page) || 1;
    let start = (page - 1) * count;
    return { start, count };
}

// ==========================================
// 模块路由出口 (完全独立的9大模块解析器)
// ==========================================

// 1. 豆瓣·自定义片单
async function loadDoubanCustomList(params = {}) {
    let url = params.url;
    if (!url) return []; 
    if (url.includes("doubanapp/dispatch")) url = parseDoubanAppDispatchUrl(url);

    if (url.includes("douban.com/doulist/") || url.includes("m.douban.com/doulist/")) {
        const listIdMatch = url.match(/doulist\/(\d+)/);
        if (!listIdMatch) return [];
        const { start } = getPageParams(params, 25);
        const pageUrl = `https://www.douban.com/doulist/${listIdMatch[1]}/?start=${start}&sort=seq&playable=0&sub_type=`;
        
        const response = await Widget.http.get(pageUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        const docId = Widget.dom.parse(response.data);
        const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");

        let doubanItems = [];
        for (const itemId of videoElementIds) {
            const text = await Widget.dom.text(itemId);
            const chineseTitle = text.trim().split(' ')[0]; 
            if (chineseTitle) doubanItems.push({ title: chineseTitle, type: "subject" });
        }
        return await processAndEnhanceDoubanItems(doubanItems);
    } 
    else if (url.includes("subject_collection/")) {
        const listIdMatch = url.match(/subject_collection\/(\w+)/);
        if (!listIdMatch) return [];
        const { start, count } = getPageParams(params, 20);
        const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listIdMatch[1]}/items?start=${start}&count=${count}&items_only=1&for_mobile=1`;
        
        const response = await Widget.http.get(apiUrl, { headers: { Referer: url, "User-Agent": "Mozilla/5.0" } });
        return await processAndEnhanceDoubanItems(response.data.subject_collection_items || []);
    }
    return [];
}

// 2. 豆瓣·热门电影
async function loadDoubanHotGaia(params = {}) {
    const { start, count } = getPageParams(params, 20);
    const area = params.area || "全部";
    const sort = params.sort || "recommend";
    
    const apiUrl = `https://m.douban.com/rexxar/api/v2/movie/hot_gaia?area=${encodeURIComponent(area)}&sort=${sort}&playable=0&loc_id=0&start=${start}&count=${count}&for_mobile=1`;
    const response = await Widget.http.get(apiUrl, { headers: { Referer: "https://m.douban.com/movie/", "User-Agent": "Mozilla/5.0" } });
    
    let rawItems = response.data?.items || [];
    return await processAndEnhanceDoubanItems(rawItems);
}

// 3. 豆瓣·实时热榜
async function loadDoubanHotList(params = {}) {
    const hotType = params.hot_type || "movie_real_time_hotest";
    const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${hotType}/items?updated_at&items_only=1&for_mobile=1`;
    const response = await Widget.http.get(apiUrl, { headers: { Referer: "https://m.douban.com/", "User-Agent": "Mozilla/5.0" } });
    return await processAndEnhanceDoubanItems(response.data.subject_collection_items || []);
}

// 4. 豆瓣·一周口碑榜
async function loadDoubanWeeklyBest(params = {}) {
    const { start, count } = getPageParams(params, 20);
    const listType = params.list_type || "movie_weekly_best";
    
    const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listType}/items?start=${start}&count=${count}&items_only=1&for_mobile=1`;
    const response = await Widget.http.get(apiUrl, { headers: { Referer: "https://m.douban.com/", "User-Agent": "Mozilla/5.0" } });
    return await processAndEnhanceDoubanItems(response.data.subject_collection_items || []);
}

// 5. 豆瓣·类型榜单大全
async function loadDoubanGenreRankings(params = {}) {
    const { start, count } = getPageParams(params, 20);
    
    let targetPathId = "";
    if (params.media_type === "movie") {
        const currentCat = params.movie_cat || "剧情";
        targetPathId = params[`movie_sub_${currentCat}`];
    } else {
        const currentCat = params.tv_cat || "大陆剧"; 
        targetPathId = params[`tv_sub_${currentCat}`];
    }

    if (!targetPathId) return [];

    const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${targetPathId}/items?start=${start}&count=${count}&items_only=1&for_mobile=1`;
    const response = await Widget.http.get(apiUrl, { headers: { Referer: `https://m.douban.com/subject_collection/${targetPathId}`, "User-Agent": "Mozilla/5.0" } });
    
    return await processAndEnhanceDoubanItems(response.data.subject_collection_items || []);
}

// 6. 豆瓣·Top 250 电影
async function loadDoubanTop250(params = {}) {
    const limit = parseInt(params.limit) || 20;
    const { start, count } = getPageParams(params, limit);
    const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/movie_top250/items?start=${start}&count=${count}&items_only=1&for_mobile=1`;
    const response = await Widget.http.get(apiUrl, { headers: { Referer: "https://m.douban.com/", "User-Agent": "Mozilla/5.0" } });
    return await processAndEnhanceDoubanItems(response.data.subject_collection_items || []);
}

// 7. 豆瓣·电影推荐
async function loadDoubanRecommendMovies(params = {}) {
    const limit = parseInt(params.limit) || 20;
    const { start, count } = getPageParams(params, limit);
    const category = params.category || "全部";
    
    let apiUrl;
    if (category === "全部") {
        const sortMode = params.filter_sort || "U";
        const minScore = params.filter_score || "4";
        
        let tagsArray = [];
        if (params.filter_genre) tagsArray.push(params.filter_genre);
        if (params.filter_region) tagsArray.push(params.filter_region);
        if (params.filter_year) tagsArray.push(params.filter_year);
        
        let tagsQuery = tagsArray.length > 0 ? `&tags=${encodeURIComponent(tagsArray.join(','))}` : "";
        apiUrl = `https://m.douban.com/rexxar/api/v2/movie/recommend?refresh=0&start=${start}&count=${count}&uncollect=false&score_range=${minScore},10${tagsQuery}&sort=${sortMode}`;
    } else {
        const subType = params.type || "全部";
        apiUrl = `https://m.douban.com/rexxar/api/v2/subject/recent_hot/movie?start=${start}&count=${count}&category=${encodeURIComponent(category)}&type=${encodeURIComponent(subType)}`;
    }
    
    const response = await Widget.http.get(apiUrl, { headers: { Referer: "https://movie.douban.com/explore", "User-Agent": "Mozilla/5.0" } });
    let rawItems = response.data?.subjects || response.data?.items || [];
    
    let validItems = rawItems.filter(i => {
        const strictType = String(i.type || "").toLowerCase();
        if (strictType === "playlist" || strictType === "ad") return false; 
        const t = String(i.item_type || i.type || "").toLowerCase();
        return t === "movie" || t === "tv" || t === "subject";
    });

    return await processAndEnhanceDoubanItems(validItems);
}

// 8. 豆瓣·剧集推荐
async function loadDoubanRecommendShows(params = {}) {
    const limit = parseInt(params.limit) || 20;
    const { start, count } = getPageParams(params, limit);
    const category = params.category || "全部";
    
    let apiUrl;
    if (category === "全部") {
        const sortMode = params.tv_filter_sort || "U";
        const minScore = params.tv_filter_score || "4";
        
        let tagsArray = [];
        if (params.tv_filter_genre) tagsArray.push(params.tv_filter_genre);
        if (params.tv_filter_region) tagsArray.push(params.tv_filter_region);
        if (params.tv_filter_year) tagsArray.push(params.tv_filter_year);
        if (params.tv_filter_platform) tagsArray.push(params.tv_filter_platform);
        
        let tagsQuery = tagsArray.length > 0 ? `&tags=${encodeURIComponent(tagsArray.join(','))}` : "";
        apiUrl = `https://m.douban.com/rexxar/api/v2/tv/recommend?refresh=0&start=${start}&count=${count}&uncollect=false&score_range=${minScore},10${tagsQuery}&sort=${sortMode}`;
    } else {
        apiUrl = `https://m.douban.com/rexxar/api/v2/subject/recent_hot/tv?start=${start}&count=${count}&category=热门&type=${encodeURIComponent(category)}`;
    }
    
    const response = await Widget.http.get(apiUrl, { headers: { Referer: "https://movie.douban.com/explore", "User-Agent": "Mozilla/5.0" } });
    
    let rawItems = response.data?.subjects || response.data?.items || [];
    let validItems = rawItems.filter(i => {
        const strictType = String(i.type || "").toLowerCase();
        if (strictType === "playlist" || strictType === "ad") return false; 
        const t = String(i.item_type || i.type || "").toLowerCase();
        return t === "movie" || t === "tv" || t === "subject";
    });

    return await processAndEnhanceDoubanItems(validItems);
}

// 9. 豆瓣·影院热映
async function loadDoubanInTheaters(params = {}) {
    const { start, count } = getPageParams(params, 20);
    const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/movie_showing/items?start=${start}&count=${count}&items_only=1&for_mobile=1`;
    
    const response = await Widget.http.get(apiUrl, { headers: { Referer: "https://m.douban.com/", "User-Agent": "Mozilla/5.0" } });
    return await processAndEnhanceDoubanItems(response.data.subject_collection_items || []);
}


