"use client";

import {
  Fragment,
  type FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Building2,
  CheckCheck,
  MessageCircle,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";

import {
  HOUSE_LISTING_STATUS_LABELS,
  houses,
} from "@/data/houses";

import {
  getPublisherById,
} from "@/data/publishers";

import {
  MOCK_CURRENT_USER_ID,
  getConversationMessages,
  useChatStore,
  type ChatConversation,
  type ChatMessage,
} from "@/store/chatStore";



function HouseInfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
      "
    >
      <span
        className="
          shrink-0
          text-xs
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className="
          text-right
          text-xs
          font-bold
          text-slate-700
        "
      >
        {value}
      </span>
    </div>
  );
}

function QualificationChip({
  label,
  value,
}: {
  label: string;
  value: boolean | null;
}) {
  const text =
    value === true
      ? `${label}可申请`
      : value === false
        ? `${label}不可申请`
        : `${label}未确认`;

  return (
    <span
      className={`
        rounded-full
        px-2.5
        py-1.5
        text-[11px]
        font-bold
        ${
          value === true
            ? "bg-emerald-50 text-emerald-700"
            : value === false
              ? "bg-rose-50 text-rose-700"
              : "bg-slate-100 text-slate-500"
        }
      `}
    >
      {text}
    </span>
  );
}

function getConversationPartnerId(
  conversation: ChatConversation,
  currentUserId: string
) {
  if (
    conversation.participantAId ===
    currentUserId
  ) {
    return conversation.participantBId;
  }

  return conversation.participantAId;
}

function getConversationPartnerName(
  partnerId: string
) {
  const publisher =
    getPublisherById(
      partnerId
    );

  if (publisher) {
    return publisher.name;
  }

  return "Sakura 用户";
}

function getMessagePreview(
  message: ChatMessage | null
) {
  if (!message) {
    return "暂无聊天记录";
  }

  if (message.type === "text") {
    return (
      message.content ||
      "新消息"
    );
  }

  if (
    message.type ===
      "entity_reference" &&
    message.entityReference
  ) {
    if (
      message.entityReference.type ===
      "house"
    ) {
      const house =
        houses.find(
          (item) =>
            item.id ===
            message.entityReference
              ?.entityId
        );

      return house
        ? `[房源] ${house.title}`
        : "[房源]";
    }

    if (
      message.entityReference.type ===
      "job"
    ) {
      return "[工作]";
    }
  }

  return "系统消息";
}

function formatConversationTime(
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
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(date);
}

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
  message: ChatMessage,
  previousMessage: ChatMessage | null
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

  const tenMinutes =
    10 * 60 * 1000;

  if (
    gapMilliseconds >= tenMinutes
  ) {
    return formatMessageTime(
      message.createdAt
    );
  }

  return null;
}

export default function AccountMessagesPage() {

    const router = useRouter();
    const searchParams =
    useSearchParams();

    const conversationParam =
    searchParams.get(
      "conversation"
    );

  const conversations =
    useChatStore(
      (state) =>
        state.conversations
    );

  const messages =
    useChatStore(
      (state) =>
        state.messages
    );

  const sendTextMessage =
    useChatStore(
      (state) =>
        state.sendTextMessage
    );

    const myConversations =
      conversations
        .filter(
          (conversation) =>
            conversation
              .participantAId ===
              MOCK_CURRENT_USER_ID ||
            conversation
              .participantBId ===
              MOCK_CURRENT_USER_ID
        )
        .sort(
          (a, b) =>
            new Date(
              b.lastMessageAt
            ).getTime() -
            new Date(
              a.lastMessageAt
            ).getTime()
        );

    const selectedConversationId =
      conversationParam &&
      myConversations.some(
        (conversation) =>
          conversation.id ===
          conversationParam
      )
        ? conversationParam
        : myConversations[0]?.id ??
          "";

  const [input, setInput] =
    useState("");

  const [
    housePanelOpen,
    setHousePanelOpen,
    ] = useState(false);

  const [
    selectedHouseId,
    setSelectedHouseId,
  ] = useState<number | null>(
    null
  );

  const selectedConversation =
    myConversations.find(
      (conversation) =>
        conversation.id ===
        selectedConversationId
    ) ?? null;

  const selectedPartnerId =
      selectedConversation
        ? getConversationPartnerId(
            selectedConversation,
            MOCK_CURRENT_USER_ID
          )
        : null;

  const selectedPartnerName =
      selectedPartnerId
        ? getConversationPartnerName(
            selectedPartnerId
          )
        : "";

  const selectedHouse =
    selectedHouseId !== null
      ? houses.find(
          (house) =>
            house.id ===
            selectedHouseId
        ) ?? null
      : null;

        /*
        * TODO [API - GET]
        *
        * GET /api/houses/:houseId/summary
        *
        * 消息中心只需要房源摘要：
        *
        * id
        * title
        * rent
        * managementFee
        * layout
        * area
        * location
        * station
        * walkMinutes
        * listingStatus
        * foreignerAllowed
        * studentAllowed
        *
        * 绝对不能在这个接口返回：
        *
        * phone
        * email
        * wechat
        * line
        *
        * 联系方式仍然只能通过双方授权流程获取。
        */

  const selectedMessages =
    selectedConversation
      ? getConversationMessages(
          messages,
          selectedConversation.id
        )
      : [];

  function selectConversation(
    conversationId: string
    ) {
    const params =
        new URLSearchParams(
        searchParams.toString()
        );

    params.set(
        "conversation",
        conversationId
    );

    router.push(
      `/messages?${params.toString()}`,
      {
        scroll: false,
      }
    );

    /*
     * TODO [API - PATCH]
     *
     * PATCH
     * /api/conversations/:id/read
     *
     * 后端必须验证：
     *
     * conversation.publisherId
     * === session.user.id
     *
     * 不能允许其他用户
     * 把不属于自己的会话设为已读。
     */
  }

  function handleSend(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !selectedConversation ||
      !selectedPartnerId
    ) {
      return;
    }

    const content =
      input.trim();

    if (!content) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST]
    |--------------------------------------------------------------------------
    |
    | POST /api/conversations/:conversationId/messages
    |
    | Body:
    |
    | {
    |   type: "text",
    |   content: string
    | }
    |
    | 消息中心直接发送的文字：
    |
    | contextType = null
    | contextId   = null
    |
    | 因为用户可能只是在延续正常聊天，
    | 不应该由系统猜测他正在谈哪一套房。
    |
    |--------------------------------------------------------------------------
    */

    sendTextMessage({
      senderId:
        MOCK_CURRENT_USER_ID,

      recipientId:
        selectedPartnerId,

      content,

      contextType: null,
      contextId: null,
    });

    setInput("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP */}

      {/* CONTENT */}

      <section className="py-8 sm:py-10">
        <Container>
          <div className="px-4">
            {/* Header */}

            <div>
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-blue-600
                "
              >
                MESSAGES
              </p>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950
                "
              >
                消息中心
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                查看你的站内会话，与发布者或咨询用户持续沟通。
              </p>
            </div>

            {/* Main */}

            <div
              className={`
                mt-7
                grid
                min-h-[680px]
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
                ${
                    housePanelOpen
                    ? "lg:grid-cols-[300px_minmax(0,1fr)_320px]"
                    : "lg:grid-cols-[340px_minmax(0,1fr)]"
                }
                `}
            >
              {/* Conversations */}

              <aside
                className="
                  border-b
                  border-slate-200
                  lg:border-b-0
                  lg:border-r
                "
              >
                <div
                  className="
                    border-b
                    border-slate-100
                    px-5
                    py-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <MessageCircle
                      size={17}
                      className="text-blue-600"
                    />

                    <h2
                      className="
                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      全部会话
                    </h2>
                  </div>
                </div>

                <div>
                  {myConversations.map(
                    (conversation) => {
                      const partnerId =
                        getConversationPartnerId(
                          conversation,
                          MOCK_CURRENT_USER_ID
                        );

                      const partnerName =
                        getConversationPartnerName(
                          partnerId
                        );

                      const conversationMessages =
                        getConversationMessages(
                          messages,
                          conversation.id
                        );

                      const lastMessage =
                        conversationMessages[
                          conversationMessages.length - 1
                        ] ?? null;

                      const active =
                        conversation.id ===
                        selectedConversationId;

                      return (
                        <button
                          key={
                            conversation.id
                          }
                          type="button"
                          onClick={() =>
                            selectConversation(
                              conversation.id
                            )
                          }
                          className={`
                            flex
                            w-full
                            gap-3
                            border-b
                            border-slate-100
                            px-4
                            py-4
                            text-left
                            transition
                            ${
                              active
                                ? "bg-blue-50"
                                : "hover:bg-slate-50"
                            }
                          `}
                        >
                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-slate-100
                              text-slate-600
                            "
                          >
                            <UserRound
                              size={18}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-3
                              "
                            >
                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-black
                                  text-slate-900
                                "
                              >
                                {
                                  partnerName
                                }
                              </p>

                              <span
                                className="
                                  shrink-0
                                  text-[10px]
                                  text-slate-400
                                "
                              >
                                {formatConversationTime(
                                  conversation.lastMessageAt
                                )}
                              </span>
                            </div>

                            

                            <div
                              className="
                                mt-2
                                flex
                                items-center
                                gap-2
                              "
                            >
                              <p
                                className="
                                  min-w-0
                                  flex-1
                                  truncate
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {getMessagePreview(
                                  lastMessage
                                )}
                              </p>

                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </aside>

              {/* Chat */}

              {selectedConversation ? (
                <section
                  className="
                    flex
                    min-h-[600px]
                    min-w-0
                    flex-col
                  "
                >
                  {/* Chat Header */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-b
                      border-slate-200
                      px-5
                      py-4
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          font-black
                          text-slate-900
                        "
                      >
                        {
                          selectedPartnerName
                        }
                      </p>

                      
                    </div>
                  </div>

                  {/* Safety */}

                  <div
                    className="
                      flex
                      items-start
                      gap-2
                      border-b
                      border-amber-100
                      bg-amber-50
                      px-5
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
                      联系方式默认受保护。
                      如需交换微信、LINE、电话等信息，
                      后续通过双方授权功能处理。
                    </p>
                  </div>

                  {/* Messages */}

                  <div
                    className="
                      min-h-0
                      flex-1
                      space-y-4
                      overflow-y-auto
                      bg-slate-100/70
                      px-5
                      py-6
                    "
                  >
                    {selectedMessages.map(
                      (message, index) => {
                        const previousMessage =
                          index > 0
                            ? selectedMessages[
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
                                max-w-lg
                                rounded-xl
                                bg-slate-200
                                px-4
                                py-2.5
                                text-center
                                text-[11px]
                                leading-5
                                text-slate-500
                              "
                            >
                              {
                                message.content
                              }
                            </div>
                          </Fragment>
                          );
                        }

                        if (
                          message.type ===
                            "entity_reference" &&
                          message.entityReference
                        ) {
                          const reference =
                            message.entityReference;

                          const mine =
                            message.senderId ===
                            MOCK_CURRENT_USER_ID;

                          if (
                            reference.type ===
                            "house"
                          ) {
                            const house =
                              houses.find(
                                (item) =>
                                  item.id ===
                                  reference.entityId
                              ) ?? null;

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
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!house) {
                                        return;
                                      }

                                      setSelectedHouseId(
                                        house.id
                                      );

                                      setHousePanelOpen(
                                        true
                                      );
                                    }}
                                    disabled={!house}
                                    className="
                                      w-full
                                      max-w-sm
                                      overflow-hidden
                                      rounded-2xl
                                      border
                                      border-slate-200
                                      bg-white
                                      text-left
                                      shadow-sm
                                      transition
                                      hover:border-blue-300
                                      hover:shadow-md
                                      disabled:cursor-not-allowed
                                      disabled:opacity-60
                                    "
                                  >
                                    <div
                                      className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        border-b
                                        border-slate-100
                                        px-4
                                        py-3
                                      "
                                    >
                                      <div
                                        className="
                                          flex
                                          items-center
                                          gap-2
                                          text-xs
                                          font-black
                                          text-blue-600
                                        "
                                      >
                                        <Building2
                                          size={14}
                                        />

                                        房源
                                      </div>

                                      <span
                                        className="
                                          text-[10px]
                                          font-bold
                                          text-slate-400
                                        "
                                      >
                                        {house
                                          ? "点击查看"
                                          : "房源已不可用"}
                                      </span>
                                    </div>

                                    <div className="p-4">
                                      <h3
                                        className="
                                          font-black
                                          text-slate-950
                                        "
                                      >
                                        {house
                                          ? house.title
                                          : "该房源已不可用"}
                                      </h3>

                                      {house && (
                                        <>
                                          <p
                                            className="
                                              mt-2
                                              line-clamp-2
                                              text-xs
                                              leading-5
                                              text-slate-500
                                            "
                                          >
                                            {house.description}
                                          </p>

                                          <div
                                            className="
                                              mt-4
                                              flex
                                              items-end
                                              justify-between
                                              gap-3
                                            "
                                          >
                                            <span
                                              className="
                                                text-base
                                                font-black
                                                text-blue-600
                                              "
                                            >
                                              {house.rent}
                                            </span>

                                            <span
                                              className="
                                                text-xs
                                                font-bold
                                                text-slate-500
                                              "
                                            >
                                              {house.layout}
                                              {" · "}
                                              {house.area}
                                            </span>
                                          </div>

                                          <div
                                            className="
                                              mt-3
                                              flex
                                              items-center
                                              justify-between
                                              gap-3
                                            "
                                          >
                                            <span
                                              className="
                                                truncate
                                                text-xs
                                                text-slate-400
                                              "
                                            >
                                              {house.station}

                                              {house.walkMinutes !==
                                              null
                                                ? ` · 步行 ${house.walkMinutes} 分钟`
                                                : ""}
                                            </span>

                                            <span
                                              className="
                                                shrink-0
                                                rounded-full
                                                bg-slate-100
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-bold
                                                text-slate-600
                                              "
                                            >
                                              {
                                                HOUSE_LISTING_STATUS_LABELS[
                                                  house
                                                    .listingStatus
                                                ]
                                              }
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </button>
                                </div>
                              </Fragment>
                            );
                          }
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
                              className="
                                max-w-[80%]
                              "
                            >
                              <div
                                className={`
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
                                {
                                  message.content
                                }
                              </div>

                              {mine && (
                                <div
                                  className="
                                    mt-1
                                    flex
                                    justify-end
                                    text-slate-400
                                  "
                                >
                                  <CheckCheck
                                    size={12}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          </Fragment>
                        );
                      }
                    )}
                  </div>

                  {/* Composer */}

                  <form
                    onSubmit={
                      handleSend
                    }
                    className="
                      border-t
                      border-slate-200
                      bg-white
                      p-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-end
                        gap-3
                      "
                    >
                      <textarea
                        value={input}
                        onChange={(
                          event
                        ) =>
                          setInput(
                            event
                              .target
                              .value
                          )
                        }
                        maxLength={
                          1000
                        }
                        rows={2}
                        placeholder="输入回复..."
                        className="
                          min-h-[48px]
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
                          !input.trim()
                        }
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
                        aria-label="发送消息"
                      >
                        <Send
                          size={17}
                        />
                      </button>
                    </div>
                  </form>
                </section>
              ) : (
                <div
                  className="
                    flex
                    min-h-[600px]
                    items-center
                    justify-center
                    p-8
                    text-center
                  "
                >
                  <div>
                    <MessageCircle
                      size={30}
                      className="
                        mx-auto
                        text-slate-300
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
                      选择一个咨询会话
                    </p>
                  </div>
                </div>
              )}

              {housePanelOpen &&
                selectedConversation && (
                    <aside
                    className="
                        fixed
                        inset-y-0
                        right-0
                        z-[110]
                        w-[90%]
                        max-w-sm
                        overflow-y-auto
                        border-l
                        border-slate-200
                        bg-white
                        shadow-2xl

                        lg:static
                        lg:z-auto
                        lg:w-auto
                        lg:max-w-none
                        lg:shadow-none
                    "
                    >
                    {/* Header */}

                    <div
                        className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-b
                        border-slate-200
                        px-5
                        py-4
                        "
                    >
                        <div>
                        <p
                            className="
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.14em]
                            text-blue-600
                            "
                        >
                            HOUSE
                        </p>

                        <h2
                            className="
                            mt-1
                            font-black
                            text-slate-950
                            "
                        >
                            房源信息
                        </h2>
                        </div>

                        <button
                        type="button"
                        onClick={() =>
                            setHousePanelOpen(false)
                        }
                        aria-label="关闭房源信息"
                        className="
                            flex
                            h-9
                            w-9
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

                    {selectedHouse ? (
                        <div className="p-5">
                        {/* Status */}

                        <div
                            className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            "
                        >
                            <span
                            className="
                                text-xs
                                font-bold
                                text-slate-400
                            "
                            >
                            当前房源状态
                            </span>

                            <span
                            className={`
                                rounded-full
                                px-2.5
                                py-1
                                text-[11px]
                                font-black
                                ${
                                selectedHouse.listingStatus ===
                                "available"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : selectedHouse.listingStatus ===
                                        "paused"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                                }
                            `}
                            >
                            {
                                HOUSE_LISTING_STATUS_LABELS[
                                selectedHouse
                                    .listingStatus
                                ]
                            }
                            </span>
                        </div>

                        {/* Title */}

                        <h3
                            className="
                            mt-5
                            text-xl
                            font-black
                            leading-8
                            text-slate-950
                            "
                        >
                            {selectedHouse.title}
                        </h3>

                        <p
                            className="
                            mt-2
                            text-2xl
                            font-black
                            text-blue-600
                            "
                        >
                            {selectedHouse.rent}
                            <span
                            className="
                                ml-1
                                text-xs
                                font-semibold
                                text-slate-400
                            "
                            >
                            / 月
                            </span>
                        </p>

                        {/* Basic */}

                        <div
                            className="
                            mt-5
                            space-y-3
                            rounded-2xl
                            bg-slate-50
                            p-4
                            "
                        >
                            <HouseInfoRow
                            label="地点"
                            value={
                                selectedHouse.location
                            }
                            />

                            <HouseInfoRow
                            label="车站"
                            value={
                                selectedHouse.walkMinutes !==
                                null
                                ? `${selectedHouse.station} 步行 ${selectedHouse.walkMinutes} 分钟`
                                : selectedHouse.station
                            }
                            />

                            <HouseInfoRow
                            label="户型"
                            value={
                                selectedHouse.layout
                            }
                            />

                            <HouseInfoRow
                            label="面积"
                            value={
                                selectedHouse.area
                            }
                            />

                            <HouseInfoRow
                            label="管理费"
                            value={
                                selectedHouse.managementFee
                            }
                            />
                        </div>

                        {/* Qualifications */}

                        <div className="mt-5">
                            <p
                            className="
                                text-xs
                                font-black
                                text-slate-500
                            "
                            >
                            入住条件
                            </p>

                            <div
                            className="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                            "
                            >
                            <QualificationChip
                                label="外国人"
                                value={
                                selectedHouse.foreignerAllowed
                                }
                            />

                            <QualificationChip
                                label="学生"
                                value={
                                selectedHouse.studentAllowed
                                }
                            />
                            </div>
                        </div>

                        {/* Conversation relation */}

                        <div
                            className="
                            mt-5
                            rounded-2xl
                            border
                            border-blue-100
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
                            <MessageCircle
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
                                text-blue-700
                                "
                            >
                                这套房源来自当前聊天中的房源卡片。
                                聊天本身属于双方长期会话，
                                不会与某一套房源绑定。
                            </p>
                            </div>
                        </div>

                        {/* Full detail */}

                        <Link
                            href={`/houses/${selectedHouse.id}`}
                            className="
                            mt-5
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-950
                            px-4
                            py-3
                            text-sm
                            font-black
                            text-white
                            transition
                            hover:bg-slate-800
                            "
                        >
                            查看完整房源详情
                        </Link>

                        <p
                            className="
                            mt-3
                            text-center
                            text-[10px]
                            leading-5
                            text-slate-400
                            "
                        >
                            完整详情将打开房源页面，
                            当前聊天记录不会丢失。
                        </p>
                        </div>
                    ) : (
                        <div
                        className="
                            p-8
                            text-center
                            text-sm
                            text-slate-500
                        "
                        >
                        暂时无法读取房源信息。
                        </div>
                    )}
                    </aside>
                )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}