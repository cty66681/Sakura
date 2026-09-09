/* =========================================================
   TYPES
========================================================= */

export type JobSearchConceptType =
  | "category"
  | "occupation"
  | "technology"
  | "location"
  | "language"
  | "employment"
  | "condition";

export interface JobSearchConcept {
  key: string;
  type: JobSearchConceptType;
  aliases: string[];

  /**
   * 父级搜索概念。
   *
   * 只用于：
   * 父级搜索 -> 向下包含子级。
   *
   * 不允许：
   * 子级搜索 -> 返回父级
   * 子级搜索 -> 返回兄弟级
   */
  parentId?: string;
}

export interface ParsedJobSearchGroup {
  key: string;
  type: JobSearchConceptType | "literal";
  query: string;

  /**
   * 精准概念的同义词。
   */
  aliases: string[];

  /**
   * 父级 / 子级 / 关联概念的词。
   *
   * 后续搜索评分会比 aliases 分数低。
   */
  relatedAliases: string[];
}

/* =========================================================
   NORMALIZE
========================================================= */

export function normalizeJobSearchText(
  value: string
) {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(
      /[・·.,，。!！?？:：;；'"“”‘’()（）[\]【】{}<>《》\-_/／｜|]/g,
      ""
    );
}

/* =========================================================
   NOISE WORDS
========================================================= */

/*
 * 用户会自然输入：
 *
 * 按摩店
 * 整体院
 * 仓库工作
 * IT招聘
 * 不动产公司
 *
 * 这些后缀本身通常不应该成为必须匹配的关键词。
 */

export const JOB_SEARCH_NOISE_WORDS = [
  "找工作",
  "找兼职",
  "找职位",
  "求职",

  "工作",
  "职位",
  "岗位",
  "招聘",
  "招人",
  "求人",

  "店铺",
  "店舗",
  "店",

  "院",
  "馆",
  "館",
  "会馆",
  "會館",
  "中心",

  "工作室",
  "事务所",
  "事務所",

  "公司",
  "会社",

  "ショップ",
  "サロン",
] as const;

/* =========================================================
   CONCEPT DICTIONARY
========================================================= */

export const JOB_SEARCH_CONCEPTS: JobSearchConcept[] = [
  /* =======================================================
     LANGUAGE / FOREIGNER
  ======================================================= */

  {
    key: "chinese",
    type: "language",
    aliases: [
      "华人",
      "中国人",
      "中文",
      "中文可",
      "中文对应",
      "中文対応",
      "中国语",
      "中国語",
      "中国語可",
      "中国語対応",
      "chinese",
    ],
  },

  {
    key: "foreigner",
    type: "condition",
    aliases: [
      "外国人",
      "外国籍",
      "外国人可",
      "外国人欢迎",
      "外国人歓迎",
      "外国人採用",
      "外国人雇用",
      "foreigner",
    ],
  },

  {
    key: "no-japanese",
    type: "language",
    aliases: [
      "不会日语",
      "不需要日语",
      "日语不要",
      "日语不要求",
      "日語不要",
      "日本語不要",
      "日本語不問",
      "日本語なし",
    ],
  },

  /* =======================================================
     LOCATION
  ======================================================= */

  {
    key: "tokyo",
    type: "location",
    aliases: [
      "东京",
      "東京",
      "tokyo",
    ],
  },

  {
    key: "kanagawa",
    type: "location",
    aliases: [
      "神奈川",
      "kanagawa",
    ],
  },

  {
    key: "saitama",
    type: "location",
    aliases: [
      "埼玉",
      "saitama",
    ],
  },

  {
    key: "chiba",
    type: "location",
    aliases: [
      "千叶",
      "千葉",
      "chiba",
    ],
  },

  {
    key: "osaka",
    type: "location",
    aliases: [
      "大阪",
      "osaka",
    ],
  },

  {
    key: "kyoto",
    type: "location",
    aliases: [
      "京都",
      "kyoto",
    ],
  },

  {
    key: "hyogo",
    type: "location",
    aliases: [
      "兵库",
      "兵庫",
      "hyogo",
    ],
  },

  {
    key: "aichi",
    type: "location",
    aliases: [
      "爱知",
      "愛知",
      "aichi",
    ],
  },

  {
    key: "fukuoka",
    type: "location",
    aliases: [
      "福冈",
      "福岡",
      "fukuoka",
    ],
  },

  {
    key: "hokkaido",
    type: "location",
    aliases: [
      "北海道",
      "hokkaido",
    ],
  },

  {
    key: "ikebukuro",
    type: "location",
    aliases: [
      "池袋",
    ],
  },

  {
    key: "shinjuku",
    type: "location",
    aliases: [
      "新宿",
    ],
  },

  {
    key: "shibuya",
    type: "location",
    aliases: [
      "涩谷",
      "渋谷",
    ],
  },

  {
    key: "ueno",
    type: "location",
    aliases: [
      "上野",
    ],
  },

  {
    key: "akihabara",
    type: "location",
    aliases: [
      "秋叶原",
      "秋葉原",
      "秋葉",
      "秋叶",
    ],
  },

  /* =======================================================
     IT — CATEGORY
  ======================================================= */

  {
    key: "it",
    type: "category",
    aliases: [
      "it",
      "it技术",
      "技术",
      "科技",
      "程序员",
      "程序猿",
      "开发",
      "开发工程师",
      "软件工程师",
      "软件开发",
      "工程师",
      "エンジニア",
      "itエンジニア",
      "システムエンジニア",
    ],
  },

  /* =======================================================
     IT — OCCUPATION
  ======================================================= */

  {
    key: "backend",
    type: "occupation",
    aliases: [
      "后端",
      "后端开发",
      "后端工程师",
      "后台开发",
      "backend",
      "backendengineer",
      "server",
      "serverside",
      "サーバーサイド",
      "サーバーサイドエンジニア",
    ],
  },

  {
    key: "frontend",
    type: "occupation",
    aliases: [
      "前端",
      "前端开发",
      "前端工程师",
      "frontend",
      "frontendengineer",
      "フロントエンド",
      "フロントエンドエンジニア",
    ],
  },

  {
    key: "ai-data",
    type: "occupation",
    aliases: [
      "ai开发",
      "ai工程师",
      "aiエンジニア",
      "人工智能开发",
      "人工知能開発",
      "数据工程师",
      "数据分析",
      "数据分析师",
      "データエンジニア",
      "データサイエンティスト",
    ],
  },

  {
    key: "cloud-infra",
    type: "occupation",
    aliases: [
      "运维",
      "運維",
      "infra",
      "infrastructure",
      "基础设施",
      "インフラ",
      "インフラエンジニア",
      "cloud",
      "云计算",
      "クラウド",
      "クラウドエンジニア",
      "devops",
      "sre",
    ],
  },

  {
    key: "qa",
    type: "occupation",
    aliases: [
      "测试",
      "软件测试",
      "测试工程师",
      "qa",
      "tester",
      "テスト",
      "テスター",
      "qaエンジニア",
    ],
  },

  {
    key: "pm-se",
    type: "occupation",
    aliases: [
      "pm",
      "项目经理",
      "项目管理",
      "プロジェクトマネージャー",
      "se",
      "システムエンジニア",
    ],
  },

  /* =======================================================
     IT — TECHNOLOGY
  ======================================================= */

  {
    key: "java",
    type: "technology",
    aliases: [
      "java",
      "java开发",
      "java工程师",
      "javaエンジニア",
    ],
  },

  {
    key: "python",
    type: "technology",
    aliases: [
      "python",
      "python开发",
      "python工程师",
      "pythonエンジニア",
    ],
  },

  {
    key: "react",
    type: "technology",
    aliases: [
      "react",
      "reactjs",
      "react.js",
    ],
  },

  {
    key: "nextjs",
    type: "technology",
    aliases: [
      "next",
      "nextjs",
      "next.js",
    ],
  },

  {
    key: "vue",
    type: "technology",
    aliases: [
      "vue",
      "vuejs",
      "vue.js",
    ],
  },

  {
    key: "typescript",
    type: "technology",
    aliases: [
      "typescript",
      "ts",
    ],
  },

  {
    key: "javascript",
    type: "technology",
    aliases: [
      "javascript",
      "js",
    ],
  },

  {
    key: "ai",
    type: "technology",
    aliases: [
      "ai",
      "人工智能",
      "人工知能",
      "机器学习",
      "機械学習",
      "machinelearning",
      "ml",
      "深度学习",
      "深層学習",
    ],
  },

  {
    key: "aws",
    type: "technology",
    aliases: [
      "aws",
      "amazonwebservices",
    ],
  },

  /* =======================================================
     REAL ESTATE
  ======================================================= */

  {
    key: "real-estate",
    type: "category",
    aliases: [
      "不动产",
      "不動産",
      "房地产",
      "房产",
      "房地產",
      "地产",
      "地產",
      "房地产行业",
      "不动产行业",
      "不動産業界",
      "realestate",
    ],
  },

  {
    key: "real-estate-sales",
    type: "occupation",
    aliases: [
      "不动产营业",
      "不動産営業",
      "房地产销售",
      "房产销售",
      "房地产营业",
      "房产营业",
      "不动产销售",
      "地产销售",
    ],
  },

  {
    key: "rental-brokerage",
    type: "occupation",
    aliases: [
        "租赁中介",
        "租房中介",
        "房屋中介",
        "賃貸仲介",
        "賃貸営業",
        "租赁营业",
    ],
  },

  {
    key: "sales-brokerage",
    type: "occupation",
    aliases: [
      "买卖仲介",
      "买卖中介",
      "房产买卖",
      "房地产买卖",
      "売買仲介",
      "売買営業",
      "売買",
    ],
  },

  {
    key: "property-management",
    type: "occupation",
    aliases: [
      "物业管理",
      "物業管理",
      "物件管理",
      "房屋管理",
      "房产管理",
      "房地产管理",
      "不动产管理",
      "不動産管理",
      "賃貸管理",
      "管理会社",
      "物业",
    ],
  },

  {
    key: "real-estate-office",
    type: "occupation",
    aliases: [
      "不动产事务",
      "不動産事務",
      "房地产事务",
      "房产事务",
      "不动产文员",
      "不動産スタッフ",
      "不動産アシスタント",
    ],
  },

  {
    key: "takken",
    type: "occupation",
    aliases: [
      "宅建",
      "宅建士",
      "宅地建物取引士",
      "宅建事务",
      "宅建事務",
      "宅建資格",
    ],
  },

  /* =======================================================
     CONSTRUCTION
  ======================================================= */

  {
    key: "construction",
    type: "category",
    aliases: [
      "建筑",
      "建築",
      "建设",
      "建設",
      "建筑工",
      "建設業",
      "建筑现场",
      "建筑工地",
      "现场工作",
      "現場仕事",
    ],
  },

  {
    key: "construction-management",
    type: "occupation",
    aliases: [
      "施工管理",
      "施工管理员",
      "施工管理技士",
      "现场管理",
      "現場管理",
      "工程管理",
    ],
  },

  {
    key: "interior",
    type: "occupation",
    aliases: [
      "内装",
      "装修",
      "室内装修",
      "内装工",
      "内装施工",
      "リフォーム",
    ],
  },

  {
    key: "electrician",
    type: "occupation",
    aliases: [
      "电工",
      "電工",
      "電気工事",
      "电气工程",
      "電気工事士",
      "电气工",
    ],
  },

  {
    key: "equipment",
    type: "occupation",
    aliases: [
      "设备",
      "設備",
      "设备安装",
      "設備工事",
      "配管",
      "空调设备",
      "空調設備",
    ],
  },

  {
    key: "demolition",
    type: "occupation",
    aliases: [
      "解体",
      "拆除",
      "拆迁",
      "解体工",
    ],
  },

  {
    key: "waterproof-paint",
    type: "occupation",
    aliases: [
      "防水",
      "防水工",
      "涂装",
      "塗装",
      "油漆",
      "ペンキ",
    ],
  },

  /* =======================================================
     LOGISTICS / DELIVERY
  ======================================================= */

  {
    key: "logistics",
    type: "category",
    aliases: [
      "物流",
      "运输",
      "運輸",
      "物流运输",
      "物流業",
      "物流工作",
    ],
  },

    {
    key: "delivery",
    type: "occupation",

    aliases: [
        "配送",
        "送货",
        "送貨",
        "配達",
        "宅配",
        "配送员",
        "配送员工作",
        "配送スタッフ",
        "配送ドライバー",
        "快递",
        "快遞",
        "快递员",
        "courier",
        "delivery",
    ],
    },

  /*
   * 外卖属于配送，但搜索“外卖”时应该更精准。
   * 后续做排序时：
   * food-delivery 精准结果 > 普通 delivery。
   */

  {
    key: "food-delivery",
    type: "occupation",
    parentId: "delivery",

    aliases: [
      "外卖",
      "外賣",
      "送餐",
      "送餐员",
      "餐饮配送",
      "餐饮外送",
      "フードデリバリー",
      "料理配達",
      "飲食デリバリー",
      "fooddelivery",
    ],
  },

  {
    key: "driver",
    type: "occupation",
    aliases: [
      "司机",
      "驾驶员",
      "驾驶",
      "司機",
      "運転手",
      "ドライバー",
      "司机工作",
      "运输司机",
    ],
  },

  {
    key: "light-cargo",
    type: "occupation",
    parentId: "delivery",
    aliases: [
      "轻货",
      "軽貨物",
      "轻型货运",
      "軽貨物配送",
      "轻货司机",
      "軽貨物ドライバー",
    ],
  },

  {
    key: "warehouse",
    type: "occupation",
    aliases: [
      "仓库",
      "倉庫",
      "仓储",
      "物流仓库",
      "物流倉庫",
      "物流中心",
      "物流センター",
      "仓库作业",
      "倉庫作業",
      "仓库员",
      "仕分け",
      "分拣",
      "拣货",
      "ピッキング",
    ],
  },

  {
    key: "moving",
    type: "occupation",
    aliases: [
      "搬家",
      "搬运",
      "搬運",
      "引越",
      "引っ越し",
      "引越し",
      "搬家工",
    ],
  },

  /* =======================================================
     ECOMMERCE / OFFICE
  ======================================================= */

  {
    key: "ecommerce-office",
    type: "category",
    aliases: [
      "电商",
      "電商",
      "办公室",
      "办公",
      "office",
      "办公室工作",
      "オフィス",
      "事務職",
    ],
  },

  {
    key: "ecommerce",
    type: "occupation",
    aliases: [
      "网店",
      "网店运营",
      "网络店铺",
      "电商运营",
      "ec",
      "ec运营",
      "ec運営",
      "ネットショップ",
      "ネットショップ運営",
      "楽天运营",
      "乐天运营",
      "楽天",
      "amazon运营",
      "amazon",
    ],
  },

  {
    key: "customer-support",
    type: "occupation",
    aliases: [
      "客服",
      "客户服务",
      "客服人员",
      "客服工作",
      "客户对应",
      "カスタマーサポート",
      "カスタマーサービス",
      "cs",
      "コールセンター",
      "电话客服",
      "電話対応",
    ],
  },

  {
    key: "office-work",
    type: "occupation",
    aliases: [
      "事务",
      "事务员",
      "文员",
      "办公室事务",
      "一般事務",
      "事務",
      "事務員",
      "officework",
    ],
  },

  {
    key: "translation",
    type: "occupation",
    aliases: [
      "翻译",
      "翻譯",
      "笔译",
      "口译",
      "翻訳",
      "通訳",
      "翻译工作",
      "中日翻译",
      "日中翻译",
    ],
  },

  {
    key: "sales",
    type: "occupation",
    aliases: [
      "销售",
      "銷售",
      "销售员",
      "营业",
      "営業",
      "営業職",
      "セールス",
      "业务员",
    ],
  },

  /* =======================================================
     SERVICE / RESTAURANT
  ======================================================= */

  {
    key: "service",
    type: "category",
    aliases: [
      "服务业",
      "服務業",
      "接客",
      "服务工作",
      "サービス業",
    ],
  },

  {
    key: "restaurant",
    type: "occupation",
    aliases: [
      "餐饮",
      "餐飲",
      "餐厅",
      "餐廳",
      "饭店",
      "饭馆",
      "料理店",
      "饮食店",
      "飲食",
      "飲食店",
      "レストラン",
      "居酒屋",
      "餐饮店",
    ],
  },

  {
    key: "convenience-store",
    type: "occupation",
    aliases: [
      "便利店",
      "便利商店",
      "コンビニ",
      "コンビニエンスストア",
      "便利店员",
      "コンビニスタッフ",
    ],
  },

  {
    key: "hotel",
    type: "occupation",
    aliases: [
      "酒店",
      "宾馆",
      "旅馆",
      "ホテル",
      "旅館",
      "酒店前台",
      "ホテルスタッフ",
      "ホテルフロント",
    ],
  },

  {
    key: "cleaning",
    type: "occupation",
    aliases: [
      "清扫",
      "清掃",
      "清洁",
      "清潔",
      "保洁",
      "保潔",
      "打扫",
      "打掃",
      "卫生清洁",
      "清扫员",
      "清掃員",
      "清掃スタッフ",
      "清洁工",
      "保洁员",
      "cleaning",
      "cleaner",
      "ビル清掃",
      "酒店清扫",
      "ホテル清掃",
    ],
  },

  /* =======================================================
     MANUFACTURING
  ======================================================= */

  {
    key: "manufacturing",
    type: "category",
    aliases: [
      "工厂",
      "工廠",
      "工場",
      "制造",
      "製造",
      "生产",
      "生產",
      "生产线",
      "工厂工作",
      "工場勤務",
    ],
  },

  {
    key: "food-manufacturing",
    type: "occupation",
    aliases: [
      "食品制造",
      "食品製造",
      "食品工厂",
      "食品工場",
      "食品加工",
      "食品生产",
    ],
  },

  {
    key: "assembly",
    type: "occupation",
    aliases: [
      "组装",
      "組立",
      "組み立て",
      "装配",
      "assembly",
    ],
  },

  {
    key: "processing",
    type: "occupation",
    aliases: [
      "加工",
      "机械加工",
      "機械加工",
      "金属加工",
      "食品加工",
    ],
  },

  {
    key: "inspection",
    type: "occupation",
    aliases: [
      "检品",
      "検品",
      "检查",
      "検査",
      "品质检查",
      "品質検査",
    ],
  },

  {
    key: "packing",
    type: "occupation",
    aliases: [
      "包装",
      "打包",
      "包裝",
      "梱包",
      "包装员",
      "packing",
    ],
  },

  /* =======================================================
     BEAUTY / MASSAGE
  ======================================================= */

  {
    key: "massage",
    type: "occupation",
    aliases: [
      "按摩",
      "按摩师",
      "按摩師",

      "按摩店",
      "按摩院",
      "按摩馆",
      "按摩館",
      "按摩中心",
      "按摩会馆",
      "按摩會館",
      "按摩工作室",

      "整体",
      "整體",
      "整体师",
      "整体師",

      "整体店",
      "整体院",
      "整体馆",
      "整体館",
      "整体中心",
      "整体工作室",

      "正规按摩",
      "正規按摩",
      "正规按摩店",

      "リラクゼーション",
      "リラクゼーション店",
      "リラクゼーションサロン",
      "リラク",
      "リラク店",

      "マッサージ",
      "マッサージ店",

      "セラピスト",
      "施術",
      "施術者",

      "ボディケア",
      "もみほぐし",
      "揉みほぐし",
    ],
  },

  {
    key: "beauty",
    type: "occupation",
    aliases: [
      "美容",
      "美容师",
      "美容師",
      "美容院",
      "美容店",
      "美容行业",
      "エステ",
      "エステ店",
      "エステサロン",
      "エステティシャン",
    ],
  },

  {
    key: "nail",
    type: "occupation",
    aliases: [
      "美甲",
      "美甲师",
      "美甲師",
      "美甲店",
      "美甲沙龙",
      "ネイル",
      "ネイルサロン",
      "ネイリスト",
    ],
  },

  {
    key: "hair",
    type: "occupation",
    aliases: [
      "美发",
      "美髮",
      "美发师",
      "美发店",
      "理发",
      "理髮",
      "理发师",
      "美容室",
      "美容師",
      "ヘアサロン",
      "スタイリスト",
      "理容師",
    ],
  },

  {
    key: "shop-front",
    type: "occupation",
    aliases: [
      "店铺前台",
      "店面前台",
      "前台",
      "受付",
      "店舗受付",
      "店铺接待",
    ],
  },

  /* =======================================================
     CARE / PROFESSIONAL
  ======================================================= */

  {
    key: "care",
    type: "occupation",
    aliases: [
      "介护",
      "介護",
      "介护员",
      "介護職",
      "介護スタッフ",
      "护理",
      "老人护理",
      "老人介护",
      "老人ホーム",
    ],
  },

  {
    key: "nursing-assistant",
    type: "occupation",
    aliases: [
      "看护辅助",
      "看護補助",
      "护士辅助",
      "护理辅助",
      "看護助手",
      "ナースエイド",
    ],
  },

  {
    key: "medical",
    type: "occupation",
    aliases: [
      "医疗",
      "醫療",
      "医療",
      "医院",
      "醫院",
      "病院",
      "诊所",
      "診療所",
      "クリニック",
      "医疗工作",
    ],
  },

  {
    key: "education",
    type: "occupation",
    aliases: [
      "教育",
      "教师",
      "教師",
      "老师",
      "老師",
      "讲师",
      "講師",
      "学校工作",
      "塾講師",
      "教员",
    ],
  },

  /* =======================================================
     OTHER
  ======================================================= */

  {
    key: "photo-video",
    type: "occupation",
    aliases: [
      "摄影",
      "攝影",
      "摄影师",
      "摄像",
      "视频",
      "影片",
      "カメラマン",
      "フォトグラファー",
      "動画撮影",
      "映像制作",
    ],
  },

  {
    key: "event",
    type: "occupation",
    aliases: [
      "活动",
      "活動",
      "展会",
      "展會",
      "イベント",
      "展示会",
      "活动工作人员",
      "イベントスタッフ",
    ],
  },

  {
    key: "pet",
    type: "occupation",
    aliases: [
      "宠物",
      "寵物",
      "宠物店",
      "ペット",
      "ペットショップ",
      "动物",
      "動物",
    ],
  },

  {
    key: "agriculture-fishery",
    type: "occupation",
    aliases: [
      "农业",
      "農業",
      "农场",
      "農場",
      "水产",
      "水産",
      "渔业",
      "漁業",
    ],
  },

  {
    key: "art-performance",
    type: "occupation",
    aliases: [
      "艺术",
      "藝術",
      "艺人",
      "演出",
      "演员",
      "演員",
      "舞台",
      "芸能",
      "アート",
    ],
  },

  /* =======================================================
     EMPLOYMENT
  ======================================================= */

  {
    key: "part-time",
    type: "employment",
    aliases: [
      "兼职",
      "兼職",
      "打工",
      "小时工",
      "小时兼职",
      "アルバイト",
      "バイト",
      "パート",
      "parttime",
    ],
  },

  {
    key: "full-time",
    type: "employment",
    aliases: [
      "正社員",
      "正社员",
      "正式员工",
      "正式职员",
      "全职",
      "全職",
      "fulltime",
    ],
  },

  {
    key: "contract",
    type: "employment",
    aliases: [
      "契約社員",
      "契约员工",
      "合同工",
      "合同社員",
      "contract",
    ],
  },

  {
    key: "dispatch",
    type: "employment",
    aliases: [
      "派遣",
      "派遣社員",
      "派遣工作",
      "派遣员",
      "派遣スタッフ",
    ],
  },

  {
    key: "freelance",
    type: "employment",
    aliases: [
      "業務委託",
      "业务委托",
      "業務委托",
      "自由职业",
      "自由職業",
      "自由职业者",
      "freelance",
      "フリーランス",
    ],
  },

  {
    key: "intern",
    type: "employment",
    aliases: [
      "实习",
      "實習",
      "实习生",
      "インターン",
      "インターンシップ",
    ],
  },

  /* =======================================================
     CONDITIONS
  ======================================================= */

  {
    key: "beginner",
    type: "condition",
    aliases: [
      "未经验",
      "未経験",
      "未经验可",
      "未経験可",
      "无经验",
      "無経験",
      "没有经验",
      "经验不限",
      "経験不問",
      "初心者",
      "新手可",
      "零经验",
    ],
  },

  {
    key: "visa",
    type: "condition",
    aliases: [
      "签证",
      "簽證",
      "签证支援",
      "签证支持",
      "签证协助",
      "ビザ",
      "ビザ支援",
      "ビザサポート",
      "visa",
      "visasupport",
    ],
  },

  {
    key: "remote",
    type: "condition",
    aliases: [
      "远程",
      "遠程",
      "远程办公",
      "在家工作",
      "在宅",
      "在宅勤務",
      "リモート",
      "リモートワーク",
      "remote",
      "workfromhome",
    ],
  },

  {
    key: "hybrid",
    type: "condition",
    aliases: [
      "混合",
      "混合办公",
      "部分远程",
      "ハイブリッド",
      "ハイブリッド勤務",
      "hybrid",
    ],
  },

  {
    key: "onsite",
    type: "condition",
    aliases: [
      "现场",
      "現場",
      "现场办公",
      "出社",
      "出勤",
      "onsite",
    ],
  },

  {
    key: "verified",
    type: "condition",
    aliases: [
      "认证企业",
      "企业认证",
      "已认证",
      "認証企業",
      "verified",
    ],
  },
];

/* =========================================================
   NORMALIZED CONCEPT CACHE
========================================================= */

const NORMALIZED_JOB_SEARCH_CONCEPTS =
  JOB_SEARCH_CONCEPTS.map((concept) => ({
    ...concept,

    aliases: Array.from(
      new Set(
        concept.aliases
          .map(normalizeJobSearchText)
          .filter(Boolean)
      )
    ).sort(
      (a, b) =>
        b.length - a.length
    ),
  }));

  function getRelatedAliases(
  conceptKey: string
): string[] {
  /*
   * 只查找当前概念的直接子级。
   *
   * Example:
   *
   * 搜索 delivery / 配送
   *
   * delivery
   * ├─ food-delivery
   * └─ light-cargo
   *
   * 所以可以扩展：
   * 配送 -> 外卖配送 + 轻货配送
   *
   * 但搜索 food-delivery 时：
   * 不会返回 delivery
   * 也不会返回 light-cargo
   */
  const childConcepts =
    NORMALIZED_JOB_SEARCH_CONCEPTS.filter(
      (item) =>
        item.parentId === conceptKey
    );

  return Array.from(
    new Set(
      childConcepts.flatMap(
        (concept) =>
          concept.aliases
      )
    )
  );
}


/* =========================================================
   PARSER
========================================================= */

/*
 * Example:
 *
 * 东京 华人 整体院 兼职
 *
 * =>
 *
 * tokyo
 * AND chinese
 * AND massage
 * AND part-time
 *
 * 每一个 group 内部是 OR。
 * 不同 group 之间是 AND。
 */

export function parseJobSearch(
  search: string
): ParsedJobSearchGroup[] {
  let remainingText =
    normalizeJobSearchText(search);

  if (!remainingText) {
    return [];
  }

  const groups:
    ParsedJobSearchGroup[] = [];

  const usedConceptKeys =
    new Set<string>();

  /*
   * 所有 alias 全部摊平以后按长度排序。
   *
   * 这样：
   *
   * 不动产营业
   *
   * 会优先于：
   *
   * 不动产
   * 营业
   *
   * 整体院
   *
   * 会优先于：
   *
   * 整体
   */

  const candidates =
    NORMALIZED_JOB_SEARCH_CONCEPTS
      .flatMap((concept) =>
        concept.aliases.map(
          (alias) => ({
            concept,
            alias,
          })
        )
      )
      .sort(
        (a, b) =>
          b.alias.length -
          a.alias.length
      );

  let foundSomething = true;

  while (
    remainingText &&
    foundSomething
  ) {
    foundSomething = false;

    for (const candidate of candidates) {
      if (
        !candidate.alias ||
        !remainingText.includes(
          candidate.alias
        )
      ) {
        continue;
      }

      const {
        concept,
        alias,
      } = candidate;

      if (
        !usedConceptKeys.has(
          concept.key
        )
      ) {
        groups.push({
            key: concept.key,
            type: concept.type,
            query: alias,
            aliases:
                concept.aliases,
            relatedAliases:
                getRelatedAliases(
                concept.key
                ),
            });

        usedConceptKeys.add(
          concept.key
        );
      }

      remainingText =
        remainingText.replace(
          alias,
          ""
        );

      foundSomething = true;

      break;
    }
  }

  /* =======================================================
     REMOVE NOISE
  ======================================================= */

  for (
    const noiseWord of
      JOB_SEARCH_NOISE_WORDS
  ) {
    const normalizedNoise =
      normalizeJobSearchText(
        noiseWord
      );

    if (!normalizedNoise) {
      continue;
    }

    remainingText =
      remainingText
        .split(normalizedNoise)
        .join("");
  }

  /*
   * 没有进入词典的内容仍然保留。
   *
   * Example:
   *
   * Mercari Java
   *
   * Java -> technology concept
   * Mercari -> literal
   */

  if (remainingText) {
    groups.push({
        key: `literal:${remainingText}`,
        type: "literal",
        query: remainingText,
        aliases: [remainingText],
        relatedAliases: [],
        });
  }

  return groups;
}

/* =========================================================
   COMPATIBILITY HELPER
========================================================= */

/*
 * page.tsx 当前仍然使用 string[][]。
 *
 * 下一步接入时可以先直接使用这个，
 * 不必马上重写整个 filteredJobs。
 */

export function getJobSearchGroups(
  search: string
): string[][] {
  return parseJobSearch(search).map(
    (group) =>
      Array.from(
        new Set([
          ...group.aliases,
          ...group.relatedAliases,
        ])
      )
  );
}