"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  CircleAlert,
  ImagePlus,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

import Container from "@/components/layout/Container";

type SaveAction = "draft" | "submit";

type HouseStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";

interface HouseForm {
  title: string;

  rent: string;
  managementFee: string;
  deposit: string;
  keyMoney: string;

  layout: string;
  area: string;

  prefecture: string;
  city: string;
  address: string;
  nearestStation: string;
  stationWalk: string;

  floor: string;
  builtYear: string;
  direction: string;
  structure: string;
  availableDate: string;

  description: string;

  contactName: string;
  company: string;
  phone: string;
  email: string;
}

interface ExistingImage {
  id: string;
  url: string;
  type: "existing";
}

interface LocalImage {
  id: string;
  file: File;
  previewUrl: string;
  type: "local";
}

type HouseImage = ExistingImage | LocalImage;

interface MockHouse {
  id: string;
  status: HouseStatus;
  form: HouseForm;
  features: string[];
  images: ExistingImage[];
}

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const prefectures = [
  "北海道",
  "青森",
  "岩手",
  "宫城",
  "秋田",
  "山形",
  "福岛",
  "茨城",
  "栃木",
  "群马",
  "埼玉",
  "千叶",
  "东京",
  "神奈川",
  "新潟",
  "富山",
  "石川",
  "福井",
  "山梨",
  "长野",
  "岐阜",
  "静冈",
  "爱知",
  "三重",
  "滋贺",
  "京都",
  "大阪",
  "兵库",
  "奈良",
  "和歌山",
  "鸟取",
  "岛根",
  "冈山",
  "广岛",
  "山口",
  "德岛",
  "香川",
  "爱媛",
  "高知",
  "福冈",
  "佐贺",
  "长崎",
  "熊本",
  "大分",
  "宫崎",
  "鹿儿岛",
  "冲绳",
];

const layoutOptions = [
  "1R",
  "1K",
  "1DK",
  "1LDK",
  "2K",
  "2DK",
  "2LDK",
  "3K",
  "3DK",
  "3LDK",
  "4LDK+",
];

const directionOptions = [
  "东",
  "西",
  "南",
  "北",
  "东南",
  "西南",
  "东北",
  "西北",
];

const structureOptions = [
  "木造",
  "轻量铁骨",
  "钢骨造",
  "RC",
  "SRC",
  "其他",
];

const featureOptions = [
  "近车站",
  "可养宠物",
  "免礼金",
  "免押金",
  "拎包入住",
  "家具家电",
  "独立卫浴",
  "自动门禁",
  "宅配箱",
  "网络免费",
  "停车场",
  "自行车停车场",
];

/*
|--------------------------------------------------------------------------
| 编辑自己的房源
|--------------------------------------------------------------------------
|
| TODO [API - GET]
| GET /api/me/houses/:id
|
| 用途：
| 获取当前登录用户自己发布的房源。
|
| 后端必须验证：
| house.authorId === session.user.id
|
| 不属于当前用户：
| 返回 403 / 404
|
|--------------------------------------------------------------------------
|
| TODO [API - PATCH]
| PATCH /api/houses/:id
|
| 用途：
| 修改自己的房源。
|
| status:
| - draft   保存草稿
| - pending 修改后重新提交审核
|
| 后端必须再次验证 ownership。
|
|--------------------------------------------------------------------------
|
| TODO [API - POST]
| POST /api/uploads/houses
|
| 上传新添加的房源图片。
|
|--------------------------------------------------------------------------
|
| TODO [API - DELETE]
| DELETE /api/uploads/houses/:imageId
|
| 删除已经存在于服务器上的房源图片。
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| MOCK
|--------------------------------------------------------------------------
|
| 现在没有后端，所以模拟 GET /api/me/houses/:id。
|
| 以后接 API 时删除这里即可。
|
|--------------------------------------------------------------------------
*/

function createMockHouse(id: string): MockHouse {
  return {
    id,
    status: "published",

    form: {
      title: "池袋站步行8分钟 1LDK 明亮南向",

      rent: "128000",
      managementFee: "8000",
      deposit: "1个月",
      keyMoney: "0个月",

      layout: "1LDK",
      area: "38.5",

      prefecture: "东京",
      city: "丰岛区",
      address: "西池袋3丁目",
      nearestStation: "池袋站",
      stationWalk: "8",

      floor: "5",
      builtYear: "2019",
      direction: "南",
      structure: "RC",
      availableDate: "2026-09-15",

      description:
        "池袋站步行约8分钟，附近有便利店、超市和餐饮店。\n\n房间采光良好，独立卫浴，可养小型宠物。具体初期费用和入住条件可以联系咨询。",

      contactName: "田中太郎",
      company: "Sakura Housing",
      phone: "09012345678",
      email: "house@example.com",
    },

    features: [
      "近车站",
      "可养宠物",
      "免礼金",
      "独立卫浴",
      "宅配箱",
    ],

    images: [],
  };
}

export default function EditHousePage() {
  const params = useParams<{ id: string }>();

  const houseId = params.id;

  const [form, setForm] =
    useState<HouseForm | null>(null);

  const [status, setStatus] =
    useState<HouseStatus>("draft");

  const [features, setFeatures] =
    useState<string[]>([]);

  const [images, setImages] =
    useState<HouseImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  /*
  ================================================================
  TODO [API - GET]
  GET /api/me/houses/:id
  ================================================================
  */

  useEffect(() => {
    let active = true;

    async function loadHouse() {
      setLoading(true);

      try {
        /*
        const response = await fetch(
          `/api/me/houses/${houseId}`
        );

        if (!response.ok) {
          throw new Error("无法读取房源");
        }

        const data = await response.json();
        */

        await new Promise((resolve) => {
          window.setTimeout(resolve, 300);
        });

        const data = createMockHouse(houseId);

        if (!active) {
          return;
        }

        setForm(data.form);
        setFeatures(data.features);
        setImages(data.images);
        setStatus(data.status);
      } catch {
        if (active) {
          setError("无法读取该房源信息。");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHouse();

    return () => {
      active = false;
    };
  }, [houseId]);

  const locationPreview = useMemo(() => {
    if (!form) {
      return "";
    }

    return [form.prefecture, form.city]
      .filter(Boolean)
      .join(" · ");
  }, [form]);

  function updateField<K extends keyof HouseForm>(
    key: K,
    value: HouseForm[K]
  ) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });

    setError("");
    setNotice("");
  }

  function toggleFeature(feature: string) {
    setFeatures((current) => {
      if (current.includes(feature)) {
        return current.filter(
          (item) => item !== feature
        );
      }

      return [...current, feature];
    });

    setNotice("");
  }

  function handleImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) {
      return;
    }

    const remaining =
      MAX_IMAGES - images.length;

    if (remaining <= 0) {
      setError(
        `最多可以上传 ${MAX_IMAGES} 张图片。`
      );

      event.target.value = "";
      return;
    }

    const oversized = files.some(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    const accepted = files
      .filter(
        (file) =>
          file.type.startsWith("image/") &&
          file.size <= MAX_IMAGE_SIZE
      )
      .slice(0, remaining);

    if (oversized) {
      setError("单张图片不能超过 10MB。");
    }

    const newImages: LocalImage[] =
      accepted.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        type: "local",
      }));

    setImages((current) => [
      ...current,
      ...newImages,
    ]);

    if (files.length > remaining) {
      setError(
        `最多可以上传 ${MAX_IMAGES} 张图片。`
      );
    } else if (oversized) {
      setError(
        "单张图片不能超过 10MB。"
      );
    } else {
      setError("");
    }

    event.target.value = "";
  }

  function removeImage(image: HouseImage) {
    if (image.type === "local") {
      URL.revokeObjectURL(
        image.previewUrl
      );
    }

    /*
    如果 image.type === "existing":

    TODO [API - DELETE]
    DELETE /api/uploads/houses/:imageId

    真实后端阶段可以：
    1. 立即删除
    或
    2. 保存 deletedImageIds，PATCH 房源时一起处理
    */

    setImages((current) =>
      current.filter(
        (item) => item.id !== image.id
      )
    );
  }

  function validateForSubmit() {
    if (!form) {
      return "房源数据尚未加载。";
    }

    if (!form.title.trim()) {
      return "请输入房源标题。";
    }

    if (
      !form.rent ||
      Number(form.rent) <= 0
    ) {
      return "请输入正确的月租金。";
    }

    if (!form.layout) {
      return "请选择户型。";
    }

    if (
      !form.area ||
      Number(form.area) <= 0
    ) {
      return "请输入正确的房屋面积。";
    }

    if (!form.prefecture) {
      return "请选择都道府县。";
    }

    if (!form.city.trim()) {
      return "请输入市区町村。";
    }

    if (!form.address.trim()) {
      return "请输入房源地址。";
    }

    if (!form.description.trim()) {
      return "请输入房源说明。";
    }

    if (!form.contactName.trim()) {
      return "请输入联系人。";
    }

    if (!form.phone.trim()) {
      return "请输入联系电话。";
    }

    return "";
  }

  async function saveHouse(
    action: SaveAction
  ) {
    if (!form) {
      return;
    }

    setError("");
    setNotice("");

    if (action === "submit") {
      const validationError =
        validateForSubmit();

      if (validationError) {
        setError(validationError);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }
    }

    setSaving(true);

    try {
      /*
      ================================================================
      TODO [API - POST]
      POST /api/uploads/houses

      先上传 type === "local" 的图片，
      获取服务器 imageId。
      ================================================================
      */

      const payload = {
        title: form.title.trim(),

        rent: Number(form.rent || 0),

        managementFee: Number(
          form.managementFee || 0
        ),

        deposit: form.deposit,
        keyMoney: form.keyMoney,

        layout: form.layout,
        area: Number(form.area || 0),

        prefecture: form.prefecture,
        city: form.city.trim(),
        address: form.address.trim(),

        nearestStation:
          form.nearestStation.trim(),

        stationWalk: Number(
          form.stationWalk || 0
        ),

        floor: form.floor.trim(),
        builtYear: form.builtYear,
        direction: form.direction,
        structure: form.structure,

        availableDate:
          form.availableDate,

        description:
          form.description.trim(),

        tags: features,

        imageIds: images
          .filter(
            (
              image
            ): image is ExistingImage =>
              image.type === "existing"
          )
          .map((image) => image.id),

        contactName:
          form.contactName.trim(),

        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),

        status:
          action === "draft"
            ? ("draft" as const)
            : ("pending" as const),
      };

      /*
      ================================================================
      TODO [API - PATCH]
      PATCH /api/houses/:id

      await fetch(
        `/api/houses/${houseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      ================================================================
      */

      console.log(
        "Mock update house:",
        houseId,
        payload
      );

      await new Promise((resolve) => {
        window.setTimeout(resolve, 400);
      });

      if (action === "draft") {
        setStatus("draft");

        setNotice(
          "修改内容已保存为草稿。当前为 Mock 模式。"
        );
      } else {
        setStatus("pending");

        setNotice(
          "修改后的房源已重新提交审核。当前为 Mock 模式。"
        );
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch {
      setError(
        "保存失败，请稍后重新尝试。"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void saveHouse("submit");
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!form) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Container>
          <div className="px-4 py-20">
            <div
              className="
                mx-auto
                max-w-lg
                rounded-[24px]
                border
                border-rose-200
                bg-white
                p-8
                text-center
                shadow-sm
              "
            >
              <CircleAlert
                size={32}
                className="
                  mx-auto
                  text-rose-500
                "
              />

              <h1
                className="
                  mt-4
                  text-xl
                  font-black
                  text-slate-950
                "
              >
                无法读取房源
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                房源不存在，或者你没有编辑权限。
              </p>

              <Link
                href="/account/posts"
                className="
                  mt-6
                  inline-flex
                  rounded-xl
                  bg-slate-950
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-white
                "
              >
                返回我的发布
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <section
        className="
          border-b
          border-slate-200
          bg-white
        "
      >
        <Container>
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              px-4
              py-5
            "
          >
            <Link
              href="/account/posts"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-500
                transition
                hover:text-slate-900
              "
            >
              <ArrowLeft size={16} />
              返回我的发布
            </Link>

            <StatusBadge status={status} />
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          bg-slate-950
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -left-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-600/15
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-10
              sm:py-12
            "
          >
            <div
              className="
                flex
                max-w-3xl
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-blue-400/20
                  bg-blue-400/10
                  text-blue-300
                "
              >
                <Building2 size={22} />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-blue-400
                  "
                >
                  EDIT HOUSE
                </p>

                <h1
                  className="
                    mt-2
                    text-3xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  编辑房源
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-slate-400
                  "
                >
                  房源 ID：{houseId}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="py-8 sm:py-10">
        <Container>
          <form
            onSubmit={handleSubmit}
            className="
              grid
              gap-7
              px-4
              xl:grid-cols-[minmax(0,1fr)_320px]
            "
          >
            <div
              className="
                min-w-0
                space-y-6
              "
            >
              {error && (
                <MessageBox type="error">
                  {error}
                </MessageBox>
              )}

              {notice && (
                <MessageBox type="success">
                  {notice}
                </MessageBox>
              )}

              {status === "published" && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-[20px]
                    border
                    border-amber-200
                    bg-amber-50
                    p-4
                  "
                >
                  <Info
                    size={18}
                    className="
                      mt-0.5
                      shrink-0
                      text-amber-600
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-semibold
                      leading-6
                      text-amber-900
                    "
                  >
                    这是已经公开的房源。
                    修改后重新提交审核时，
                    新内容将进入审核状态。
                  </p>
                </div>
              )}

              {status === "rejected" && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-[20px]
                    border
                    border-rose-200
                    bg-rose-50
                    p-4
                  "
                >
                  <CircleAlert
                    size={18}
                    className="
                      mt-0.5
                      shrink-0
                      text-rose-600
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-semibold
                      leading-6
                      text-rose-900
                    "
                  >
                    该房源之前未通过审核。
                    修改相关信息后可以重新提交。
                  </p>
                </div>
              )}

              {/* BASIC */}

              <FormSection
                title="基本信息"
                description="修改房源主要展示信息"
              >
                <Field
                  label="房源标题"
                  required
                  full
                >
                  <input
                    value={form.title}
                    maxLength={80}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="月租金"
                  required
                  hint="日元 / 月"
                >
                  <MoneyInput
                    value={form.rent}
                    max={10_000_000}
                    onChange={(value) =>
                      updateField(
                        "rent",
                        value
                      )
                    }
                  />
                </Field>

                <Field
                  label="管理费"
                  hint="日元 / 月"
                >
                  <MoneyInput
                    value={form.managementFee}
                    max={1_000_000}
                    onChange={(value) =>
                      updateField(
                        "managementFee",
                        value
                      )
                    }
                  />
                </Field>

                <Field label="押金">
                  <select
                    value={form.deposit}
                    onChange={(event) =>
                      updateField(
                        "deposit",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    {[
                      "0个月",
                      "0.5个月",
                      "1个月",
                      "2个月",
                      "3个月以上",
                    ].map((value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="礼金">
                  <select
                    value={form.keyMoney}
                    onChange={(event) =>
                      updateField(
                        "keyMoney",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    {[
                      "0个月",
                      "0.5个月",
                      "1个月",
                      "2个月",
                      "3个月以上",
                    ].map((value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="户型"
                  required
                >
                  <select
                    value={form.layout}
                    onChange={(event) =>
                      updateField(
                        "layout",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      请选择户型
                    </option>

                    {layoutOptions.map(
                      (layout) => (
                        <option
                          key={layout}
                          value={layout}
                        >
                          {layout}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field
                  label="面积"
                  required
                  hint="㎡"
                >
                  <input
                    type="number"
                    inputMode="decimal"
                    min="1"
                    max="10000"
                    step="0.1"
                    value={form.area}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      if (
                        value === "" ||
                        (Number(value) >= 0 &&
                          Number(value) <= 10000)
                      ) {
                        updateField(
                          "area",
                          value
                        );
                      }
                    }}
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* LOCATION */}

              <FormSection
                title="房源位置"
                description="修改房源所在地和交通信息"
              >
                <Field
                  label="都道府县"
                  required
                >
                  <select
                    value={
                      form.prefecture
                    }
                    onChange={(event) =>
                      updateField(
                        "prefecture",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      请选择
                    </option>

                    {prefectures.map(
                      (prefecture) => (
                        <option
                          key={prefecture}
                          value={prefecture}
                        >
                          {prefecture}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field
                  label="市区町村"
                  required
                >
                  <input
                    value={form.city}
                    maxLength={50}
                    onChange={(event) =>
                      updateField(
                        "city",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="详细地址"
                  required
                  full
                >
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      value={form.address}
                      maxLength={150}
                      onChange={(event) =>
                        updateField(
                          "address",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="最近车站">
                  <input
                    value={
                      form.nearestStation
                    }
                    maxLength={50}
                    onChange={(event) =>
                      updateField(
                        "nearestStation",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="步行时间"
                  hint="分钟"
                >
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="120"
                    step="1"
                    value={form.stationWalk}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      if (
                        value === "" ||
                        (Number(value) >= 0 &&
                          Number(value) <= 120)
                      ) {
                        updateField(
                          "stationWalk",
                          value
                        );
                      }
                    }}
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* DETAILS */}

              <FormSection
                title="房屋详情"
                description="修改建筑和入住信息"
              >
                <Field label="楼层">
                  <input
                    type="text"
                    maxLength={3}
                    value={form.floor}
                    onChange={(event) => {
                      let value =
                        event.target.value
                          .toUpperCase()
                          .replace(
                            /[^0-9B]/g,
                            ""
                          );

                      if (
                        value.startsWith("B")
                      ) {
                        value =
                          "B" +
                          value
                            .slice(1)
                            .replace(/\D/g, "")
                            .slice(0, 2);
                      } else {
                        value = value
                          .replace(/\D/g, "")
                          .slice(0, 3);
                      }

                      updateField(
                        "floor",
                        value
                      );
                    }}
                    placeholder="例如：5 或 B1"
                    className={inputClass}
                  />
                </Field>

                <Field label="建筑年份">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1800"
                    max={
                      new Date().getFullYear() +
                      1
                    }
                    value={form.builtYear}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      if (
                        value === "" ||
                        Number(value) <=
                          new Date().getFullYear() +
                            1
                      ) {
                        updateField(
                          "builtYear",
                          value
                        );
                      }
                    }}
                    className={inputClass}
                  />
                </Field>

                <Field label="朝向">
                  <select
                    value={
                      form.direction
                    }
                    onChange={(event) =>
                      updateField(
                        "direction",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      请选择
                    </option>

                    {directionOptions.map(
                      (direction) => (
                        <option
                          key={direction}
                          value={direction}
                        >
                          {direction}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field label="建筑结构">
                  <select
                    value={
                      form.structure
                    }
                    onChange={(event) =>
                      updateField(
                        "structure",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      请选择
                    </option>

                    {structureOptions.map(
                      (structure) => (
                        <option
                          key={structure}
                          value={structure}
                        >
                          {structure}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field label="可入住日期">
                  <input
                    type="date"
                    value={
                      form.availableDate
                    }
                    onChange={(event) =>
                      updateField(
                        "availableDate",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* FEATURES */}

              <FormSection
                title="房源特点"
                description="修改房源标签"
                singleColumn
              >
                <div
                  className="
                    flex
                    flex-wrap
                    gap-2.5
                  "
                >
                  {featureOptions.map(
                    (feature) => {
                      const active =
                        features.includes(
                          feature
                        );

                      return (
                        <button
                          key={feature}
                          type="button"
                          onClick={() =>
                            toggleFeature(
                              feature
                            )
                          }
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-3.5
                            py-2
                            text-sm
                            font-bold
                            transition
                            ${
                              active
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                            }
                          `}
                        >
                          {active && (
                            <Check
                              size={14}
                            />
                          )}

                          {feature}
                        </button>
                      );
                    }
                  )}
                </div>
              </FormSection>

              {/* IMAGES */}

              <FormSection
                title="房源图片"
                description={`最多 ${MAX_IMAGES} 张，第一张作为封面`}
                singleColumn
              >
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    lg:grid-cols-4
                  "
                >
                  {images.map(
                    (image, index) => {
                      const imageUrl =
                        image.type ===
                        "existing"
                          ? image.url
                          : image.previewUrl;

                      return (
                        <div
                          key={image.id}
                          className="
                            relative
                            aspect-[4/3]
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-100
                          "
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={`房源图片 ${
                              index + 1
                            }`}
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />

                          {index === 0 && (
                            <span
                              className="
                                absolute
                                left-2
                                top-2
                                rounded-full
                                bg-slate-950/80
                                px-2.5
                                py-1
                                text-[10px]
                                font-black
                                text-white
                              "
                            >
                              封面
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                image
                              )
                            }
                            className="
                              absolute
                              right-2
                              top-2
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-full
                              bg-white/90
                              text-slate-700
                              shadow-sm
                              transition
                              hover:bg-rose-600
                              hover:text-white
                            "
                          >
                            <Trash2
                              size={14}
                            />
                          </button>
                        </div>
                      );
                    }
                  )}

                  {images.length <
                    MAX_IMAGES && (
                    <label
                      className="
                        flex
                        aspect-[4/3]
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-dashed
                        border-slate-300
                        bg-slate-50
                        transition
                        hover:border-blue-400
                        hover:bg-blue-50
                      "
                    >
                      <ImagePlus
                        size={24}
                        className="text-slate-400"
                      />

                      <span
                        className="
                          mt-2
                          text-xs
                          font-black
                          text-slate-600
                        "
                      >
                        添加图片
                      </span>

                      <span
                        className="
                          mt-1
                          text-[11px]
                          text-slate-400
                        "
                      >
                        {images.length}/
                        {MAX_IMAGES}
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={
                          handleImages
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </FormSection>

              {/* DESCRIPTION */}

              <FormSection
                title="房源说明"
                description="修改房源详细介绍"
                singleColumn
              >
                <Field
                  label="详细说明"
                  required
                  full
                >
                  <textarea
                    value={form.description}
                    maxLength={5000}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
                    rows={8}
                    className={`${inputClass} resize-y leading-7`}
                  />

                  <p
                    className="
                      mt-2
                      text-right
                      text-xs
                      text-slate-400
                    "
                  >
                    {
                      form.description
                        .length
                    } / 5000 字
                  </p>
                </Field>
              </FormSection>

              {/* CONTACT */}

              <FormSection
                title="联系方式"
                description="修改用户咨询时看到的联系方式"
              >
                <Field
                  label="联系人"
                  required
                >
                  <div className="relative">
                    <User
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      maxLength={50}
                      value={form.contactName}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(
                              /[^一-龯々ぁ-んァ-ヶーa-zA-Z\s・]/g,
                              ""
                            )
                            .slice(0, 50);

                        updateField(
                          "contactName",
                          value
                        );
                      }}
                      placeholder="例如：田中太郎"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="公司 / 店铺">
                  <input
                    value={form.company}
                    maxLength={100}
                    onChange={(event) =>
                      updateField(
                        "company",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="联系电话"
                  required
                >
                  <div className="relative">
                    <Phone
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={11}
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11)
                        )
                      }
                      placeholder="09012345678"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="邮箱">
                  <div className="relative">
                    <Mail
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="email"
                      maxLength={254}
                      value={form.email}
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>
              </FormSection>
            </div>

            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside
              className="
                h-fit
                xl:sticky
                xl:top-24
              "
            >
              <div
                className="
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <h2
                    className="
                      font-black
                      text-slate-950
                    "
                  >
                    修改预览
                  </h2>

                  <StatusBadge
                    status={status}
                  />
                </div>

                <div
                  className="
                    mt-5
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-slate-200
                  "
                >
                  <div
                    className="
                      flex
                      aspect-[16/10]
                      items-center
                      justify-center
                      overflow-hidden
                      bg-gradient-to-br
                      from-slate-100
                      to-slate-200
                    "
                  >
                    {images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          images[0].type ===
                          "existing"
                            ? images[0].url
                            : images[0]
                                .previewUrl
                        }
                        alt="封面预览"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <Building2
                        size={30}
                        className="text-slate-400"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3
                      className="
                        line-clamp-2
                        font-black
                        text-slate-950
                      "
                    >
                      {form.title ||
                        "房源标题"}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-xl
                        font-black
                        text-blue-600
                      "
                    >
                      {form.rent
                        ? `¥${Number(
                            form.rent
                          ).toLocaleString()}`
                        : "¥--"}

                      <span
                        className="
                          ml-1
                          text-xs
                          font-bold
                          text-slate-400
                        "
                      >
                        / 月
                      </span>
                    </p>

                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        gap-2
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      {form.layout && (
                        <span>
                          {form.layout}
                        </span>
                      )}

                      {form.area && (
                        <span>
                          {form.area}㎡
                        </span>
                      )}

                      {locationPreview && (
                        <span>
                          {
                            locationPreview
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    rounded-2xl
                    bg-blue-50
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-2
                    "
                  >
                    <Info
                      size={16}
                      className="
                        mt-0.5
                        shrink-0
                        text-blue-600
                      "
                    />

                    <p
                      className="
                        text-xs
                        leading-5
                        text-blue-800
                      "
                    >
                      保存草稿不会公开修改内容。
                      重新提交后进入审核流程。
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    space-y-2.5
                  "
                >
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      void saveHouse(
                        "draft"
                      )
                    }
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-black
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {saving ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}

                    保存修改
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      px-4
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-lg
                      shadow-blue-600/15
                      transition
                      hover:bg-blue-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {saving ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Send size={17} />
                    )}

                    重新提交审核
                  </button>
                </div>

                <Link
                  href={`/houses/${houseId}`}
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-slate-500
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  查看当前公开页面
                </Link>
              </div>

              <div
                className="
                  mt-4
                  rounded-[22px]
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    font-black
                    text-amber-900
                  "
                >
                  <ShieldCheck size={17} />
                  修改提醒
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    leading-5
                    text-amber-900/70
                  "
                >
                  正式上线后只有房源发布者本人和管理员
                  可以进入这个编辑页面。
                </p>
              </div>
            </aside>
          </form>
        </Container>
      </section>
    </main>
  );
}

/* ================================================= */
/* STATUS */
/* ================================================= */

function StatusBadge({
  status,
}: {
  status: HouseStatus;
}) {
  const config = {
    draft: {
      label: "草稿",
      className:
        "bg-slate-100 text-slate-600",
    },

    pending: {
      label: "审核中",
      className:
        "bg-amber-100 text-amber-700",
    },

    published: {
      label: "已发布",
      className:
        "bg-emerald-100 text-emerald-700",
    },

    rejected: {
      label: "未通过",
      className:
        "bg-rose-100 text-rose-700",
    },
  }[status];

  return (
    <span
      className={`
        inline-flex
        shrink-0
        rounded-full
        px-3
        py-1.5
        text-[11px]
        font-black
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}

/* ================================================= */
/* FORM SECTION */
/* ================================================= */

function FormSection({
  title,
  description,
  children,
  singleColumn = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  singleColumn?: boolean;
}) {
  return (
    <section
      className="
        rounded-[26px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-6
      "
    >
      <div
        className="
          border-b
          border-slate-100
          pb-5
        "
      >
        <h2
          className="
            text-lg
            font-black
            text-slate-950
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      <div
        className={
          singleColumn
            ? "mt-6"
            : "mt-6 grid gap-5 md:grid-cols-2"
        }
      >
        {children}
      </div>
    </section>
  );
}

/* ================================================= */
/* FIELD */
/* ================================================= */

function Field({
  label,
  hint,
  required = false,
  full = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        full ? "md:col-span-2" : ""
      }
    >
      <div
        className="
          mb-2
          flex
          min-h-5
          items-center
          justify-between
          gap-3
        "
      >
        <label
          className="
            text-sm
            font-black
            text-slate-700
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-rose-500">
              *
            </span>
          )}
        </label>

        {hint && (
          <span
            className="
              text-[11px]
              text-slate-400
            "
          >
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

/* ================================================= */
/* MONEY */
/* ================================================= */

function MoneyInput({
  value,
  onChange,
  max,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
  max: number;
}) {
  return (
    <div className="relative">
      <span
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-sm
          font-black
          text-slate-400
        "
      >
        ¥
      </span>

      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const raw =
            event.target.value.replace(
              /\D/g,
              ""
            );

          if (!raw) {
            onChange("");
            return;
          }

          const amount =
            Math.min(
              Number(raw),
              max
            );

          onChange(
            String(amount)
          );
        }}
        className={`${inputClass} pl-9`}
      />
    </div>
  );
}

/* ================================================= */
/* MESSAGE */
/* ================================================= */

function MessageBox({
  type,
  children,
}: {
  type: "error" | "success";
  children: ReactNode;
}) {
  const isError =
    type === "error";

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        rounded-[20px]
        border
        p-4
        ${
          isError
            ? "border-rose-200 bg-rose-50 text-rose-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }
      `}
    >
      {isError ? (
        <CircleAlert
          size={18}
          className="
            mt-0.5
            shrink-0
          "
        />
      ) : (
        <Check
          size={18}
          className="
            mt-0.5
            shrink-0
          "
        />
      )}

      <p
        className="
          text-sm
          font-semibold
          leading-6
        "
      >
        {children}
      </p>
    </div>
  );
}

/* ================================================= */
/* LOADING */
/* ================================================= */

function LoadingPage() {
  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
      "
    >
      <div className="text-center">
        <Loader2
          size={28}
          className="
            mx-auto
            animate-spin
            text-blue-600
          "
        />

        <p
          className="
            mt-3
            text-sm
            font-bold
            text-slate-500
          "
        >
          正在读取房源信息...
        </p>
      </div>
    </main>
  );
}

/* ================================================= */
/* STYLES */
/* ================================================= */

const inputClass = `
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-sm
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-blue-400
  focus:ring-4
  focus:ring-blue-50
`;

const selectClass = `
  w-full
  appearance-none
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-sm
  font-semibold
  text-slate-700
  outline-none
  transition
  focus:border-blue-400
  focus:ring-4
  focus:ring-blue-50
`;