import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEV_USER_EMAIL = "dev@sakura.local";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

const submitHouseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(80),

  rent: z
    .number()
    .int()
    .positive()
    .max(10_000_000),

  managementFee: z
    .number()
    .int()
    .min(0)
    .max(1_000_000)
    .default(0),

  deposit: z.string(),

  keyMoney: z.string(),

  layout: z
    .string()
    .trim()
    .min(1),

  area: z
    .number()
    .positive()
    .max(10_000),

  prefecture: z
    .string()
    .trim()
    .min(1),

  city: z
    .string()
    .trim()
    .min(1),

  address: z
    .string()
    .trim()
    .min(1),

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
    .min(1)
    .max(5000),

  tags: z
    .array(z.string())
    .default([]),

  imageIds: z
    .array(z.string())
    .default([]),

  contactName: z
    .string()
    .trim()
    .min(1),

  company: z
    .string()
    .trim()
    .optional()
    .default(""),

  phone: z
    .string()
    .trim()
    .min(1),

  email: z
    .string()
    .trim()
    .optional()
    .default(""),

  status: z.literal("pending"),
});

const draftHouseSchema = z.object({
  title: z
    .string()
    .trim()
    .max(80)
    .optional()
    .default(""),

  rent: z
    .number()
    .int()
    .min(0)
    .max(10_000_000)
    .optional()
    .default(0),

  managementFee: z
    .number()
    .int()
    .min(0)
    .max(1_000_000)
    .optional()
    .default(0),

  deposit: z
    .string()
    .optional()
    .default("0个月"),

  keyMoney: z
    .string()
    .optional()
    .default("0个月"),

  layout: z
    .string()
    .trim()
    .optional()
    .default(""),

  area: z
    .number()
    .min(0)
    .max(10_000)
    .optional()
    .default(0),

  prefecture: z
    .string()
    .trim()
    .optional()
    .default(""),

  city: z
    .string()
    .trim()
    .optional()
    .default(""),

  address: z
    .string()
    .trim()
    .optional()
    .default(""),

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
    .max(5000)
    .optional()
    .default(""),

  tags: z
    .array(z.string())
    .default([]),

  imageIds: z
    .array(z.string())
    .default([]),

  contactName: z
    .string()
    .trim()
    .optional()
    .default(""),

  company: z
    .string()
    .trim()
    .optional()
    .default(""),

  phone: z
    .string()
    .trim()
    .optional()
    .default(""),

  email: z
    .string()
    .trim()
    .optional()
    .default(""),

  status: z.literal("draft"),
});

function parseMonthValue(
  value: string
): number {
  const normalized = value
    .trim()
    .replace("个月", "")
    .replace("個月", "")
    .replace("ヶ月", "")
    .replace("か月", "")
    .replace("月", "")
    .replace("以上", "");

  if (!normalized) {
    return 0;
  }

  const result =
    Number(normalized);

  if (
    !Number.isFinite(result) ||
    result < 0
  ) {
    return 0;
  }

  return result;
}

function parseBuiltYear(
  value:
    | string
    | number
    | undefined
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
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}

/*
|--------------------------------------------------------------------------
| GET /api/houses/:id
|--------------------------------------------------------------------------
*/

export async function GET(
  _request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const houseId = Number(id);

    if (
      !Number.isInteger(houseId) ||
      houseId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "无效的房源 ID",
        },
        {
          status: 400,
        }
      );
    }

    const now = new Date();

    const house =
      await prisma.house.findFirst({
        where: {
          id: houseId,

          moderationStatus:
            "approved",

          listingStatus:
            "available",

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
        },

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
      });

    if (!house) {
      return NextResponse.json(
        {
          success: false,
          error:
            "房源不存在",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      data: {
        id: house.id,

        publisher:
          house.publisher,

        title:
          house.title,

        rent:
          house.rent,

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

        layout:
          house.layout,

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
      },
    });
  } catch (error) {
    console.error(
      "[GET /api/houses/:id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "获取房源详情失败",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH /api/houses/:id
|--------------------------------------------------------------------------
|
| 更新当前用户自己的草稿。
|
| draft   -> draft
| draft   -> pending
|
| pending / approved 等状态暂时不允许继续修改。
|
|--------------------------------------------------------------------------
*/

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const houseId = Number(id);

    if (
      !Number.isInteger(houseId) ||
      houseId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "无效的房源 ID",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const parsed =
      body?.status === "draft"
        ? draftHouseSchema.safeParse(
            body
          )
        : submitHouseSchema.safeParse(
            body
          );

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

    /*
    |--------------------------------------------------------------------------
    | 当前开发用户
    |--------------------------------------------------------------------------
    |
    | TODO [AUTH]
    |
    | 正式登录系统完成后：
    | 从 Session 获取当前 userId。
    |
    */

    const user =
      await prisma.user.findUnique({
        where: {
          email:
            DEV_USER_EMAIL,
        },

        select: {
          id: true,

          publisher: {
            select: {
              id: true,
            },
          },
        },
      });

    if (
      !user ||
      !user.publisher
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "当前用户没有发布者身份",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Ownership
    |--------------------------------------------------------------------------
    */

    const existingHouse =
      await prisma.house.findFirst({
        where: {
          id: houseId,

          publisherId:
            user.publisher.id,
        },

        select: {
          id: true,
          moderationStatus: true,
        },
      });

    if (!existingHouse) {
      return NextResponse.json(
        {
          success: false,
          error:
            "房源不存在或无权修改",
        },
        {
          status: 404,
        }
      );
    }

    if (
      existingHouse.moderationStatus !==
      "draft"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "当前房源状态不能修改",
        },
        {
          status: 409,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Image ownership
    |--------------------------------------------------------------------------
    */

    if (
      data.imageIds.length > 0
    ) {
      const validImages =
        await prisma.houseImage.findMany({
          where: {
            id: {
              in: data.imageIds,
            },

            uploaderId:
              user.id,

            OR: [
              {
                houseId: null,
              },
              {
                houseId,
              },
            ],
          },

          select: {
            id: true,
          },
        });

      if (
        validImages.length !==
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

    const depositMonths =
      parseMonthValue(
        data.deposit
      );

    const keyMoneyMonths =
      parseMonthValue(
        data.keyMoney
      );

    const builtYear =
      parseBuiltYear(
        data.builtYear
      );

    const availableFrom =
      parseAvailableDate(
        data.availableDate
      );

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    const house =
      await prisma.$transaction(
        async (tx) => {
          const updatedHouse =
            await tx.house.update({
              where: {
                id: houseId,
              },

              data: {
                title:
                  data.title ||
                  "未命名草稿",

                rent:
                  data.rent,

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

                publishedAt:
                  null,
              },
            });

          if (
            data.imageIds.length >
            0
          ) {
            await tx.houseImage.updateMany({
              where: {
                id: {
                  in:
                    data.imageIds,
                },

                uploaderId:
                  user.id,

                OR: [
                  {
                    houseId: null,
                  },
                  {
                    houseId,
                  },
                ],
              },

              data: {
                houseId,
              },
            });
          }

          return updatedHouse;
        }
      );

    return NextResponse.json({
      success: true,

      house: {
        id:
          house.id,

        title:
          house.title,

        moderationStatus:
          house.moderationStatus,

        listingStatus:
          house.listingStatus,

        updatedAt:
          house.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "[PATCH /api/houses/:id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "更新房源失败",
      },
      {
        status: 500,
      }
    );
  }
}