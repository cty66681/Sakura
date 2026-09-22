"use client";

import {
  Fragment,
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Building2,
  Check,
  LockKeyhole,
  MessageCircle,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  HOUSE_LISTING_STATUS_LABELS,
  type HouseListingStatus,
} from "@/data/houses";

import {
  getPublisherById,
} from "@/data/publishers";

import Link from "next/link";

import {
  MOCK_CURRENT_USER_ID,
  getConversationBetween,
  getHouseContextMessages,
  hasHouseReference,
  useChatStore,
} from "@/store/chatStore";

export interface HouseContactProps {
  houseId: number;

  /*
   * 房源所属发布账号。
   *
   * 后续 conversation 的关系是：
   * 当前登录用户 ↔ publisherId
   *
   * 不是：
   * 当前登录用户 ↔ houseId
   */
  publisherId: string;

  /*
   * 当前正在查看的房源信息。
   *
   * 用于：
   * 1. 打开客服后的 3～5 秒“发送该房源”提示
   * 2. 提示消失后的聊天顶部房源信息
   * 3. 用户真正点击发送后生成房源 Card
   *
   * 单纯打开客服不会写入消息。
   */
  houseTitle: string;
  rent: string;
  location: string;
  layout: string;
  area: string;
  station: string;
  walkMinutes: number | null;

  listingStatus: HouseListingStatus;
}


type ContactType =
  | "wechat"
  | "line"
  | "phone"
  | "email";

  function getTokyoDateKey(
  value: string
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(date);

  const year =
    parts.find(
      (part) =>
        part.type === "year"
    )?.value ?? "";

  const month =
    parts.find(
      (part) =>
        part.type === "month"
    )?.value ?? "";

  const day =
    parts.find(
      (part) =>
        part.type === "day"
    )?.value ?? "";

  return `${year}-${month}-${day}`;
}

function formatMessageTime(
  value: string
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(date);
}

function formatMessageDateTime(
  value: string
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone: "Asia/Tokyo",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(date);
}

function getMessageTimeLabel(
  message: {
    createdAt: string;
  },
  previousMessage: {
    createdAt: string;
  } | null
) {
  const currentDate =
    new Date(message.createdAt);

  if (
    Number.isNaN(
      currentDate.getTime()
    )
  ) {
    return null;
  }

  if (!previousMessage) {
    return formatMessageDateTime(
      message.createdAt
    );
  }

  const previousDate =
    new Date(
      previousMessage.createdAt
    );

  if (
    Number.isNaN(
      previousDate.getTime()
    )
  ) {
    return formatMessageDateTime(
      message.createdAt
    );
  }

  const currentDay =
    getTokyoDateKey(
      message.createdAt
    );

  const previousDay =
    getTokyoDateKey(
      previousMessage.createdAt
    );

  if (
    currentDay !== previousDay
  ) {
    return formatMessageDateTime(
      message.createdAt
    );
  }

  const gapMilliseconds =
    currentDate.getTime() -
    previousDate.getTime();

  if (
    gapMilliseconds >=
    10 * 60 * 1000
  ) {
    return formatMessageTime(
      message.createdAt
    );
  }

  return null;
}

const quickQuestions = [
  "现在还有空室吗？",
  "外国人可以申请吗？",
  "初期费用大概多少？",
  "可以预约看房吗？",
];

const contactOptions: {
  key: ContactType;
  label: string;
}[] = [
  {
    key: "wechat",
    label: "微信",
  },
  {
    key: "line",
    label: "LINE",
  },
  {
    key: "phone",
    label: "电话",
  },
  {
    key: "email",
    label: "邮箱",
  },
];

export default function HouseContact({
  houseId,
  publisherId,
  houseTitle,
  rent,
  location,
  layout,
  area,
  station,
  walkMinutes,
  listingStatus,
}: HouseContactProps) {

  const publisher =
    getPublisherById(
      publisherId
    );

  const publisherName =
    publisher?.name ??
    "房源负责人";

  const publisherCompany =
    publisher?.company ?? null;

  const [chatOpen, setChatOpen] =
    useState(false);

  const [
    showHouseSendPrompt,
    setShowHouseSendPrompt,
  ] = useState(false);

  const [input, setInput] =
    useState("");

    const conversations =
      useChatStore(
        (state) =>
          state.conversations
      );

    const allMessages =
      useChatStore(
        (state) =>
          state.messages
      );

    const sendContextTextMessage =
      useChatStore(
        (state) =>
          state.sendContextTextMessage
      );

    const sendEntityReference =
      useChatStore(
        (state) =>
          state.sendEntityReference
      );

    const conversation =
      getConversationBetween(
        conversations,
        MOCK_CURRENT_USER_ID,
        publisherId
      );

    const currentHouseMessages =
      conversation
        ? getHouseContextMessages(
            allMessages,
            conversation.id,
            houseId
          )
        : [];

    const houseCardAlreadySent =
      conversation
        ? hasHouseReference(
            allMessages,
            conversation.id,
            houseId
          )
        : false;


  const [
    showContactRequest,
    setShowContactRequest,
  ] = useState(false);

  const [
    selectedContacts,
    setSelectedContacts,
  ] = useState<ContactType[]>([
    "wechat",
  ]);

  const [
    contactRequestSent,
    setContactRequestSent,
  ] = useState(false);

  useEffect(() => {
    if (
      !chatOpen ||
      !showHouseSendPrompt
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setShowHouseSendPrompt(false);
      }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    chatOpen,
    showHouseSendPrompt,
    houseId,
  ]);

  const canStartConversation =
    listingStatus === "available";

  const hasSentMessage =
    currentHouseMessages.some(
      (message) =>
        message.senderId ===
          MOCK_CURRENT_USER_ID
    );

  function openChat() {
    if (!canStartConversation) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TODO [API - GET]
    |--------------------------------------------------------------------------
    |
    | GET /api/conversations/with/:publisherId/messages
    |     ?contextType=house
    |     &contextId=:houseId
    |
    | 打开房源客服时：
    |
    | 1. 从 Session 获取当前登录用户
    | 2. 查找 当前用户 ↔ publisherId 的长期 conversation
    | 3. 没有 conversation → 返回空消息，不创建
    | 4. 已有 conversation → 只返回：
    |
    |    contextType = "house"
    |    contextId = 当前 houseId
    |
    |    的消息
    |
    | 所以：
    |
    | 房源小客服 = 当前房源视图
    | 消息中心   = 同一个 conversation 的完整视图
    |
    | 单纯打开客服：
    |
    | - 不创建 conversation
    | - 不创建 message
    | - 不会出现在消息中心
    |
    |--------------------------------------------------------------------------
    */

    setShowHouseSendPrompt(
      !houseCardAlreadySent
    );

    setChatOpen(true);
  }

  function sendCurrentHouse() {
    sendEntityReference({
      senderId:
        MOCK_CURRENT_USER_ID,

      recipientId:
        publisherId,

      entityType: "house",

      entityId: houseId,

      contextType: "house",

      contextId: houseId,
    });

    setShowHouseSendPrompt(false);
  }

  function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const text =
      input.trim();

    if (!text) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST]
    |--------------------------------------------------------------------------
    |
    | POST /api/houses/:houseId/conversations/messages
    |
    | 首次发送：
    |
    | - 验证登录
    | - 检查房源状态
    | - 检查 moderationStatus
    | - 查已有 conversation
    | - 没有则创建 conversation
    | - 写入 message
    |
    | 已有会话：
    |
    | POST /api/conversations/:conversationId/messages
    |
    | 后端必须同时执行：
    |
    | - userId 限流
    | - IP 限流
    | - 设备 / session 风控
    | - 相同内容批量发送检测
    | - 垃圾广告检测
    | - 被拉黑关系检查
    | - banned / restricted 账号检查
    |
    |--------------------------------------------------------------------------
    */

    sendContextTextMessage({
      senderId:
        MOCK_CURRENT_USER_ID,

      recipientId:
        publisherId,

      content: text,

      entityType: "house",

      entityId: houseId,

      contextType: "house",

      contextId: houseId,
    });

    setShowHouseSendPrompt(false);

    setInput("");
  }

  function sendQuickQuestion(
    question: string
  ) {
    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST]
    |--------------------------------------------------------------------------
    |
    | 与正常发送消息使用相同 API。
    | 快捷提问不能绕过后端风控。
    |
    |--------------------------------------------------------------------------
    */

    sendContextTextMessage({
      senderId:
        MOCK_CURRENT_USER_ID,

      recipientId:
        publisherId,

      content: question,

      entityType: "house",

      entityId: houseId,

      contextType: "house",

      contextId: houseId,
    });

    setShowHouseSendPrompt(false);
  }

  function toggleContact(
    contact: ContactType
  ) {
    setSelectedContacts(
      (current) =>
        current.includes(contact)
          ? current.filter(
              (item) =>
                item !== contact
            )
          : [
              ...current,
              contact,
            ]
    );
  }

  function sendContactRequest() {
    if (
      selectedContacts.length ===
        0 ||
      !hasSentMessage
    ) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST]
    |--------------------------------------------------------------------------
    |
    | POST /api/conversations/:conversationId/contact-share-requests
    |
    | Body:
    |
    | {
    |   fields: [
    |     "wechat",
    |     "line",
    |     "phone",
    |     "email"
    |   ]
    | }
    |
    | 后端：
    |
    | - requester 必须属于 conversation
    | - recipient 必须属于 conversation
    | - 默认 status = pending
    | - 防止重复申请
    | - 限制高频申请
    |
    | 数据表：
    |
    | contact_share_requests
    |
    | id
    | conversationId
    | requesterId
    | recipientId
    | requestedFields
    | status
    | createdAt
    | respondedAt
    |
    | status:
    |
    | pending
    | accepted
    | rejected
    | cancelled
    |
    |--------------------------------------------------------------------------
    |
    | 对方同意后：
    |
    | PATCH /api/contact-share-requests/:id
    |
    | {
    |   status: "accepted"
    | }
    |
    |--------------------------------------------------------------------------
    |
    | 只有 accepted 后：
    |
    | GET /api/contact-share-requests/:id/contact
    |
    | 才返回双方明确授权公开的联系方式。
    |
    | phone / email / wechat / line
    | 不能提前进入聊天页面响应。
    |
    |--------------------------------------------------------------------------
    */

    setContactRequestSent(true);
    setShowContactRequest(false);
  }

  return (
    <>
      <section
        data-house-id={houseId}
        data-publisher-id={publisherId}
        className="
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        {/* Header */}

        <div
          className="
            border-b
            border-slate-100
            bg-slate-950
            px-5
            py-5
          "
        >
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-cyan-300
            "
          >
            CONTACT
          </p>

          <h2
            className="
              mt-1
              text-lg
              font-black
              text-white
            "
          >
            联系房源负责人
          </h2>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-slate-400
            "
          >
            先通过 Sakura
            站内沟通，再决定是否交换联系方式
          </p>
        </div>

        <div className="p-5">
          {/* Person */}

          <div
            className="
              rounded-2xl
              border
              border-slate-100
              bg-slate-50
              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-slate-600
                  shadow-sm
                "
              >
                <UserRound
                  size={18}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  房源负责人
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-sm
                    font-black
                    text-slate-900
                  "
                >
                  {publisherName}
                </p>
              </div>
            </div>

            {publisherCompany && (
              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  border-t
                  border-slate-200/70
                  pt-3
                  text-xs
                  text-slate-500
                "
              >
                <Building2
                  size={14}
                  className="shrink-0"
                />

                <span className="truncate">
                  {publisherCompany}
                </span>
              </div>
            )}
          </div>

          {/* Status */}

          <div
            className="
              mt-4
              rounded-xl
              bg-slate-50
              px-4
              py-3
            "
          >
            <p
              className="
                text-xs
                font-semibold
                text-slate-600
              "
            >
              当前状态：
              <span className="ml-1 font-black text-slate-900">
                {
                  HOUSE_LISTING_STATUS_LABELS[
                    listingStatus
                  ]
                }
              </span>
            </p>
          </div>

          {/* Main action */}

          <button
            type="button"
            onClick={openChat}
            disabled={
              !canStartConversation
            }
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-3.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:bg-slate-300
            "
          >
            <MessageCircle
              size={17}
            />

            {canStartConversation
              ? "咨询这套房"
              : "当前暂停新的咨询"}
          </button>

          <div
            className="
              mt-4
              flex
              items-start
              gap-2
              rounded-xl
              bg-slate-50
              px-3
              py-3
            "
          >
            <LockKeyhole
              size={15}
              className="
                mt-0.5
                shrink-0
                text-slate-400
              "
            />

            <p
              className="
                text-[11px]
                leading-5
                text-slate-400
              "
            >
              电话、微信、LINE
              等联系方式默认受保护。
              建议先站内沟通，双方同意后再交换。
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}

      {chatOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-slate-950/50
            backdrop-blur-sm
            sm:items-center
            sm:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label="房源咨询"
        >
          <div
            className="
              flex
              h-[90dvh]
              w-full
              flex-col
              overflow-hidden
              rounded-t-[28px]
              bg-white
              shadow-2xl
              sm:h-[720px]
              sm:max-h-[90dvh]
              sm:max-w-[460px]
              sm:rounded-[28px]
            "
          >
            {/* Chat Header */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-slate-200
                bg-white
                px-4
                py-4
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-50
                  text-blue-600
                "
              >
                <UserRound
                  size={18}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    truncate
                    text-sm
                    font-black
                    text-slate-900
                  "
                >
                  {publisherName}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-slate-400
                  "
                >
                  {publisherCompany ||
                    "房源咨询"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setChatOpen(false)
                }
                aria-label="关闭聊天"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-900
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Security notice */}

            <div
              className="
                flex
                items-start
                gap-2
                border-b
                border-amber-100
                bg-amber-50
                px-4
                py-3
              "
            >
              <ShieldCheck
                size={15}
                className="
                  mt-0.5
                  shrink-0
                  text-amber-700
                "
              />

              <p
                className="
                  text-[11px]
                  leading-5
                  text-amber-800
                "
              >
                为保护双方隐私，
                联系方式默认不公开。
                请优先通过站内消息沟通。
              </p>
            </div>


            {/* Current house context */}
            <div
              className="
                border-b
                border-slate-200
                bg-white
                px-4
                py-3
              "
            >
              {showHouseSendPrompt ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-3
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.12em]
                          text-blue-500
                        "
                      >
                        当前房源
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          font-black
                          text-slate-900
                        "
                      >
                        {houseTitle}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-500
                        "
                      >
                        {rent}
                        {" · "}
                        {layout}
                        {" · "}
                        {area}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[11px]
                          text-slate-400
                        "
                      >
                        {station}
                        {walkMinutes !== null
                          ? ` · 步行 ${walkMinutes} 分钟`
                          : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={sendCurrentHouse}
                      className="
                        shrink-0
                        rounded-xl
                        bg-blue-600
                        px-3
                        py-2
                        text-xs
                        font-black
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      发送该房源
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/houses/${houseId}`}
                  onClick={() =>
                    setChatOpen(false)
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    transition
                    hover:bg-slate-50
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-xs
                        font-black
                        text-slate-800
                      "
                    >
                      {houseTitle}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        text-slate-400
                      "
                    >
                      {location}
                      {" · "}
                      {rent}
                    </p>
                  </div>

                  <span
                    className="
                      shrink-0
                      text-[10px]
                      font-bold
                      text-blue-600
                    "
                  >
                    查看房源
                  </span>
                </Link>
              )}
            </div>

            {/* Messages */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                bg-slate-100/70
                px-4
                py-5
              "
            >
              <div className="space-y-4">
                {currentHouseMessages.map(
                  (message, index) => {
                    const previousMessage =
                      index > 0
                        ? currentHouseMessages[
                            index - 1
                          ]
                        : null;

                    const timeLabel =
                      getMessageTimeLabel(
                        message,
                        previousMessage
                      );

                    const timeMarker =
                      timeLabel ? (
                        <div
                          className="
                            my-3
                            text-center
                            text-[11px]
                            font-medium
                            text-slate-400
                          "
                        >
                          {timeLabel}
                        </div>
                      ) : null;
                      
                    if (
                      message.type ===
                      "system"
                    ) {
                      return (
                      <Fragment key={message.id}>
                        {timeMarker}

                        <div
                          className="
                            mx-auto
                            max-w-[90%]
                            rounded-xl
                            bg-slate-200/70
                            px-3
                            py-2
                            text-center
                            text-[11px]
                            leading-5
                            text-slate-500
                          "
                        >
                          {message.content}
                        </div>
                        </Fragment>
                      );
                    }

                    if (
                      message.type ===
                        "entity_reference" &&
                      message.entityReference
                        ?.type === "house" &&
                      message.entityReference
                        .entityId === houseId
                    ) {
                      const mine =
                        message.senderId ===
                          MOCK_CURRENT_USER_ID;

                      return (
                        <Fragment key={message.id}>
                          {timeMarker}

                          <div
                            className={`
                            flex
                            ${
                              mine
                                ? "justify-end"
                                : "justify-start"
                            }
                          `}
                        >
                          <Link
                            href={`/houses/${
                              message.entityReference.entityId
                            }`}
                            onClick={() =>
                              setChatOpen(false)
                            }
                            className="
                              block
                              w-full
                              max-w-[82%]
                              overflow-hidden
                              rounded-2xl
                              border
                              border-slate-200
                              bg-white
                              shadow-sm
                              transition
                              hover:border-blue-300
                              hover:shadow-md
                            "
                          >
                            <div
                              className="
                                border-b
                                border-slate-100
                                px-4
                                py-2.5
                                text-[10px]
                                font-black
                                text-blue-600
                              "
                            >
                              房源
                            </div>

                            <div className="p-4">
                              <p
                                className="
                                  font-black
                                  text-slate-900
                                "
                              >
                                {houseTitle}
                              </p>

                              <p
                                className="
                                  mt-2
                                  text-sm
                                  font-black
                                  text-blue-600
                                "
                              >
                                {rent}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {layout}
                                {" · "}
                                {area}
                                {" · "}
                                {station}
                              </p>
                            </div>
                          </Link>
                        </div>
                        </Fragment>
                      );
                    }

                    const mine =
                      message.senderId ===
                      MOCK_CURRENT_USER_ID;

                    return (
                    <Fragment key={message.id}>
                      {timeMarker}

                      <div
                        className={`
                          flex
                          ${
                            mine
                              ? "justify-end"
                              : "justify-start"
                          }
                        `}
                      >
                        <div
                          className={`
                            max-w-[82%]
                            rounded-2xl
                            px-4
                            py-3
                            text-sm
                            leading-6
                            ${
                              mine
                                ? "rounded-tr-md bg-blue-600 text-white"
                                : "rounded-tl-md bg-white text-slate-800 shadow-sm"
                            }
                          `}
                        >
                          {message.content}
                        </div>
                      </div>
                      </Fragment>
                    );
                  }
                )}
              </div>
            </div>

            {/* Quick questions */}
            <div
              className="
                border-t
                border-slate-200
                bg-white
                px-4
                py-3
              "
            >
              <p
                className="
                  mb-2
                  text-[11px]
                  font-bold
                  text-slate-400
                "
              >
                快捷咨询
              </p>

              <div
                className="
                  flex
                  gap-2
                  overflow-x-auto
                  pb-1
                "
              >
                {quickQuestions.map(
                  (question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() =>
                        sendQuickQuestion(
                          question
                        )
                      }
                      className="
                        shrink-0
                        rounded-full
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-slate-600
                        transition
                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-blue-700
                      "
                    >
                      {question}
                    </button>
                  )
                )}
              </div>
            </div>

            

            {/* Contact request */}

            {hasSentMessage && (
              <div
                className="
                  border-t
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                "
              >
                {!contactRequestSent &&
                  !showContactRequest && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowContactRequest(
                          true
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        font-bold
                        text-blue-600
                        transition
                        hover:text-blue-700
                      "
                    >
                      <LockKeyhole
                        size={14}
                      />

                      申请交换联系方式
                    </button>
                  )}

                {contactRequestSent && (
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-emerald-700
                    "
                  >
                    联系方式交换申请已发送，
                    等待对方确认。
                  </p>
                )}

                {showContactRequest &&
                  !contactRequestSent && (
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-black
                          text-slate-800
                        "
                      >
                        希望交换哪些联系方式？
                      </p>

                      <div
                        className="
                          mt-3
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >
                        {contactOptions.map(
                          (
                            option
                          ) => {
                            const active =
                              selectedContacts.includes(
                                option.key
                              );

                            return (
                              <button
                                key={
                                  option.key
                                }
                                type="button"
                                onClick={() =>
                                  toggleContact(
                                    option.key
                                  )
                                }
                                className={`
                                  flex
                                  items-center
                                  justify-between
                                  rounded-xl
                                  border
                                  px-3
                                  py-2.5
                                  text-xs
                                  font-bold
                                  ${
                                    active
                                      ? "border-blue-200 bg-blue-50 text-blue-700"
                                      : "border-slate-200 bg-white text-slate-600"
                                  }
                                `}
                              >
                                {
                                  option.label
                                }

                                <span
                                  className={`
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded
                                    border
                                    ${
                                      active
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-slate-300"
                                    }
                                  `}
                                >
                                  {active && (
                                    <Check
                                      size={
                                        12
                                      }
                                    />
                                  )}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>

                      <div
                        className="
                          mt-3
                          flex
                          gap-2
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setShowContactRequest(
                              false
                            )
                          }
                          className="
                            flex-1
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2.5
                            text-xs
                            font-bold
                            text-slate-600
                          "
                        >
                          取消
                        </button>

                        <button
                          type="button"
                          disabled={
                            selectedContacts.length ===
                            0
                          }
                          onClick={
                            sendContactRequest
                          }
                          className="
                            flex-1
                            rounded-xl
                            bg-slate-950
                            px-3
                            py-2.5
                            text-xs
                            font-bold
                            text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          发送申请
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Composer */}

            <form
              onSubmit={sendMessage}
              className="
                border-t
                border-slate-200
                bg-white
                p-3
              "
            >
              <div
                className="
                  flex
                  items-end
                  gap-2
                "
              >
                <textarea
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target
                        .value
                    )
                  }
                  rows={1}
                  maxLength={1000}
                  placeholder="输入消息..."
                  className="
                    min-h-[44px]
                    flex-1
                    resize-none
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-400
                    focus:bg-white
                  "
                />

                <button
                  type="submit"
                  disabled={
                    input.trim()
                      .length === 0
                  }
                  aria-label="发送消息"
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:bg-slate-300
                  "
                >
                  <Send size={17} />
                </button>
              </div>

              <p
                className="
                  mt-2
                  px-1
                  text-[10px]
                  text-slate-400
                "
              >
                {input.length}/1000
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}