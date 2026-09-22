export interface PublisherProfile {
  id: string;

  name: string;

  company: string | null;

  phone?: string;
  email?: string;
  wechat?: string;
  line?: string;
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 发布者 / 负责人 Profile
|
| GET /api/publishers/:publisherId
|
| 普通公开页面只应该返回：
|
| {
|   id: string;
|   name: string;
|   company: string | null;
| }
|
| phone / email / wechat / line
| 属于受保护联系方式。
|
| 正式后端不能因为用户查看房源，
| 就直接把这些私人联系方式返回给前端。
|
| 后续必须经过：
|
| contact_share_requests
|
| 双方授权以后，
| 才允许获取对应联系方式。
|
|--------------------------------------------------------------------------
*/

export const publishers: PublisherProfile[] = [
  {
    id: "publisher_ikebukuro_owner",

    name: "山田 太郎",

    company: "Sakura Home",

    phone: "090-1234-5678",

    email: "info@example.com",

    wechat: "sakura-home-tokyo",

    line: "sakura_home",
  },

  {
    id: "publisher_tokyo_house",

    name: "佐藤 花子",

    company: "Tokyo House",

    phone: "080-8888-9999",

    email: "contact@example.com",
  },

  {
    id: "publisher_takadanobaba_owner",

    name: "铃木 健",

    company: "Sakura Home",

    phone: "090-2222-3333",

    email: "takadanobaba@example.com",
  },

  {
    id: "publisher_takahashi_misaki",

    name: "高桥 美咲",

    company: "Tokyo Living",

    phone: "080-3333-4444",

    email: "nakano@example.com",
  },

  {
    id: "publisher_yamada_taro",

    name: "山田 太郎",

    company: "Osaka Home",

    phone: "080-5555-6666",

    email: "namba@example.com",
  },

  {
    id: "publisher_yokohama_living",

    name: "伊藤 直树",

    company: "Yokohama Living",

    phone: "090-7777-8888",

    email: "yokohama@example.com",
  },

  {
    id: "publisher_tanaka_kenichi",

    name: "田中 健一",

    company: "Tokyo Living",

    phone: "080-1111-2222",

    email: "akabane@example.com",
  },

  {
    id: "publisher_otsuka_owner",

    name: "小林 美咲",

    company: "Sakura Home",

    phone: "090-4444-5555",

    email: "otsuka@example.com",
  },
];

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
|
| Mock 阶段：
| 根据 publisherId 获取负责人 Profile。
|
| 后端接入后，这里最终会被 API / Query 替代。
|
|--------------------------------------------------------------------------
*/

export function getPublisherById(
  publisherId: string
) {
  return (
    publishers.find(
      (publisher) =>
        publisher.id ===
        publisherId
    ) ?? null
  );
}