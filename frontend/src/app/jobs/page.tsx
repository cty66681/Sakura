"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BookmarkPlus,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  HardHat,
  Languages,
  Laptop,
  Layers3,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
  UtensilsCrossed,
  X,
  Factory,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";
import JobCard from "@/components/home/JobCard/JobCard";

import {
  jobs,
  type JobCategory,
} from "@/data/jobs";

import {
  getJobSearchGroups,
  normalizeJobSearchText,
  parseJobSearch,
} from "@/lib/search/jobSearchDictionary";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";


/* =========================================================
   TYPES
========================================================= */


type JobCategoryFilter =
  | "all"
  | JobCategory;
  
type EmploymentType =
  | "all"
  | "full_time"
  | "contract"
  | "dispatch"
  | "freelance"
  | "part_time"
  | "intern";

type WorkStyle =
  | "all"
  | "remote"
  | "hybrid"
  | "onsite";

type JapaneseLevel =
  | "all"
  | "none"
  | "n3"
  | "n2"
  | "n1";

type SalaryType =
  | "all"
  | "hourly"
  | "daily"
  | "monthly"
  | "annual";

type FeatureFilter =
  | "verified"
  | "foreigner"
  | "visa"
  | "beginner"
  | "chinese";

interface CategoryItem {
  key: JobCategory;
  title: string;
  subtitle: string;
}

interface OccupationItem {
  label: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 6;

const regions = [
  "全部地区",
  "东京",
  "神奈川",
  "埼玉",
  "千叶",
  "大阪",
  "京都",
  "兵库",
  "爱知",
  "福冈",
  "北海道",
  "其他地区",
] as const;

const employmentTypes: {
  value: EmploymentType;
  label: string;
}[] = [
  {
    value: "all",
    label: "全部雇用",
  },
  {
    value: "full_time",
    label: "正社員",
  },
  {
    value: "contract",
    label: "契約社員",
  },
  {
    value: "dispatch",
    label: "派遣",
  },
  {
    value: "freelance",
    label: "業務委託",
  },
  {
    value: "part_time",
    label: "アルバイト",
  },
  {
    value: "intern",
    label: "实习",
  },
];

const workStyles: {
  value: WorkStyle;
  label: string;
}[] = [
  {
    value: "all",
    label: "全部",
  },
  {
    value: "remote",
    label: "远程",
  },
  {
    value: "hybrid",
    label: "混合",
  },
  {
    value: "onsite",
    label: "现场",
  },
];

const japaneseLevels: {
  value: JapaneseLevel;
  label: string;
}[] = [
  {
    value: "all",
    label: "日语不限",
  },
  {
    value: "none",
    label: "日语不要求",
  },
  {
    value: "n3",
    label: "N3 程度",
  },
  {
    value: "n2",
    label: "N2 程度",
  },
  {
    value: "n1",
    label: "N1 程度",
  },
];

const salaryTypes: {
  value: SalaryType;
  label: string;
}[] = [
  {
    value: "all",
    label: "薪资不限",
  },
  {
    value: "hourly",
    label: "时薪",
  },
  {
    value: "daily",
    label: "日薪",
  },
  {
    value: "monthly",
    label: "月薪",
  },
  {
    value: "annual",
    label: "年薪",
  },
];

const featureFilters: {
  key: FeatureFilter;
  label: string;
}[] = [
  {
    key: "verified",
    label: "企业认证",
  },
  {
    key: "foreigner",
    label: "外国人采用",
  },
  {
    key: "visa",
    label: "签证支援",
  },
  {
    key: "beginner",
    label: "未经验可",
  },
  {
    key: "chinese",
    label: "中文可",
  },
];

  const categories: CategoryItem[] = [
    {
      key: "it",
      title: "IT・技术",
      subtitle: "开发 / AI / 运维 / 设计",
    },
    {
      key: "real-estate",
      title: "不动产",
      subtitle: "营业・租赁・买卖・管理・事务",
    },
    {
      key: "construction",
      title: "建筑・现场",
      subtitle: "施工 / 内装 / 设备 / 电工",
    },
    {
      key: "logistics",
      title: "物流・运输",
      subtitle: "司机 / 配送 / 仓库 / 搬家",
    },
    {
      key: "ecommerce-office",
      title: "电商・办公室",
      subtitle: "网店 / 客服 / 事务 / 销售",
    },
    {
      key: "service",
      title: "餐饮・服务",
      subtitle: "餐饮 / 酒店 / 清扫",
    },
    {
      key: "other",
      title: "其他工作",
      subtitle: "其他行业与综合职位",
    },
    {
      key: "manufacturing",
      title: "工厂・制造",
      subtitle: "制造 / 加工 / 检品 / 包装",
    },
    {
      key: "beauty-massage",
      title: "美容・按摩",
      subtitle: "美容 / 美甲 / 美发 / 正规按摩",
    },
    {
      key: "care-professional",
      title: "介护・专业",
      subtitle: "介护 / 医疗 / 教育 / 专业资格",
    },
  ];

  const occupations: Record<
    Exclude<JobCategoryFilter, "all">,
    OccupationItem[]
  > = {
    it: [
      { label: "后端开发" },
      { label: "前端开发" },
      { label: "AI・数据" },
      { label: "运维・Cloud" },
      { label: "测试・QA" },
      { label: "PM・SE" },
    ],

    "real-estate": [
      { label: "不动产营业" },
      { label: "租赁仲介" },
      { label: "买卖仲介" },
      { label: "物业管理" },
      { label: "不动产事务" },
      { label: "宅建事务" },
    ],

    construction: [
      { label: "施工管理" },
      { label: "内装" },
      { label: "电工" },
      { label: "设备" },
      { label: "解体" },
      { label: "防水・涂装" },
    ],

    logistics: [
      { label: "配送" },
      { label: "司机" },
      { label: "轻货" },
      { label: "仓库" },
      { label: "搬家" },
    ],

    "ecommerce-office": [
      { label: "网店运营" },
      { label: "客服" },
      { label: "事务" },
      { label: "翻译" },
      { label: "销售" },
    ],

    service: [
      { label: "餐饮" },
      { label: "便利店" },
      { label: "酒店" },
      { label: "清扫" },
    ],

    manufacturing: [
      { label: "食品制造" },
      { label: "组装" },
      { label: "加工" },
      { label: "检品" },
      { label: "包装" },
    ],

    "beauty-massage": [
      { label: "美容师" },
      { label: "美甲师" },
      { label: "美发师" },
      { label: "正规按摩" },
      { label: "店铺前台" },
    ],

    "care-professional": [
      { label: "介护" },
      { label: "看护辅助" },
      { label: "医疗" },
      { label: "教育" },
      { label: "专业资格" },
    ],

    other: [
      { label: "摄影・视频" },
      { label: "活动・展会" },
      { label: "宠物相关" },
      { label: "农业・水产" },
      { label: "艺术・演出" },
      { label: "其他" },
    ],
  };

/* =========================================================
   API
========================================================= */

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/jobs
|
| Query:
| {
|   q?: string,
|   category?: JobCategoryFilter,
|   occupation?: string,
|   region?: string,
|   employmentType?: string,
|   workStyle?: string,
|   salaryType?: string,
|   japaneseLevel?: string,
|   foreignerFriendly?: boolean,
|   visaSupport?: boolean,
|   beginnerFriendly?: boolean,
|   chineseAvailable?: boolean,
|   verified?: boolean,
|   sort?: "recommended" | "latest" | "salary-desc",
|   page?: number,
|   limit?: number
| }
|
| 当前阶段：
| 使用 "@/data/jobs" Mock 数据，并通过现有字段进行前端推断。
|
|--------------------------------------------------------------------------
*/

/* =========================================================
   HELPERS
========================================================= */

function getMonthlySalaryValue(
  job: (typeof jobs)[number]
) {
  const salary =
    job.salaryMax ??
    job.salaryMin ??
    0;

  switch (job.salaryType) {
    case "hourly":
      // 8小时 × 20个工作日
      return salary * 8 * 20;

    case "daily":
      // 每月20个工作日
      return salary * 20;

    case "monthly":
      return salary;

    case "annual":
      return salary / 12;

    case "project":
      /*
       * 项目制无法可靠换算成月薪，
       * 不参与正常薪资高低比较。
       */
      return 0;

    default:
      return 0;
  }
}

function getJobText(
  job: (typeof jobs)[number]
) {
  return normalizeJobSearchText(
    [
      job.title,
      job.company,
      job.category,
      job.occupation,
      job.location,
      job.employmentType,
      job.remote,
      job.salary,
      job.experience,
      job.education,
      job.language,
      job.description,

      ...job.tags,
      ...job.workConditions,
      ...job.benefits,

      job.chineseAvailable
        ? "中文 中文可 华人 中国人 中国語 中国語可"
        : "",

      job.foreignerFriendly
        ? "外国人 外国籍 外国人可 外国人欢迎 外国人歓迎 外国人採用"
        : "",

      job.visaSupport
        ? "签证 签证支援 签证支持 ビザ ビザ支援 ビザサポート"
        : "",

      job.beginnerFriendly
        ? "未经验 未经验可 无经验 经验不限 未経験 未経験可 経験不問"
        : "",

      job.verified
        ? "企业认证 认证企业 已认证 verified"
        : "",
    ].join(" ")
  );
}

function getSearchMatchScore(
  job: (typeof jobs)[number],
  search: string
) {
  const groups =
    parseJobSearch(search);

  if (groups.length === 0) {
    return 0;
  }

  const title =
    normalizeJobSearchText(
      job.title
    );

  const occupation =
    normalizeJobSearchText(
      job.occupation
    );

  const category =
    normalizeJobSearchText(
      job.category
    );

  const location =
    normalizeJobSearchText(
      job.location
    );

  const company =
    normalizeJobSearchText(
      job.company
    );

  const tags =
    normalizeJobSearchText(
      job.tags.join(" ")
    );

  const workConditions =
    normalizeJobSearchText(
      job.workConditions.join(" ")
    );

  const benefits =
    normalizeJobSearchText(
      job.benefits.join(" ")
    );

  const description =
    normalizeJobSearchText(
      job.description
    );

  const fullText =
    getJobText(job);

  let score = 0;

  function getTermScore(
    term: string,
    related: boolean
  ) {
    if (!term) {
      return 0;
    }

    /*
     * 关联概念的权重明显低于精准概念。
     *
     * Example:
     * 搜索“外卖”
     * 外卖 = 精准
     * 普通配送 = 关联
     */
    const multiplier =
      related ? 0.35 : 1;

    let termScore = 0;

    if (occupation === term) {
      termScore = Math.max(
        termScore,
        140
      );
    }

    if (occupation.includes(term)) {
      termScore = Math.max(
        termScore,
        120
      );
    }

    if (title === term) {
      termScore = Math.max(
        termScore,
        115
      );
    }

    if (title.includes(term)) {
      termScore = Math.max(
        termScore,
        100
      );
    }

    if (location === term) {
      termScore = Math.max(
        termScore,
        90
      );
    }

    if (location.includes(term)) {
      termScore = Math.max(
        termScore,
        80
      );
    }

    if (category.includes(term)) {
      termScore = Math.max(
        termScore,
        70
      );
    }

    if (tags.includes(term)) {
      termScore = Math.max(
        termScore,
        60
      );
    }

    if (
      workConditions.includes(term)
    ) {
      termScore = Math.max(
        termScore,
        55
      );
    }

    if (company.includes(term)) {
      termScore = Math.max(
        termScore,
        45
      );
    }

    if (benefits.includes(term)) {
      termScore = Math.max(
        termScore,
        35
      );
    }

    if (description.includes(term)) {
      termScore = Math.max(
        termScore,
        20
      );
    }

    if (fullText.includes(term)) {
      termScore = Math.max(
        termScore,
        10
      );
    }

    return termScore * multiplier;
  }

  for (const group of groups) {
    let exactScore = 0;
    let relatedScore = 0;

    /*
     * 精准概念
     */
    for (const term of group.aliases) {
      exactScore = Math.max(
        exactScore,
        getTermScore(
          term,
          false
        )
      );
    }

    /*
     * 父级 / 子级 / 关联概念
     */
    for (
      const term of
      group.relatedAliases
    ) {
      relatedScore = Math.max(
        relatedScore,
        getTermScore(
          term,
          true
        )
      );
    }

    /*
     * 一个搜索概念只取最佳匹配。
     * 防止同一职位因为多个同义词重复加分。
     */
    score += Math.max(
      exactScore,
      relatedScore
    );
  }

  /*
   * 用户原始搜索词直接出现在标题时，
   * 再给予额外奖励。
   */
  const normalizedQuery =
    normalizeJobSearchText(search);

  if (
    normalizedQuery &&
    title.includes(normalizedQuery)
  ) {
    score += 80;
  }

  return score;
}

  function sortJobsBySearchRelevance(
    list: typeof jobs,
    search: string
  ) {
    if (!search.trim()) {
      return list;
    }

    return [...list].sort(
      (a, b) =>
        getSearchMatchScore(
          b,
          search
        ) -
        getSearchMatchScore(
          a,
          search
        )
    );
  }

function includesAny(
  text: string,
  keywords: string[]
) {
  return keywords.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );
}



function matchesJapaneseLevel(
  job: (typeof jobs)[number],
  level: JapaneseLevel
) {
  if (level === "all") {
    return true;
  }

  return job.japaneseLevel === level;
}

function hasFeature(
  job: (typeof jobs)[number],
  feature: FeatureFilter
) {
  switch (feature) {
    case "verified":
      return Boolean(job.verified);

    case "foreigner":
      return job.foreignerFriendly;

    case "visa":
      return job.visaSupport;

    case "beginner":
      return job.beginnerFriendly;

    case "chinese":
      return job.chineseAvailable;

    default:
      return false;
  }
}

function getCategoryCount(
  category: Exclude<
    JobCategoryFilter,
    "all"
  >
) {
  return jobs.filter(
    (job) =>
      job.category === category
  ).length;
}

/* =========================================================
   PAGE
========================================================= */

export default function JobsPage() {
  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const resultsRef =
    useRef<HTMLDivElement | null>(null);

  const searchRef =
    useRef<HTMLDivElement | null>(null);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<JobCategoryFilter>("all");

  const [
    selectedOccupation,
    setSelectedOccupation,
  ] = useState("");

  const [region, setRegion] =
    useState("全部地区");

  const [
    employmentType,
    setEmploymentType,
  ] =
    useState<EmploymentType>("all");

  const [workStyle, setWorkStyle] =
    useState<WorkStyle>("all");

  const [
    japaneseLevel,
    setJapaneseLevel,
  ] = useState<JapaneseLevel>("all");

  const [salaryType, setSalaryType] =
    useState<SalaryType>("all");

  const [
    activeFeatures,
    setActiveFeatures,
  ] = useState<FeatureFilter[]>([]);

  const [sort, setSort] =
    useState("recommended");

  const [showMoreFilters, setShowMoreFilters] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = Number(
    searchParams.get("page")
  );

  const page =
    Number.isInteger(pageParam) &&
    pageParam > 0
      ? pageParam
      : 1;

  function setPage(
    nextPage:
      | number
      | ((value: number) => number)
  ) {
    const resolvedPage =
      typeof nextPage === "function"
        ? nextPage(page)
        : nextPage;

    const newPage = Math.max(
      1,
      Math.floor(resolvedPage)
    );

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set(
        "page",
        String(newPage)
      );
    }

    const query = params.toString();

    router.push(
      query
        ? `/jobs?${query}`
        : "/jobs",
      {
        scroll: false,
      }
    );
  }

  function resetPage() {
    setPage(1);
  }

  function handleSearch() {
    const value =
      searchInput.trim();

    setSelectedCategory("all");
    setSelectedOccupation("");
    setEmploymentType("all");
    setWorkStyle("all");
    setJapaneseLevel("all");
    setSalaryType("all");
    setSearch(value);
    resetPage();

    setSearch(value);
    resetPage();

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");

    resetPage();

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function selectCategory(
    category: JobCategoryFilter
  ) {
    setSearch("");
    setSearchInput("");

    setSelectedCategory(category);
    setSelectedOccupation("");
    resetPage();
  }

  function toggleFeature(
    key: FeatureFilter
  ) {
    setActiveFeatures((current) =>
      current.includes(key)
        ? current.filter(
            (item) => item !== key
          )
        : [...current, key]
    );

    resetPage();
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setSelectedCategory("all");
    setSelectedOccupation("");
    setRegion("全部地区");
    setEmploymentType("all");
    setWorkStyle("all");
    setJapaneseLevel("all");
    setSalaryType("all");
    setActiveFeatures([]);
    setSort("recommended");
    setPage(1);
  }

  function saveSearch() {
    const item = {
      id: Date.now(),
      search,
      category: selectedCategory,
      occupation: selectedOccupation,
      region,
      employmentType,
      workStyle,
      japaneseLevel,
      salaryType,
      features: activeFeatures,
      createdAt:
        new Date().toISOString(),
    };

    /*
    TODO [API - POST]
    POST /api/me/job-searches

    Purpose:
    保存用户的工作搜索条件。
    后端完成后可用于新职位匹配通知。
    */

    try {
      const key =
        "sakura-job-saved-searches";

      const oldValue =
        window.localStorage.getItem(key);

      const current: unknown =
        oldValue
          ? JSON.parse(oldValue)
          : [];

      const saved = Array.isArray(current)
        ? current
        : [];

      window.localStorage.setItem(
        key,
        JSON.stringify(
          [item, ...saved].slice(0, 20)
        )
      );

      setSavedMessage("已保存搜索条件");

      window.setTimeout(() => {
        setSavedMessage("");
      }, 2200);
    } catch {
      setSavedMessage(
        "暂时无法保存"
      );
    }
  }

  const currentOccupations =
    selectedCategory !== "all"
      ? occupations[selectedCategory]
      : [];

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    /* Keyword search */

    if (search.trim()) {
      const searchGroups =
        getJobSearchGroups(search);

      result = result.filter((job) => {
        const jobText =
          getJobText(job);

        return searchGroups.every(
          (group) =>
            group.some((term) =>
              jobText.includes(term)
            )
        );
      });
    }

    /* Category */

    if (
      selectedCategory !== "all"
    ) {
      result = result.filter(
        (job) =>
          job.category ===
          selectedCategory
      );
    }

    /* Occupation */
  if (
    selectedCategory !== "all" &&
    selectedOccupation
  ) {
    result = result.filter(
      (job) =>
        job.occupation ===
        selectedOccupation
    );
  }

    /* Region */

    if (region !== "全部地区") {
      if (region === "其他地区") {
        const knownRegions =
          regions.filter(
            (item) =>
              item !== "全部地区" &&
              item !== "其他地区"
          );

        result = result.filter(
          (job) =>
            !knownRegions.some(
              (item) =>
                job.location.includes(
                  item
                )
            )
        );
      } else {
        result = result.filter(
          (job) =>
            job.location.includes(region)
        );
      }
    }

    /* Employment type */
    if (employmentType !== "all") {
      const employmentTypeMap: Record<
        Exclude<EmploymentType, "all">,
        "正社員" | "契約社員" | "派遣" | "業務委託" | "兼职" | "实习"
      > = {
        full_time: "正社員",
        contract: "契約社員",
        dispatch: "派遣",
        freelance: "業務委託",
        part_time: "兼职",
        intern: "实习",
      };

      result = result.filter(
        (job) =>
          job.employmentType ===
          employmentTypeMap[employmentType]
      );
    }

    /* Work style */
    if (workStyle !== "all") {
      const workStyleMap: Record<
        Exclude<WorkStyle, "all">,
        "远程" | "混合" | "现场"
      > = {
        remote: "远程",
        hybrid: "混合",
        onsite: "现场",
      };

      result = result.filter(
        (job) =>
          job.remote ===
          workStyleMap[workStyle]
      );
    }

    /* Japanese */

    if (
      japaneseLevel !== "all"
    ) {
      result = result.filter(
        (job) =>
          matchesJapaneseLevel(
            job,
            japaneseLevel
          )
      );
    }

  /* Salary type */

  if (salaryType !== "all") {
    result = result.filter(
      (job) =>
        job.salaryType === salaryType
    );
  }

    /* Features */

    activeFeatures.forEach(
      (feature) => {
        result = result.filter(
          (job) =>
            hasFeature(job, feature)
        );
      }
    );

    /* Sort */

    if (
      sort === "recommended" &&
      search.trim()
    ) {
      result =
        sortJobsBySearchRelevance(
          result,
          search
        );
    }

    if (sort === "salary") {
      result.sort(
        (a, b) =>
          getMonthlySalaryValue(b) -
          getMonthlySalaryValue(a)
      );
    }

    if (sort === "latest") {
      result.sort(
        (a, b) =>
          new Date(
            b.publishTime
          ).getTime() -
          new Date(
            a.publishTime
          ).getTime()
      );
    }

    return result;
  }, [
    search,
    selectedCategory,
    selectedOccupation,
    region,
    employmentType,
    workStyle,
    japaneseLevel,
    salaryType,
    activeFeatures,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredJobs.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const currentJobs =
    filteredJobs.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const hasFilters =
    search !== "" ||
    selectedCategory !== "all" ||
    selectedOccupation !== "" ||
    region !== "全部地区" ||
    employmentType !== "all" ||
    workStyle !== "all" ||
    japaneseLevel !== "all" ||
    salaryType !== "all" ||
    activeFeatures.length > 0;

  const selectedCategoryData =
    categories.find(
      (item) =>
        item.key ===
        selectedCategory
    );

  return (
    <main className="min-h-screen bg-slate-950">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-white/5
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            h-[480px]
            w-[480px]
            rounded-full
            bg-violet-600/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              pb-12
              pt-14
              sm:pb-16
              sm:pt-20
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-400/20
                bg-blue-400/10
                px-4
                py-2
                text-sm
                font-bold
                text-blue-300
              "
            >
              <BriefcaseBusiness
                size={16}
              />

              SAKURA JOBS
            </div>

            <h1
              className="
                mt-6
                max-w-4xl
                text-4xl
                font-black
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              在日本，找到更适合你的
              <span
                className="
                  ml-2
                  bg-gradient-to-r
                  from-blue-400
                  via-sky-300
                  to-violet-400
                  bg-clip-text
                  text-transparent
                "
              >
                工作机会
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-base
                leading-8
                text-slate-400
                sm:text-lg
              "
            >
              IT、不动产、建筑、物流、电商、餐饮服务，
              找工作不需要先学会使用复杂的招聘网站。
            </p>

            {/* Search */}

            <div ref={searchRef} className="mt-9 max-w-4xl">
              <div
                className="
                  flex
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-white
                  shadow-2xl
                  shadow-black/20
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                  "
                >
                  <Search
                    size={20}
                    className="
                      ml-4
                      shrink-0
                      text-slate-400
                      sm:ml-5
                    "
                  />

                  <input
                    value={searchInput}
                    onChange={(event) =>
                      setSearchInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        handleSearch();
                      }
                    }}
                    maxLength={100}
                    placeholder="东京 不会日语 配送 / Java / 网店运营..."
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-3
                      py-4
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      sm:px-4
                      sm:py-5
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="
                    min-h-12
                    shrink-0
                    bg-blue-600
                    px-5
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-700
                    sm:px-9
                  "
                >
                  <span className="hidden sm:inline">
                    搜索工作
                  </span>

                  <Search
                    size={18}
                    className="sm:hidden"
                  />
                </button>
              </div>

              <p
                className="
                  mt-3
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                后续可升级为自然语言搜索，例如：
                “东京周末可以做的兼职”
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* LIGHT CONTENT */}
      {/* ================================================= */}

      <section
        className="
          rounded-t-[30px]
          bg-slate-50
          pb-16
          pt-8
          sm:rounded-t-[36px]
          sm:pt-10
        "
      >
        <Container>
          <div className="px-4">
            {/* ============================================= */}
            {/* CATEGORY */}
            {/* ============================================= */}

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-blue-600
                  "
                >
                  JOB CATEGORY
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-black
                    text-slate-950
                    sm:text-3xl
                  "
                >
                  你想找什么工作？
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  先选大类，再快速筛选具体职位。
                </p>
              </div>

              {selectedCategory !==
                "all" && (
                <button
                  type="button"
                  onClick={() =>
                    selectCategory("all")
                  }
                  className="
                    self-start
                    text-xs
                    font-bold
                    text-slate-400
                    transition
                    hover:text-blue-600
                  "
                >
                  查看全部工作
                </button>
              )}
            </div>

            <div
              className="
                mt-6
                grid
                grid-cols-2
                gap-3
                lg:grid-cols-3
              "
            >
              {categories.map(
                (category) => {
                  const active =
                    selectedCategory ===
                    category.key;

                  return (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() =>
                        selectCategory(
                          category.key
                        )
                      }
                      className={`
                        group
                        min-h-[126px]
                        rounded-[22px]
                        border
                        p-4
                        text-left
                        transition
                        sm:min-h-[142px]
                        sm:p-5
                        ${
                          active
                            ? "border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-950/10"
                            : "border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            active
                              ? "bg-white/10 text-white"
                              : "bg-slate-100 text-slate-700"
                          }
                        `}
                      >
                        {category.key ===
                          "it" && (
                          <Laptop
                            size={19}
                          />
                        )}

                        {category.key ===
                          "real-estate" && (
                          <BriefcaseBusiness
                            size={19}
                          />
                        )}

                        {category.key ===
                          "construction" && (
                          <HardHat
                            size={19}
                          />
                        )}

                        {category.key ===
                          "logistics" && (
                          <Truck
                            size={19}
                          />
                        )}

                        {category.key ===
                          "ecommerce-office" && (
                          <ShoppingBag
                            size={19}
                          />
                        )}

                        {category.key ===
                          "service" && (
                          <UtensilsCrossed
                            size={19}
                          />
                        )}

                        {category.key ===
                          "manufacturing" && (
                          <Factory size={19} />
                        )}

                        {category.key ===
                          "beauty-massage" && (
                          <Sparkles size={19} />
                        )}

                        {category.key ===
                          "care-professional" && (
                          <HeartHandshake size={19} />
                        )}

                        {category.key ===
                          "other" && (
                          <Layers3
                            size={19}
                          />
                        )}
                      </div>

                      <div
                        className="
                          mt-4
                          flex
                          items-end
                          justify-between
                          gap-2
                        "
                      >
                        <div className="min-w-0">
                          <h3
                            className="
                              text-sm
                              font-black
                              sm:text-base
                            "
                          >
                            {category.title}
                          </h3>

                          <p
                            className={`
                              mt-1
                              truncate
                              text-[11px]
                              sm:text-xs
                              ${
                                active
                                  ? "text-slate-400"
                                  : "text-slate-500"
                              }
                            `}
                          >
                            {
                              category.subtitle
                            }
                          </p>
                        </div>

                        <span
                          className={`
                            shrink-0
                            text-[10px]
                            font-black
                            sm:text-xs
                            ${
                              active
                                ? "text-blue-300"
                                : "text-blue-600"
                            }
                          `}
                        >
                          {getCategoryCount(
                            category.key
                          )}
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* ============================================= */}
            {/* OCCUPATIONS */}
            {/* ============================================= */}

            {selectedCategory !==
              "all" && (
              <div
                className="
                  mt-5
                  rounded-[22px]
                  border
                  border-slate-200
                  bg-white
                  p-4
                  sm:p-5
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      mr-1
                      text-xs
                      font-black
                      text-slate-900
                    "
                  >
                    {
                      selectedCategoryData?.title
                    }
                    ：
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOccupation(
                        ""
                      );
                      resetPage();
                    }}
                    className={`
                      rounded-full
                      px-3
                      py-2
                      text-xs
                      font-bold
                      transition
                      ${
                        selectedOccupation ===
                        ""
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }
                    `}
                  >
                    全部
                  </button>

                  {currentOccupations.map(
                    (occupation) => (
                      <button
                        key={
                          occupation.label
                        }
                        type="button"
                        onClick={() => {
                          setSelectedOccupation(
                            occupation.label
                          );
                          resetPage();
                        }}
                        className={`
                          rounded-full
                          px-3
                          py-2
                          text-xs
                          font-bold
                          transition
                          ${
                            selectedOccupation ===
                            occupation.label
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }
                        `}
                      >
                        {
                          occupation.label
                        }
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* FILTER BAR */}
            {/* ============================================= */}

            <div
              className="
                mt-8
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >
              <div
                className="
                  grid
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >
                <FilterSelect
                  value={region}
                  onChange={(value) => {
                    setRegion(value);
                    resetPage();
                  }}
                  options={regions.map(
                    (item) => ({
                      value: item,
                      label: item,
                    })
                  )}
                  icon="region"
                />

                <FilterSelect
                  value={employmentType}
                  onChange={(value) => {
                    setEmploymentType(
                      value as EmploymentType
                    );
                    resetPage();
                  }}
                  options={
                    employmentTypes
                  }
                  icon="job"
                />

                <FilterSelect
                  value={japaneseLevel}
                  onChange={(value) => {
                    setJapaneseLevel(
                      value as JapaneseLevel
                    );
                    resetPage();
                  }}
                  options={
                    japaneseLevels
                  }
                  icon="language"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowMoreFilters(
                      (value) => !value
                    )
                  }
                  className={`
                    flex
                    min-h-12
                    items-center
                    justify-between
                    rounded-xl
                    border
                    px-4
                    text-sm
                    font-bold
                    transition
                    ${
                      showMoreFilters
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }
                  `}
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <SlidersHorizontal
                      size={16}
                    />
                    更多筛选
                  </span>

                  <ChevronDown
                    size={15}
                    className={`
                      transition
                      ${
                        showMoreFilters
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>
              </div>

              {/* More filters */}

              {showMoreFilters && (
                <div
                  className="
                    mt-5
                    border-t
                    border-slate-100
                    pt-5
                  "
                >
                  <div
                    className="
                      grid
                      gap-6
                      lg:grid-cols-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-xs
                          font-black
                          text-slate-800
                        "
                      >
                        工作方式
                      </p>

                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {workStyles.map(
                          (item) => (
                            <SmallFilterButton
                              key={
                                item.value
                              }
                              active={
                                workStyle ===
                                item.value
                              }
                              label={
                                item.label
                              }
                              onClick={() => {
                                setWorkStyle(
                                  item.value
                                );
                                resetPage();
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          font-black
                          text-slate-800
                        "
                      >
                        薪资方式
                      </p>

                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {salaryTypes.map(
                          (item) => (
                            <SmallFilterButton
                              key={
                                item.value
                              }
                              active={
                                salaryType ===
                                item.value
                              }
                              label={
                                item.label
                              }
                              onClick={() => {
                                setSalaryType(
                                  item.value
                                );
                                resetPage();
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          font-black
                          text-slate-800
                        "
                      >
                        在日外国人常用条件
                      </p>

                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {featureFilters.map(
                          (item) => (
                            <SmallFilterButton
                              key={item.key}
                              active={activeFeatures.includes(
                                item.key
                              )}
                              label={
                                item.label
                              }
                              onClick={() =>
                                toggleFeature(
                                  item.key
                                )
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                      mt-5
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-emerald-100
                      bg-emerald-50
                      p-4
                    "
                  >
                    <ShieldCheck
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-emerald-700
                      "
                    />

                    <p
                      className="
                        text-xs
                        leading-6
                        text-emerald-800
                      "
                    >
                      后续 Sakura
                      会把企业认证、外国人采用、
                      签证支援和避坑风险记录接入同一套职位系统。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================= */}
            {/* ACTIVE FILTERS */}
            {/* ============================================= */}

            {hasFilters && (
              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                {search && (
                  <FilterTag
                    label={`搜索：${search}`}
                    onRemove={() => {
                      setSearch("");
                      setSearchInput("");
                      resetPage();
                    }}
                  />
                )}

                {selectedCategoryData && (
                  <FilterTag
                    label={
                      selectedCategoryData.title
                    }
                    onRemove={() =>
                      selectCategory("all")
                    }
                  />
                )}

                {selectedOccupation && (
                  <FilterTag
                    label={
                      selectedOccupation
                    }
                    onRemove={() => {
                      setSelectedOccupation(
                        ""
                      );
                      resetPage();
                    }}
                  />
                )}

                {region !==
                  "全部地区" && (
                  <FilterTag
                    label={region}
                    onRemove={() => {
                      setRegion(
                        "全部地区"
                      );
                      resetPage();
                    }}
                  />
                )}

                {employmentType !==
                  "all" && (
                  <FilterTag
                    label={
                      employmentTypes.find(
                        (item) =>
                          item.value ===
                          employmentType
                      )?.label ?? ""
                    }
                    onRemove={() => {
                      setEmploymentType(
                        "all"
                      );
                      resetPage();
                    }}
                  />
                )}

                {japaneseLevel !==
                  "all" && (
                  <FilterTag
                    label={
                      japaneseLevels.find(
                        (item) =>
                          item.value ===
                          japaneseLevel
                      )?.label ?? ""
                    }
                    onRemove={() => {
                      setJapaneseLevel(
                        "all"
                      );
                      resetPage();
                    }}
                  />
                )}

                {workStyle !==
                  "all" && (
                  <FilterTag
                    label={
                      workStyles.find(
                        (item) =>
                          item.value ===
                          workStyle
                      )?.label ?? ""
                    }
                    onRemove={() => {
                      setWorkStyle("all");
                      resetPage();
                    }}
                  />
                )}

                {salaryType !==
                  "all" && (
                  <FilterTag
                    label={
                      salaryTypes.find(
                        (item) =>
                          item.value ===
                          salaryType
                      )?.label ?? ""
                    }
                    onRemove={() => {
                      setSalaryType("all");
                      resetPage();
                    }}
                  />
                )}

                {activeFeatures.map(
                  (feature) => (
                    <FilterTag
                      key={feature}
                      label={
                        featureFilters.find(
                          (item) =>
                            item.key ===
                            feature
                        )?.label ?? ""
                      }
                      onRemove={() =>
                        toggleFeature(
                          feature
                        )
                      }
                    />
                  )
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    min-h-9
                    px-2
                    text-xs
                    font-bold
                    text-slate-400
                    transition
                    hover:text-blue-600
                  "
                >
                  清除全部
                </button>
              </div>
            )}

            {/* ============================================= */}
            {/* RESULTS HEADER */}
            {/* ============================================= */}

            <div
              className="
                mt-9
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div id="job-results" ref={resultsRef}  
                className="scroll-mt-28">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <h2
                    className="
                      text-2xl
                      font-black
                      text-slate-950
                    "
                  >
                    {selectedCategoryData
                      ? selectedCategoryData.title
                      : "全部工作"}
                  </h2>

                  <span
                    className="
                      rounded-full
                      bg-blue-50
                      px-3
                      py-1
                      text-xs
                      font-black
                      text-blue-600
                    "
                  >
                    {
                      filteredJobs.length
                    }
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  根据当前搜索和筛选条件显示职位
                </p>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) => {
                      setSort(
                        event.target.value
                      );
                      resetPage();
                    }}
                    className="
                      min-h-11
                      appearance-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      py-2.5
                      pl-4
                      pr-10
                      text-sm
                      font-bold
                      text-slate-600
                      outline-none
                      transition
                      focus:border-blue-400
                    "
                  >
                    <option value="recommended">
                      推荐排序
                    </option>

                    <option value="latest">
                      最新发布
                    </option>

                    <option value="salary">
                      薪资最高
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />
                </div>

                <button
                  type="button"
                  disabled={!hasFilters}
                  onClick={saveSearch}
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-sm
                    font-bold
                    text-slate-600
                    transition
                    hover:border-blue-200
                    hover:text-blue-600
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {savedMessage ===
                  "已保存搜索条件" ? (
                    <Check size={16} />
                  ) : (
                    <BookmarkPlus
                      size={16}
                    />
                  )}

                  {savedMessage ||
                    "保存搜索"}
                </button>
              </div>
            </div>

            {/* ============================================= */}
            {/* CARDS */}
            {/* ============================================= */}

            {currentJobs.length > 0 ? (
              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  gap-5
                  xl:grid-cols-2
                "
              >
                {currentJobs.map(
                  (job) => (
                    <JobCard
                    key={job.id}
                    {...job}
                    href={
                      currentPage > 1
                        ? `/jobs/${job.id}?fromPage=${currentPage}`
                        : `/jobs/${job.id}`
                    }
                    />
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  mt-6
                  rounded-[26px]
                  border
                  border-dashed
                  border-slate-300
                  bg-white
                  px-6
                  py-16
                  text-center
                  sm:py-20
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                    text-slate-500
                  "
                >
                  <Search size={24} />
                </div>

                <h3
                  className="
                    mt-5
                    text-lg
                    font-black
                    text-slate-900
                  "
                >
                  {search
                    ? `没有找到「${search}」相关职位`
                    : "当前筛选条件下没有相关职位"}
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  {search
                    ? "可以尝试减少搜索关键词，或者调整上方的分类和筛选条件。"
                    : "可以尝试减少筛选条件，或者切换其他工作分类。"}
                </p>

                <div
                  className="
                    mt-6
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    sm:flex-row
                  "
                >
                  {search && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="
                        min-h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-5
                        text-sm
                        font-bold
                        text-slate-700
                        transition
                        hover:border-slate-300
                        hover:bg-slate-50
                        sm:w-auto
                      "
                    >
                      清除搜索
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      min-h-11
                      w-full
                      rounded-xl
                      bg-slate-950
                      px-5
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-slate-800
                      sm:w-auto
                    "
                  >
                    重置全部筛选
                  </button>
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* PAGINATION */}
            {/* ============================================= */}

            {totalPages > 1 && (
              <div
                className="
                  mt-10
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-2
                "
              >
                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                    )
                  }
                  className="
                    min-h-10
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-sm
                    font-bold
                    text-slate-600
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  上一页
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() =>
                      setPage(number)
                    }
                    className={`
                      h-10
                      w-10
                      rounded-xl
                      text-sm
                      font-black
                      transition
                      ${
                        currentPage ===
                        number
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                      }
                    `}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                    )
                  }
                  className="
                    min-h-10
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-sm
                    font-bold
                    text-slate-600
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  下一页
                </button>
              </div>
            )}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  searchRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-md"
              >
                ↑ 返回顶部搜索
              </button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly {
    value: string;
    label: string;
  }[];
  icon:
    | "region"
    | "job"
    | "language";
}) {
  return (
    <div className="relative">
      {icon === "region" && (
        <Layers3
          size={16}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-slate-400
          "
        />
      )}

      {icon === "job" && (
        <BriefcaseBusiness
          size={16}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-slate-400
          "
        />
      )}

      {icon === "language" && (
        <Languages
          size={16}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-slate-400
          "
        />
      )}

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          min-h-12
          w-full
          appearance-none
          rounded-xl
          border
          border-slate-200
          bg-white
          py-3
          pl-11
          pr-10
          text-sm
          font-bold
          text-slate-600
          outline-none
          transition
          focus:border-blue-400
          focus:ring-4
          focus:ring-blue-500/5
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />
    </div>
  );
}

/* =========================================================
   SMALL FILTER
========================================================= */

function SmallFilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-9
        rounded-full
        border
        px-3
        py-2
        text-xs
        font-bold
        transition
        ${
          active
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        }
      `}
    >
      {label}
    </button>
  );
}

/* =========================================================
   FILTER TAG
========================================================= */

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        inline-flex
        min-h-9
        items-center
        gap-1.5
        rounded-full
        border
        border-blue-100
        bg-blue-50
        py-1.5
        pl-3
        pr-2
        text-xs
        font-bold
        text-blue-700
      "
    >
      <span>{label}</span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`删除筛选条件 ${label}`}
        className="
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          transition
          hover:bg-blue-100
        "
      >
        <X size={12} />
      </button>
    </div>
  );
}