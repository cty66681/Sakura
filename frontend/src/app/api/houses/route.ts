import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/*
|--------------------------------------------------------------------------
| Development user
|--------------------------------------------------------------------------
|
| Sakura 目前还没有正式接入登录 / Session。
|
| 开发阶段：
| - 后端内部固定使用一个开发用户
| - 前端绝对不能传 userId / publisherId
|
| 以后接入 Auth 后，只替换 getCurrentPublisher()。
|
*/

const DEV_USER_EMAIL = "dev@sakura.local";
const DEV_USER_NAME = "Sakura Dev User";

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const houseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "请输入房源标题")
    .max(80, "房源标题不能超过 80 个字符"),

  rent: z
    .number()
    .int()
    .positive("租金必须大于 0")
    .max(10_000_000, "租金数值异常"),

  managementFee: z
    .number()
    .int()
    .min(0, "管理费不能小于 0")
    .max(1_000_000, "管理费数值异常")
    .default(0),

  deposit: z.string(),
  keyMoney: z.string(),

  layout: z.string().trim().min(1, "请选择户型"),

  area: z
    .number()
    .positive("面积必须大于 0")
    .max(10_000, "面积数值异常"),

  prefecture: z.string().trim().min(1, "请选择都道府县"),

  city: z
    .string()
    .trim()
    .min(1, "请输入市区町村"),

  address: z
    .string()
    .trim()
    .min(1, "请输入详细地址"),

  nearestStation: z
    .string()
    .trim()
    .optional()
    .default(""),

  stationWalk: z
    .number()
    .int()
    .min(0)
    .max(120)
    .optional()
    .default(0),

  floor: z
    .string()
    .trim()
    .optional()
    .default(""),

  builtYear: z
    .union([
      z.string(),
      z.number(),
    ])
    .optional(),

  direction: z
    .string()
    .trim()
    .optional()
    .default(""),

  structure: z
    .string()
    .trim()
    .optional()
    .default(""),

  availableDate: z
    .string()
    .trim()
    .optional()
    .default(""),

  description: z
    .string()
    .trim()
    .min(1, "请输入房源说明")
    .max(5000, "房源说明不能超过 5000 个字符"),

  tags: z
    .array(z.string())
    .default([]),

  imageIds: z
    .array(z.string())
    .default([]),

  contactName: z
    .string()
    .trim()
    .min(1, "请输入联系人"),

  company: z
    .string()
    .trim()
    .optional()
    .default(""),

  phone: z
    .string()
    .trim()
    .min(1, "请输入联系电话"),

  email: z
    .string()
    .trim()
    .optional()
    .default(""),

  status: z.enum([
    "draft",
    "pending",
  ]),
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function parseMonthValue(
  value: string
): number {
  const normalized = value
    .trim()
    .replace("个月", "")
    .replace("個月", "")
    .replace("ヶ月", "")
    .replace("か月", "")
    .replace("月", "");

  if (!normalized) {
    return 0;
  }

  const result = Number(normalized);

  if (
    !Number.isFinite(result) ||
    result < 0
  ) {
    return 0;
  }

  return result;
}

function parseBuiltYear(
  value: string | number | undefined
): number | null {
  if (
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const year = Number(value);

  if (
    !Number.isInteger(year) ||
    year < 1800 ||
    year >
      new Date().getFullYear() + 1
  ) {
    return null;
  }

  return year;
}

function parseAvailableDate(
  value: string
): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(
    `${value}T00:00:00+09:00`
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return null;
  }

  return date;
}

/*
|--------------------------------------------------------------------------
| Current publisher
|--------------------------------------------------------------------------
|
| TODO [AUTH]
|
| 正式登录系统完成后：
|
| 1. 从 Session 获取当前 userId
| 2. 根据 userId 查询 Publisher
| 3. 不允许前端提交 userId / publisherId
|
*/

async function getCurrentPublisher(
  contactName: string,
  company: string
) {
  const user =
    await prisma.user.upsert({
      where: {
        email: DEV_USER_EMAIL,
      },

      update: {
        displayName:
          contactName ||
          DEV_USER_NAME,
      },

      create: {
        email: DEV_USER_EMAIL,
        displayName:
          contactName ||
          DEV_USER_NAME,
      },
    });

  const publisher =
    await prisma.publisher.upsert({
      where: {
        userId: user.id,
      },

      update: {
        name:
          contactName ||
          DEV_USER_NAME,

        company:
          company || null,
      },

      create: {
        userId: user.id,

        name:
          contactName ||
          DEV_USER_NAME,

        company:
          company || null,
      },
    });

  return {
    user,
    publisher,
  };
}

/*
|--------------------------------------------------------------------------
| POST /api/houses
|--------------------------------------------------------------------------
*/

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const parsed =
      houseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,

          error:
            "房源数据验证失败",

          issues:
            parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const data = parsed.data;

    const {
      user,
      publisher,
    } =
      await getCurrentPublisher(
        data.contactName,
        data.company
      );

    /*
    |--------------------------------------------------------------------------
    | Image ownership validation
    |--------------------------------------------------------------------------
    |
    | 当前图片上传 API 还没有接入，
    | 所以正常情况下 imageIds 暂时为空。
    |
    | 以后 POST /api/uploads/houses 完成后：
    |
    | 前端先上传图片
    | ↓
    | 得到 imageIds
    | ↓
    | POST /api/houses
    |
    */

    if (data.imageIds.length > 0) {
      const ownedImages =
        await prisma.houseImage.findMany({
          where: {
            id: {
              in: data.imageIds,
            },

            uploaderId: user.id,

            houseId: null,
          },

          select: {
            id: true,
          },
        });

      if (
        ownedImages.length !==
        data.imageIds.length
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "存在无效图片或图片不属于当前用户",
          },
          {
            status: 400,
          }
        );
      }
    }

    const builtYear =
      parseBuiltYear(
        data.builtYear
      );

    const availableFrom =
      parseAvailableDate(
        data.availableDate
      );

    const depositMonths =
      parseMonthValue(
        data.deposit
      );

    const keyMoneyMonths =
      parseMonthValue(
        data.keyMoney
      );

    /*
    |--------------------------------------------------------------------------
    | Transaction
    |--------------------------------------------------------------------------
    |
    | 创建房源 + 绑定图片必须作为一次事务完成。
    |
    */

    const house =
      await prisma.$transaction(
        async (tx) => {
          const createdHouse =
            await tx.house.create({
              data: {
                publisherId:
                  publisher.id,

                title: data.title,

                rent: data.rent,

                managementFee:
                  data.managementFee,

                depositMonths,

                keyMoneyMonths,

                layout:
                  data.layout,

                area:
                  data.area,

                prefecture:
                  data.prefecture,

                city:
                  data.city,

                address:
                  data.address,

                station:
                  data.nearestStation ||
                  null,

                walkMinutes:
                  data.stationWalk ||
                  null,

                floor:
                  data.floor ||
                  null,

                builtYear,

                direction:
                  data.direction ||
                  null,

                structure:
                  data.structure ||
                  null,

                availableFrom,

                description:
                  data.description,

                features:
                  data.tags,

                tags:
                  data.tags,

                contactName:
                  data.contactName,

                company:
                  data.company ||
                  null,

                phone:
                  data.phone,

                email:
                  data.email ||
                  null,

                moderationStatus:
                  data.status,

                /*
                 * draft:
                 * 只是保存草稿
                 *
                 * pending:
                 * 已提交审核
                 *
                 * 目前都不会直接公开。
                 */
                publishedAt: null,
              },
            });

          if (
            data.imageIds.length >
            0
          ) {
            await tx.houseImage.updateMany({
              where: {
                id: {
                  in: data.imageIds,
                },

                uploaderId:
                  user.id,

                houseId: null,
              },

              data: {
                houseId:
                  createdHouse.id,
              },
            });
          }

          return createdHouse;
        }
      );

    return NextResponse.json(
      {
        success: true,

        house: {
          id: house.id,
          title: house.title,
          moderationStatus:
            house.moderationStatus,
          listingStatus:
            house.listingStatus,
          createdAt:
            house.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[POST /api/houses]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "服务器处理房源时发生错误",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET /api/houses
|--------------------------------------------------------------------------
|
| 公开房源列表
|
| 只返回：
| - 审核通过 approved
| - available / paused
| - 没过期
|
| 绝对不返回：
| - address 完整地址
| - contactName
| - phone
| - email
|
*/

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const q =
      searchParams
        .get("q")
        ?.trim() ?? "";

    const prefecture =
      searchParams
        .get("prefecture")
        ?.trim() ?? "";

    const city =
      searchParams
        .get("city")
        ?.trim() ?? "";

    const pageParam =
      Number(
        searchParams.get("page") ?? "1"
      );

    const limitParam =
      Number(
        searchParams.get("limit") ?? "12"
      );

    const page =
      Number.isInteger(pageParam) &&
      pageParam > 0
        ? pageParam
        : 1;

    const limit =
      Number.isInteger(limitParam) &&
      limitParam > 0
        ? Math.min(limitParam, 50)
        : 12;

    const now = new Date();

    const where = {
      moderationStatus: "approved" as const,

      listingStatus: {
        in: [
          "available" as const,
          "paused" as const,
        ],
      },

      OR: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            gt: now,
          },
        },
      ],

      ...(prefecture
        ? {
            prefecture,
          }
        : {}),

      ...(city
        ? {
            city: {
              contains: city,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(q
        ? {
            AND: [
              {
                OR: [
                  {
                    title: {
                      contains: q,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    prefecture: {
                      contains: q,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    city: {
                      contains: q,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    station: {
                      contains: q,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    layout: {
                      contains: q,
                      mode: "insensitive" as const,
                    },
                  },
                ],
              },
            ],
          }
        : {}),
    };

    const [houses, total] =
      await prisma.$transaction([
        prisma.house.findMany({
          where,

          include: {
            publisher: {
              select: {
                id: true,
                name: true,
                company: true,
                verified: true,
              },
            },

            images: {
              orderBy: {
                sortOrder: "asc",
              },

              select: {
                id: true,
                url: true,
                sortOrder: true,
              },
            },
          },

          orderBy: [
            {
              publishedAt: "desc",
            },
            {
              createdAt: "desc",
            },
          ],

          skip:
            (page - 1) *
            limit,

          take: limit,
        }),

        prisma.house.count({
          where,
        }),
      ]);

    const items =
      houses.map((house) => ({
        id: house.id,

        publisher: house.publisher,

        title: house.title,

        rent: house.rent,

        managementFee:
          house.managementFee,

        depositMonths:
          Number(
            house.depositMonths
          ),

        keyMoneyMonths:
          Number(
            house.keyMoneyMonths
          ),

        layout: house.layout,

        area:
          Number(house.area),

        prefecture:
          house.prefecture,

        city:
          house.city,

        station:
          house.station,

        walkMinutes:
          house.walkMinutes,

        floor:
          house.floor,

        builtYear:
          house.builtYear,

        direction:
          house.direction,

        structure:
          house.structure,

        availableFrom:
          house.availableFrom,

        foreignerAllowed:
          house.foreignerAllowed,

        studentAllowed:
          house.studentAllowed,

        description:
          house.description,

        features:
          house.features,

        tags:
          house.tags,

        listingStatus:
          house.listingStatus,

        lastVerifiedAt:
          house.lastVerifiedAt,

        expiresAt:
          house.expiresAt,

        views:
          house.views,

        publishedAt:
          house.publishedAt,

        createdAt:
          house.createdAt,

        images:
          house.images,

        location: [
          house.prefecture,
          house.city,
        ]
          .filter(Boolean)
          .join(""),
      }));

    return NextResponse.json({
      success: true,

      data: items,

      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    });
  } catch (error) {
    console.error(
      "[GET /api/houses]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "获取房源列表失败",
      },
      {
        status: 500,
      }
    );
  }
}
