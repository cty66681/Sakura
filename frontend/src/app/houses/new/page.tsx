"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  ImagePlus,
  Info,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";

type PublishAction = "draft" | "submit";

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

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface EditHouseResponse {
  success: boolean;

  data?: {
    id: number;

    title: string;

    rent: number;
    managementFee: number;

    deposit: string;
    keyMoney: string;

    layout: string;
    area: number;

    prefecture: string;
    city: string;
    address: string;

    nearestStation: string;
    stationWalk: number | null;

    floor: string;
    builtYear: number | null;

    direction: string;
    structure: string;

    availableDate: string;

    description: string;

    features: string[];

    contactName: string;
    company: string;

    phone: string;
    email: string;

    moderationStatus: "draft";
  };

  error?: string;
}

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

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
| TODO [API - POST]
|--------------------------------------------------------------------------
|
| 创建房源
|
| POST /api/houses
|
| Body:
| {
|   title: string;
|   rent: number;
|   managementFee?: number;
|   deposit: string;
|   keyMoney: string;
|   layout: string;
|   area: number;
|   prefecture: string;
|   city: string;
|   address: string;
|   nearestStation?: string;
|   stationWalk?: number;
|   floor?: string;
|   builtYear?: string;
|   direction?: string;
|   structure?: string;
|   availableDate?: string;
|   description: string;
|   tags: string[];
|   imageIds: string[];
|   contactName: string;
|   company?: string;
|   phone: string;
|   email?: string;
|   status: "draft" | "pending";
| }
|
| 后端必须：
| - 从登录 Session 获取 authorId，不能相信前端传来的用户 ID
| - 校验用户身份
| - 校验字段
| - 校验图片归属
| - draft 保存为草稿
| - submit 保存为 pending，等待审核
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - POST]
|--------------------------------------------------------------------------
|
| 上传房源图片
|
| POST /api/uploads/houses
|
| Content-Type: multipart/form-data
|
| 后端返回：
| {
|   id: string;
|   url: string;
| }
|
| 当前阶段只使用浏览器本地预览。
|
|--------------------------------------------------------------------------
*/

const initialForm: HouseForm = {
  title: "",
  rent: "",
  managementFee: "",
  deposit: "0个月",
  keyMoney: "0个月",

  layout: "",
  area: "",

  prefecture: "",
  city: "",
  address: "",
  nearestStation: "",
  stationWalk: "",

  floor: "",
  builtYear: "",
  direction: "",
  structure: "",
  availableDate: "",

  description: "",

  contactName: "",
  company: "",
  phone: "",
  email: "",
};

export default function NewHousePage() {
  const [form, setForm] = useState<HouseForm>(initialForm);
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const [houseId, setHouseId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [loadingDraft, setLoadingDraft] = useState(false);

  const locationPreview = useMemo(() => {
    return [form.prefecture, form.city]
      .filter(Boolean)
      .join(" · ");
  }, [form.prefecture, form.city]);

  useEffect(() => {
  let cancelled = false;

  async function loadDraft() {
    const searchParams =
      new URLSearchParams(
        window.location.search
      );

    const editParam =
      searchParams.get("edit");

    if (!editParam) {
      return;
    }

    const editId =
      Number(editParam);

    if (
      !Number.isInteger(editId) ||
      editId <= 0
    ) {
      if (!cancelled) {
        setError(
          "无效的房源编辑地址。"
        );
      }

      return;
    }

    if (!cancelled) {
      setLoadingDraft(true);
    }

    try {
      const response =
        await fetch(
          `/api/account/houses/${editId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const result: EditHouseResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.error ||
            "读取房源草稿失败"
        );
      }

      if (cancelled) {
        return;
      }

      const house =
        result.data;

      setHouseId(
        house.id
      );

      setForm({
        title:
          house.title,

        rent:
          house.rent > 0
            ? String(house.rent)
            : "",

        managementFee:
          house.managementFee > 0
            ? String(
                house.managementFee
              )
            : "",

        deposit:
          house.deposit,

        keyMoney:
          house.keyMoney,

        layout:
          house.layout,

        area:
          house.area > 0
            ? String(house.area)
            : "",

        prefecture:
          house.prefecture,

        city:
          house.city,

        address:
          house.address,

        nearestStation:
          house.nearestStation,

        stationWalk:
          house.stationWalk !== null
            ? String(
                house.stationWalk
              )
            : "",

        floor:
          house.floor,

        builtYear:
          house.builtYear !== null
            ? String(
                house.builtYear
              )
            : "",

        direction:
          house.direction,

        structure:
          house.structure,

        availableDate:
          house.availableDate,

        description:
          house.description,

        contactName:
          house.contactName,

        company:
          house.company,

        phone:
          house.phone,

        email:
          house.email,
      });

      setFeatures(
        house.features ?? []
      );
    } catch (error) {
      if (!cancelled) {
        setError(
          error instanceof Error
            ? error.message
            : "读取房源草稿失败"
        );
      }
    } finally {
      if (!cancelled) {
        setLoadingDraft(false);
      }
    }
  }

  void loadDraft();

  return () => {
    cancelled = true;
  };
}, []);

  function updateField<K extends keyof HouseForm>(
    key: K,
    value: HouseForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (error) {
      setError("");
    }

    if (notice) {
      setNotice("");
    }
  }

  function toggleFeature(feature: string) {
    setFeatures((current) => {
      if (current.includes(feature)) {
        return current.filter((item) => item !== feature);
      }

      return [...current, feature];
    });
  }

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      setError(`最多可以上传 ${MAX_IMAGES} 张图片。`);
      event.target.value = "";
      return;
    }

    const oversized =
      files.some(
        (file) =>
          file.size > MAX_IMAGE_SIZE
      );

    const accepted = files
      .filter(
        (file) =>
          file.type.startsWith("image/") &&
          file.size <= MAX_IMAGE_SIZE
      )
      .slice(0, remaining);

    if (oversized) {
      setError(
        "单张图片不能超过 10MB。"
      );
    }

    const newImages: ImageItem[] = accepted.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);

    if (files.length > remaining) {
      setError(`最多可以上传 ${MAX_IMAGES} 张图片。`);
    } else {
      setError("");
    }

    event.target.value = "";
  }

  function removeImage(id: string) {
    setImages((current) => {
      const target = current.find((image) => image.id === id);

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((image) => image.id !== id);
    });
  }

  function validateForSubmit() {
    if (!form.title.trim()) {
      return "请输入房源标题。";
    }

    if (form.title.trim().length > 80) {
      return "房源标题不能超过 80 个字。";
    }

    if (!form.rent.trim()) {
      return "请输入月租金。";
    }

    const rent = Number(form.rent);

    if (!Number.isFinite(rent) || rent <= 0) {
      return "月租金需要大于 0。";
    }

    if (rent > 10_000_000) {
      return "月租金不能超过 10,000,000 日元。";
    }

    if (form.managementFee) {
      const managementFee =
        Number(form.managementFee);

      if (
        !Number.isFinite(managementFee) ||
        managementFee < 0
      ) {
        return "请输入正确的管理费。";
      }

      if (managementFee > 1_000_000) {
        return "管理费不能超过 1,000,000 日元。";
      }
    }

    if (!form.layout) {
      return "请选择户型。";
    }

    if (!form.area.trim()) {
      return "请输入房屋面积。";
    }

    const area = Number(form.area);

    if (!Number.isFinite(area) || area <= 0) {
      return "房屋面积需要大于 0。";
    }

    if (area > 10_000) {
      return "房屋面积不能超过 10,000㎡。";
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

    if (
      form.stationWalk &&
      Number(form.stationWalk) > 120
    ) {
      return "步行时间不能超过 120 分钟。";
    }

    if (form.builtYear) {
      const builtYear =
        Number(form.builtYear);

      const maxYear =
        new Date().getFullYear() + 1;

      if (
        builtYear < 1800 ||
        builtYear > maxYear
      ) {
        return `建筑年份请输入 1800～${maxYear}。`;
      }
    }

    if (!form.description.trim()) {
      return "请输入房源说明。";
    }

    if (
      form.description.trim().length >
      5000
    ) {
      return "房源说明不能超过 5000 个字。";
    }

    if (!form.contactName.trim()) {
      return "请输入联系人姓名。";
    }

    if (!form.phone.trim()) {
      return "请输入联系电话。";
    }

    if (
      !/^0\d{9,10}$/.test(
        form.phone
      )
    ) {
      return "请输入正确的日本电话号码。";
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      return "请输入正确的邮箱地址。";
    }

    if (!form.contactName.trim()) {
      return "请输入联系人姓名。";
    }

    if (
      form.contactName.trim().length < 2
    ) {
      return "联系人姓名至少需要 2 个字符。";
    }

    if (
      !/^[一-龯々ぁ-んァ-ヶーa-zA-Z\s・]+$/.test(
        form.contactName.trim()
      )
    ) {
      return "联系人姓名包含不支持的字符。";
    }

    if (
      form.floor &&
      !/^\d{1,3}$/.test(form.floor)
    ) {
      return "楼层请输入 1～3 位数字。";
    }

    if (
      form.floor &&
      !/^(?:[1-9]\d{0,2}|B[1-9]\d?)$/.test(form.floor)
    ) {
      return "楼层请输入 1～999，地下楼层请输入 B1～B99。";
    }

    return "";
  }

  async function saveHouse(
  action: PublishAction
) {
  setError("");
  setNotice("");

  if (submitted) {
    setError(
      "该房源已经提交审核，暂时不能继续修改。"
    );
    return;
  }

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
    |--------------------------------------------------------------------------
    | TODO [API - POST] POST /api/uploads/houses
    |--------------------------------------------------------------------------
    |
    | 图片上传完成后：
    | 1. 先上传 images
    | 2. 获取 imageIds
    | 3. 再保存 / 更新房源
    |
    | 当前阶段 imageIds 暂时为空。
    |
    */

    const payload = {
      title:
        form.title.trim(),

      rent:
        Number(
          form.rent || 0
        ),

      managementFee:
        Number(
          form.managementFee ||
            0
        ),

      deposit:
        form.deposit,

      keyMoney:
        form.keyMoney,

      layout:
        form.layout,

      area:
        Number(
          form.area || 0
        ),

      prefecture:
        form.prefecture,

      city:
        form.city.trim(),

      address:
        form.address.trim(),

      nearestStation:
        form.nearestStation.trim(),

      stationWalk:
        Number(
          form.stationWalk || 0
        ),

      floor:
        form.floor.trim(),

      builtYear:
        form.builtYear,

      direction:
        form.direction,

      structure:
        form.structure,

      availableDate:
        form.availableDate,

      description:
        form.description.trim(),

      tags:
        features,

      imageIds: [],

      contactName:
        form.contactName.trim(),

      company:
        form.company.trim(),

      phone:
        form.phone.trim(),

      email:
        form.email.trim(),

      status:
        action === "draft"
          ? ("draft" as const)
          : ("pending" as const),
    };

    /*
    |--------------------------------------------------------------------------
    | Create / Update
    |--------------------------------------------------------------------------
    |
    | 第一次：
    | POST /api/houses
    |
    | 已经创建草稿以后：
    | PATCH /api/houses/:id
    |
    */

    const isExistingHouse =
      houseId !== null;

    const endpoint =
      isExistingHouse
        ? `/api/houses/${houseId}`
        : "/api/houses";

    const method =
      isExistingHouse
        ? "PATCH"
        : "POST";

    const response =
      await fetch(endpoint, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      });

    const result =
      await response.json();

    if (!response.ok) {
      console.error(
        `[${method} ${endpoint}]`,
        result
      );

      throw new Error(
        result?.error ||
          "房源保存失败，请稍后重试。"
      );
    }

    const savedHouseId =
      result?.house?.id;

    if (
      houseId === null &&
      typeof savedHouseId ===
        "number"
    ) {
      setHouseId(
        savedHouseId
      );
    }

    if (
      action === "draft"
    ) {
      setNotice(
        isExistingHouse
          ? "草稿已更新。"
          : "草稿已保存。"
      );
    } else {
      setSubmitted(true);

      setNotice(
        "房源已提交审核。审核通过后才会公开显示。"
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.error(
      "[House save error]",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "房源保存失败，请稍后重试。"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } finally {
    setSaving(false);
  }
}

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveHouse("submit");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="px-4 py-5">
            <Link
              href="/account/publish"
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
              返回发布中心
            </Link>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-slate-950">
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
          <div className="relative px-4 py-10 sm:py-12">
            <div className="flex max-w-3xl items-start gap-4">
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
                  {houseId
                    ? "EDIT HOUSE"
                    : "NEW HOUSE"}
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
                  {houseId
                    ? "编辑房源"
                    : "发布房源"}
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-slate-400
                  "
                >
                  {houseId
                    ? "继续完善这套房源，修改内容会保存到原来的草稿。"
                    : "填写真实的房源信息。你可以先保存草稿，确认完成后再提交审核。"}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* FORM */}
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
            <div className="min-w-0 space-y-6">

              {loadingDraft && (
                <MessageBox type="success">
                  正在读取房源草稿...
                </MessageBox>
              )}

              {/* Messages */}

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

              {/* ================================================= */}
              {/* BASIC */}
              {/* ================================================= */}

              <FormSection
                title="基本信息"
                description="填写用户最先看到的房源信息"
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
                    placeholder="例如：池袋站步行8分钟 1LDK"
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
                    onChange={(value) =>
                      updateField("rent", value)
                    }
                    placeholder="89000"
                    max={10_000_000}
                  />
                </Field>

                <Field
                  label="管理费"
                  hint="日元 / 月"
                >
                  <MoneyInput
                    value={form.managementFee}
                    onChange={(value) =>
                      updateField("managementFee", value)
                    }
                    placeholder="5000"
                    max={10_000_000}
                  />
                </Field>

                <Field
                  label="押金"
                >
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
                    <option value="0个月">
                      0个月
                    </option>
                    <option value="0.5个月">
                      0.5个月
                    </option>
                    <option value="1个月">
                      1个月
                    </option>
                    <option value="2个月">
                      2个月
                    </option>
                    <option value="3个月以上">
                      3个月以上
                    </option>
                  </select>
                </Field>

                <Field
                  label="礼金"
                >
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
                    <option value="0个月">
                      0个月
                    </option>
                    <option value="0.5个月">
                      0.5个月
                    </option>
                    <option value="1个月">
                      1个月
                    </option>
                    <option value="2个月">
                      2个月
                    </option>
                    <option value="3个月以上">
                      3个月以上
                    </option>
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

                    {layoutOptions.map((layout) => (
                      <option
                        key={layout}
                        value={layout}
                      >
                        {layout}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="面积"
                  required
                  hint="㎡"
                >
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="10000"
                      step="0.1"
                      value={form.area}
                      onChange={(event) => {
                        const value = event.target.value;

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
                      placeholder="35"
                      className={`${inputClass} pr-12`}
                    />

                    <span
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        font-bold
                        text-slate-400
                      "
                    >
                      ㎡
                    </span>
                  </div>
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* LOCATION */}
              {/* ================================================= */}

              <FormSection
                title="房源位置"
                description="填写实际房源所在地区，不使用地图"
              >
                <Field
                  label="都道府县"
                  required
                >
                  <select
                    value={form.prefecture}
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

                    {prefectures.map((prefecture) => (
                      <option
                        key={prefecture}
                        value={prefecture}
                      >
                        {prefecture}
                      </option>
                    ))}
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
                    placeholder="例如：丰岛区"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="详细地址"
                  required
                  full
                  hint="公开显示时以后可根据产品规则隐藏房号等敏感部分"
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
                      placeholder="例如：东京都丰岛区西池袋..."
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field
                  label="最近车站"
                >
                  <input
                    value={form.nearestStation}
                    maxLength={50}
                    onChange={(event) =>
                      updateField(
                        "nearestStation",
                        event.target.value
                      )
                    }
                    placeholder="例如：池袋站"
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
                      const value = event.target.value;

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
                    placeholder="8"
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* DETAILS */}
              {/* ================================================= */}

              <FormSection
                title="房屋详情"
                description="补充楼层、建筑时间、结构等信息"
              >
                <Field label="楼层">
                  <input
                    type="text"
                    inputMode="text"
                    maxLength={3}
                    value={form.floor}
                    onChange={(event) => {
                      let value = event.target.value
                        .toUpperCase()
                        .replace(/[^0-9B]/g, "");

                      if (value.startsWith("B")) {
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

                      updateField("floor", value);
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
                    max={new Date().getFullYear() + 1}
                    value={form.builtYear}
                    onChange={(event) => {
                      const value = event.target.value;

                      if (
                        value === "" ||
                        Number(value) <=
                          new Date().getFullYear() + 1
                      ) {
                        updateField(
                          "builtYear",
                          value
                        );
                      }
                    }}
                    placeholder="2018"
                    className={inputClass}
                  />
                </Field>

                <Field label="朝向">
                  <select
                    value={form.direction}
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

                    {directionOptions.map((direction) => (
                      <option
                        key={direction}
                        value={direction}
                      >
                        {direction}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="建筑结构">
                  <select
                    value={form.structure}
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

                    {structureOptions.map((structure) => (
                      <option
                        key={structure}
                        value={structure}
                      >
                        {structure}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="可入住日期">
                  <input
                    type="date"
                    value={form.availableDate}
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

              {/* ================================================= */}
              {/* FEATURES */}
              {/* ================================================= */}

              <FormSection
                title="房源特点"
                description="选择符合实际情况的标签，可多选"
                singleColumn
              >
                <div
                  className="
                    flex
                    flex-wrap
                    gap-2.5
                  "
                >
                  {featureOptions.map((feature) => {
                    const active =
                      features.includes(feature);

                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() =>
                          toggleFeature(feature)
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
                          <Check size={14} />
                        )}

                        {feature}
                      </button>
                    );
                  })}
                </div>
              </FormSection>

              {/* ================================================= */}
              {/* IMAGES */}
              {/* ================================================= */}

              <FormSection
                title="房源图片"
                description={`最多上传 ${MAX_IMAGES} 张。第一张图片以后作为房源封面。`}
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
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="
                        group
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
                        src={image.previewUrl}
                        alt={`房源图片 ${index + 1}`}
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
                            backdrop-blur
                          "
                        >
                          封面
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(image.id)
                        }
                        aria-label="删除图片"
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
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {images.length < MAX_IMAGES && (
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
                        text-center
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
                        {images.length}/{MAX_IMAGES}
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImages}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </FormSection>

              {/* ================================================= */}
              {/* DESCRIPTION */}
              {/* ================================================= */}

              <FormSection
                title="房源说明"
                description="介绍交通、周边环境、费用和入住条件等"
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
                    placeholder={`例如：

                  ・池袋站步行8分钟
                  ・附近有便利店和超市
                  ・可养小型宠物
                  ・初期费用可咨询
                  ・可入住时间...`}
                    className={`${inputClass} resize-y leading-7`}
                  />

                  <div
                    className="
                      mt-2
                      text-right
                      text-xs
                      text-slate-400
                    "
                  >
                    {form.description.length}/ 5000 字
                  </div>
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* CONTACT */}
              {/* ================================================= */}

              <FormSection
                title="联系方式"
                description="用户咨询该房源时使用"
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
                    placeholder="个人发布可以不填写"
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
                      placeholder="example@email.com"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>
              </FormSection>
            </div>

            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside className="h-fit xl:sticky xl:top-24">
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
                <h2
                  className="
                    text-base
                    font-black
                    text-slate-950
                  "
                >
                  发布预览
                </h2>

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
                        src={images[0].previewUrl}
                        alt="房源封面预览"
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
                        "你的房源标题会显示在这里"}
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
                          {locationPreview}
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
                      保存草稿不会公开。
                      提交后房源进入审核状态，
                      审核通过后才会显示在房源页面。
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    disabled={
                      saving ||
                      submitted ||
                      loadingDraft
                    }
                    onClick={() =>
                      void saveHouse("draft")
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
                    <Save size={17} />

                    {submitted
                      ? "已提交审核"
                      : saving
                        ? "处理中..."
                        : houseId
                          ? "更新草稿"
                          : "保存草稿"}
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      submitted ||
                      loadingDraft
                    }
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
                    <Send size={17} />

                    {submitted
                      ? "已提交审核"
                      : saving
                        ? "处理中..."
                        : "提交审核"}
                  </button>
                </div>
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
                  房源发布提醒
                </div>

                <div
                  className="
                    mt-3
                    space-y-2
                    text-xs
                    leading-5
                    text-amber-900/70
                  "
                >
                  <p>
                    请确认你有权发布该房源。
                  </p>

                  <p>
                    不要上传身份证、银行卡等与房源展示无关的私人资料。
                  </p>

                  <p>
                    房源价格、地址和入住条件应与实际情况一致。
                  </p>
                </div>
              </div>
            </aside>
          </form>
        </Container>
      </section>
    </main>
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
  children: React.ReactNode;
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
  children: React.ReactNode;
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
/* MONEY INPUT */
/* ================================================= */

function MoneyInput({
  value,
  onChange,
  placeholder,
  max,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
          const raw = event.target.value.replace(/\D/g, "");

          if (!raw) {
            onChange("");
            return;
          }

          const amount = Math.min(
            Number(raw),
            max
          );

          onChange(String(amount));
        }}
        placeholder={placeholder}
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
  children: React.ReactNode;
}) {
  const isError = type === "error";

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
          className="mt-0.5 shrink-0"
        />
      ) : (
        <Check
          size={18}
          className="mt-0.5 shrink-0"
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

      <X
        size={15}
        className="
          ml-auto
          mt-1
          shrink-0
          opacity-40
        "
      />
    </div>
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