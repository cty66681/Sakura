import { create } from "zustand";

export type ChatContextType =
  | "house"
  | "job";

export type ChatEntityType =
  | "house"
  | "job";

export type ChatMessageType =
  | "text"
  | "entity_reference"
  | "system";

export interface ChatConversation {
  id: string;

  /*
   * conversation 属于两个人，
   * 不属于某一套房源。
   */
  participantAId: string;
  participantBId: string;

  createdAt: string;
  lastMessageAt: string;
}

export interface ChatEntityReference {
  type: ChatEntityType;
  entityId: number;
}

export interface ChatMessage {
  id: string;

  conversationId: string;

  /*
   * 真正发送消息的人。
   * 不再使用：
   *
   * "publisher"
   * "user"
   * "me"
   *
   * 正式后端由 Session 决定 senderId。
   */
  senderId: string;

  type: ChatMessageType;

  content?: string;

  /*
   * 真正发送出去的房源 / 工作 Card。
   */
  entityReference?: ChatEntityReference;

  /*
   * 这条消息是从哪个商品页面的小客服窗发出的。
   *
   * 用途：
   *
   * 房源详情小客服
   * → 只看当前 houseId 的消息
   *
   * 消息中心
   * → 看整个 conversation 的全部消息
   *
   * 中央消息中心直接发送的普通文字
   * 可以是 null。
   */
  contextType: ChatContextType | null;
  contextId: number | null;

  createdAt: string;
}

interface SendTextInput {
  senderId: string;
  recipientId: string;

  content: string;

  contextType:
    | ChatContextType
    | null;

  contextId:
    | number
    | null;
}

interface SendEntityReferenceInput {
  senderId: string;
  recipientId: string;

  entityType: ChatEntityType;
  entityId: number;

  contextType:
    | ChatContextType
    | null;

  contextId:
    | number
    | null;
}

interface SendContextTextInput
  extends SendTextInput {
  entityType: ChatEntityType;
  entityId: number;
}

interface ChatStore {
  conversations: ChatConversation[];

  messages: ChatMessage[];

  sendTextMessage: (
    input: SendTextInput
  ) => void;

  sendContextTextMessage: (
    input: SendContextTextInput
  ) => void;

  sendEntityReference: (
    input: SendEntityReferenceInput
  ) => void;
}

/*
|--------------------------------------------------------------------------
| MOCK CURRENT USER
|--------------------------------------------------------------------------
|
| 现在房源详情页先模拟：
|
| 当前登录用户
|        ↕
| 房源发布者
|
| 正式登录系统完成后删除这个常量，
| 改为 Session / Auth 中的真实 userId。
|
|--------------------------------------------------------------------------
*/

export const MOCK_CURRENT_USER_ID =
  "user_current";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function createId(
  prefix: string
) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function findConversation(
  conversations: ChatConversation[],
  userAId: string,
  userBId: string
) {
  return conversations.find(
    (conversation) =>
      (
        conversation.participantAId ===
          userAId &&
        conversation.participantBId ===
          userBId
      ) ||
      (
        conversation.participantAId ===
          userBId &&
        conversation.participantBId ===
          userAId
      )
  );
}

function createConversation(
  userAId: string,
  userBId: string,
  createdAt: string
): ChatConversation {
  return {
    id: createId("conversation"),

    participantAId: userAId,
    participantBId: userBId,

    createdAt,
    lastMessageAt: createdAt,
  };
}

/*
|--------------------------------------------------------------------------
| Public helpers
|--------------------------------------------------------------------------
|
| 后面 HouseContact 和消息中心都会使用。
|
|--------------------------------------------------------------------------
*/

export function getConversationBetween(
  conversations: ChatConversation[],
  userAId: string,
  userBId: string
) {
  return (
    findConversation(
      conversations,
      userAId,
      userBId
    ) ?? null
  );
}

export function getConversationMessages(
  messages: ChatMessage[],
  conversationId: string
) {
  return messages
    .filter(
      (message) =>
        message.conversationId ===
        conversationId
    )
    .sort(
      (a, b) =>
        new Date(
          a.createdAt
        ).getTime() -
        new Date(
          b.createdAt
        ).getTime()
    );
}

export function getHouseContextMessages(
  messages: ChatMessage[],
  conversationId: string,
  houseId: number
) {
  return getConversationMessages(
    messages,
    conversationId
  ).filter(
    (message) =>
      message.contextType ===
        "house" &&
      message.contextId ===
        houseId
  );
}

export function hasHouseReference(
  messages: ChatMessage[],
  conversationId: string,
  houseId: number
) {
  return messages.some(
    (message) =>
      message.conversationId ===
        conversationId &&
      message.type ===
        "entity_reference" &&
      message.entityReference
        ?.type === "house" &&
      message.entityReference
        .entityId === houseId
  );
}

/*
|--------------------------------------------------------------------------
| Store
|--------------------------------------------------------------------------
*/

export const useChatStore =
  create<ChatStore>(
    (set) => ({
      conversations: [],

      messages: [],

      sendTextMessage: (
        input
      ) => {
        const content =
          input.content.trim();

        if (!content) {
          return;
        }

        set((state) => {
          const createdAt =
            new Date().toISOString();

          let conversation =
            findConversation(
              state.conversations,
              input.senderId,
              input.recipientId
            );

          let nextConversations =
            state.conversations;

          /*
           * 真正发送第一条消息时
           * 才创建 conversation。
           */
          if (!conversation) {
            conversation =
              createConversation(
                input.senderId,
                input.recipientId,
                createdAt
              );

            nextConversations = [
              ...state.conversations,
              conversation,
            ];
          }

          const message: ChatMessage =
            {
              id: createId(
                "message"
              ),

              conversationId:
                conversation.id,

              senderId:
                input.senderId,

              type: "text",

              content,

              contextType:
                input.contextType,

              contextId:
                input.contextId,

              createdAt,
            };

          nextConversations =
            nextConversations.map(
              (item) =>
                item.id ===
                conversation.id
                  ? {
                      ...item,
                      lastMessageAt:
                        createdAt,
                    }
                  : item
            );

          return {
            conversations:
              nextConversations,

            messages: [
              ...state.messages,
              message,
            ],
          };
        });
      },

      sendContextTextMessage: (
        input
      ) => {
        const content =
          input.content.trim();

        if (!content) {
          return;
        }

        set((state) => {
          const cardCreatedAt =
            new Date().toISOString();

          let conversation =
            findConversation(
              state.conversations,
              input.senderId,
              input.recipientId
            );

          let nextConversations =
            state.conversations;

          /*
          * 真正开始咨询时才创建 conversation。
          *
          * 单纯打开客服窗口，
          * 不会走这个方法，
          * 因此不会创建聊天。
          */
          if (!conversation) {
            conversation =
              createConversation(
                input.senderId,
                input.recipientId,
                cardCreatedAt
              );

            nextConversations = [
              ...state.conversations,
              conversation,
            ];
          }

          /*
          * 同一 A ↔ B conversation 中，
          * 同一个房源 / 工作 Card
          * 只需要存在一次。
          */
          const cardAlreadySent =
            state.messages.some(
              (message) =>
                message.conversationId ===
                  conversation.id &&
                message.type ===
                  "entity_reference" &&
                message.entityReference
                  ?.type ===
                  input.entityType &&
                message.entityReference
                  .entityId ===
                  input.entityId
            );

          const nextMessages = [
            ...state.messages,
          ];

          let textCreatedAt =
            cardCreatedAt;

          /*
          * Card 不存在：
          *
          * 先插入 Card，
          * 再插入真正咨询的文字。
          */
          if (!cardAlreadySent) {
            const cardMessage: ChatMessage = {
              id: createId("message"),

              conversationId:
                conversation.id,

              senderId:
                input.senderId,

              type:
                "entity_reference",

              entityReference: {
                type:
                  input.entityType,

                entityId:
                  input.entityId,
              },

              contextType:
                input.contextType,

              contextId:
                input.contextId,

              createdAt:
                cardCreatedAt,
            };

            nextMessages.push(
              cardMessage
            );

            /*
            * 比 Card 晚 1ms，
            * 保证聊天中心排序时：
            *
            * Card
            * ↓
            * 咨询文字
            */
            textCreatedAt =
              new Date(
                new Date(
                  cardCreatedAt
                ).getTime() + 1
              ).toISOString();
          }

          const textMessage: ChatMessage = {
            id: createId("message"),

            conversationId:
              conversation.id,

            senderId:
              input.senderId,

            type: "text",

            content,

            contextType:
              input.contextType,

            contextId:
              input.contextId,

            createdAt:
              textCreatedAt,
          };

          nextMessages.push(
            textMessage
          );

          nextConversations =
            nextConversations.map(
              (item) =>
                item.id ===
                conversation.id
                  ? {
                      ...item,

                      lastMessageAt:
                        textCreatedAt,
                    }
                  : item
            );

          return {
            conversations:
              nextConversations,

            messages:
              nextMessages,
          };
        });
      },

      sendEntityReference: (
        input
      ) => {
        set((state) => {
          const existingConversation =
            findConversation(
              state.conversations,
              input.senderId,
              input.recipientId
            );

          /*
           * 同一对话中，
           * 同一个房源 / 工作 Card
           * 已经发送过，就不重复发送。
           */
          if (
            existingConversation
          ) {
            const alreadySent =
              state.messages.some(
                (message) =>
                  message.conversationId ===
                    existingConversation.id &&
                  message.type ===
                    "entity_reference" &&
                  message.entityReference
                    ?.type ===
                    input.entityType &&
                  message.entityReference
                    .entityId ===
                    input.entityId
              );

            if (alreadySent) {
              return state;
            }
          }

          const createdAt =
            new Date().toISOString();

          let conversation =
            existingConversation;

          let nextConversations =
            state.conversations;

          if (!conversation) {
            conversation =
              createConversation(
                input.senderId,
                input.recipientId,
                createdAt
              );

            nextConversations = [
              ...state.conversations,
              conversation,
            ];
          }

          const message: ChatMessage =
            {
              id: createId(
                "message"
              ),

              conversationId:
                conversation.id,

              senderId:
                input.senderId,

              type:
                "entity_reference",

              entityReference: {
                type:
                  input.entityType,

                entityId:
                  input.entityId,
              },

              contextType:
                input.contextType,

              contextId:
                input.contextId,

              createdAt,
            };

          nextConversations =
            nextConversations.map(
              (item) =>
                item.id ===
                conversation.id
                  ? {
                      ...item,
                      lastMessageAt:
                        createdAt,
                    }
                  : item
            );

          return {
            conversations:
              nextConversations,

            messages: [
              ...state.messages,
              message,
            ],
          };
        });
      },
    })
  );