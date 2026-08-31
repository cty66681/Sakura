export interface ScamItem {
  id: number;
  title: string;
  summary: string;
  level: "高危" | "中危" | "低危";
  publishTime: string;
  tags: string[];
  href: string;
}

export const scams: ScamItem[] = [
  {
    id: 1,
    title: "冒充入管局要求转账",
    summary:
      "诈骗分子冒充入管局工作人员，通过电话制造紧张感，要求缴纳所谓保证金、手续费或罚款。",
    level: "高危",
    publishTime: "今天",
    tags: [
      "电话诈骗",
      "签证",
      "转账",
    ],
    href: "/scam/1",
  },

  {
    id: 2,
    title: "租房押金诈骗",
    summary:
      "以房源紧张为理由，要求看房或签约前先支付押金、预约金，再承诺之后寄送钥匙。",
    level: "中危",
    publishTime: "昨天",
    tags: [
      "租房",
      "押金",
      "中介",
    ],
    href: "/scam/2",
  },

  {
    id: 3,
    title: "兼职刷单骗局",
    summary:
      "以高薪兼职、轻松赚钱为诱饵，先要求垫付资金或缴纳保证金，之后以各种理由继续要求转账。",
    level: "高危",
    publishTime: "3天前",
    tags: [
      "兼职",
      "刷单",
      "转账",
    ],
    href: "/scam/3",
  },

  {
    id: 4,
    title: "冒充快递公司的异常包裹通知",
    summary:
      "通过电话或短信声称存在异常包裹、违禁品或未支付费用，并诱导提供个人信息或进行转账。",
    level: "中危",
    publishTime: "4天前",
    tags: [
      "短信诈骗",
      "快递",
      "个人信息",
    ],
    href: "/scam/4",
  },

  {
    id: 5,
    title: "SNS 高收益投资群",
    summary:
      "通过社交平台邀请加入投资群，先展示虚假的盈利记录，再诱导持续充值或向指定账户汇款。",
    level: "高危",
    publishTime: "5天前",
    tags: [
      "投资",
      "SNS",
      "转账",
    ],
    href: "/scam/5",
  },

  {
    id: 6,
    title: "求职过程中要求购买指定商品",
    summary:
      "以入职培训、设备购买或资格认证为理由，要求求职者提前支付费用，需要特别注意。",
    level: "中危",
    publishTime: "1周前",
    tags: [
      "求职",
      "兼职",
      "收费",
    ],
    href: "/scam/6",
  },
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 避坑案例列表
|
| GET /api/scams
|
| Query:
| {
|   page?: number,
|   level?: "高危" | "中危" | "低危",
|   category?: string,
|   q?: string,
|   sort?: "latest" | "popular"
| }
|
|--------------------------------------------------------------------------
*/