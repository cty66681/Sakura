import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEV_USER_EMAIL = "dev@sakura.local";

/*
|--------------------------------------------------------------------------
| GET /api/account/houses
|--------------------------------------------------------------------------
|
| 当前登录用户自己的全部房源
|
| 包含：
| - draft
| - pending
| - approved
| - rejected
| - hidden
|
| TODO [AUTH]
| 正式登录系统完成后：
| 从 Session 获取当前 userId，不再使用 DEV_USER_EMAIL。
|
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const user =
      await prisma.user.findUnique({
        where: {
          email: DEV_USER_EMAIL,
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
          success: true,
          data: [],
        }
      );
    }

    const houses =
      await prisma.house.findMany({
        where: {
          publisherId:
            user.publisher.id,
        },

        orderBy: [
          {
            updatedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        include: {
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

    const items =
      houses.map((house) => ({
        id:
          house.id,

        title:
          house.title,

        rent:
          house.rent,

        managementFee:
          house.managementFee,

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

        moderationStatus:
          house.moderationStatus,

        listingStatus:
          house.listingStatus,

        rejectionReason:
          null,

        views:
          house.views,

        createdAt:
          house.createdAt,

        updatedAt:
          house.updatedAt,

        publishedAt:
          house.publishedAt,

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

      count:
        items.length,
    });
  } catch (error) {
    console.error(
      "[GET /api/account/houses]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "获取我的房源失败",
      },
      {
        status: 500,
      }
    );
  }
}