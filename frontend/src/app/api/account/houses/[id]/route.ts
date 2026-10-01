import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEV_USER_EMAIL =
  "dev@sakura.local";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| GET /api/account/houses/:id
|--------------------------------------------------------------------------
|
| 获取当前用户自己的房源数据。
|
| 当前用于：
| /houses/new?edit=:id
|
| TODO [AUTH]
| 正式登录完成后：
| 从 Session 获取当前 userId，
| 删除 DEV_USER_EMAIL。
|
|--------------------------------------------------------------------------
*/

export async function GET(
  _request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const houseId =
      Number(id);

    if (
      !Number.isInteger(
        houseId
      ) ||
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

    /*
    |--------------------------------------------------------------------------
    | Current user
    |--------------------------------------------------------------------------
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

    const house =
      await prisma.house.findFirst({
        where: {
          id: houseId,

          publisherId:
            user.publisher.id,
        },

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

    if (!house) {
      return NextResponse.json(
        {
          success: false,
          error:
            "房源不存在或无权访问",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Edit permission
    |--------------------------------------------------------------------------
    */

    if (
      house.moderationStatus !==
      "draft"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "当前房源状态不能继续编辑",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json({
      success: true,

      data: {
        id:
          house.id,

        title:
          house.title ===
          "未命名草稿"
            ? ""
            : house.title,

        rent:
          house.rent,

        managementFee:
          house.managementFee,

        deposit:
          `${Number(
            house.depositMonths
          )}个月`,

        keyMoney:
          `${Number(
            house.keyMoneyMonths
          )}个月`,

        layout:
          house.layout,

        area:
          Number(
            house.area
          ),

        prefecture:
          house.prefecture,

        city:
          house.city,

        address:
          house.address,

        nearestStation:
          house.station ?? "",

        stationWalk:
          house.walkMinutes,

        floor:
          house.floor ?? "",

        builtYear:
          house.builtYear,

        direction:
          house.direction ?? "",

        structure:
          house.structure ?? "",

        availableDate:
          house.availableFrom
            ? house.availableFrom
                .toISOString()
                .slice(0, 10)
            : "",

        description:
          house.description,

        features:
          house.features,

        contactName:
          house.contactName,

        company:
          house.company ?? "",

        phone:
          house.phone,

        email:
          house.email ?? "",

        moderationStatus:
          house.moderationStatus,

        listingStatus:
          house.listingStatus,

        images:
          house.images,
      },
    });
  } catch (error) {
    console.error(
      "[GET /api/account/houses/:id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "获取房源草稿失败",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const houseId =
      Number(id);

    if (
      !Number.isInteger(
        houseId
      ) ||
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

    const user =
      await prisma.user.findUnique({
        where: {
          email:
            DEV_USER_EMAIL,
        },

        select: {
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

    const house =
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

    if (!house) {
      return NextResponse.json(
        {
          success: false,
          error:
            "房源不存在或无权操作",
        },
        {
          status: 404,
        }
      );
    }

    if (
      house.moderationStatus !==
      "draft"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "只有草稿可以删除",
        },
        {
          status: 409,
        }
      );
    }

    await prisma.house.delete({
      where: {
        id: houseId,
      },
    });

    return NextResponse.json({
      success: true,
      deletedId: houseId,
    });
  } catch (error) {
    console.error(
      "[DELETE /api/account/houses/:id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "删除房源失败",
      },
      {
        status: 500,
      }
    );
  }
}

type HouseManageAction =
  | "pause"
  | "resume"
  | "mark_rented";

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const houseId =
      Number(id);

    if (
      !Number.isInteger(
        houseId
      ) ||
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

    const action =
      body?.action as
        | HouseManageAction
        | undefined;

    if (
      !action ||
      ![
        "pause",
        "resume",
        "mark_rented",
      ].includes(action)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "无效的房源操作",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | TODO [AUTH]
    |--------------------------------------------------------------------------
    |
    | 正式登录以后：
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

    const house =
      await prisma.house.findFirst({
        where: {
          id: houseId,

          publisherId:
            user.publisher.id,
        },

        select: {
          id: true,
          moderationStatus: true,
          listingStatus: true,
        },
      });

    if (!house) {
      return NextResponse.json(
        {
          success: false,
          error:
            "房源不存在或无权操作",
        },
        {
          status: 404,
        }
      );
    }

    if (
      house.moderationStatus !==
      "approved"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "只有审核通过的房源可以进行发布管理",
        },
        {
          status: 409,
        }
      );
    }

    let nextStatus:
      | "available"
      | "paused"
      | "rented";

    if (action === "pause") {
      if (
        house.listingStatus !==
        "available"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "当前状态不能暂停",
          },
          {
            status: 409,
          }
        );
      }

      nextStatus =
        "paused";
    } else if (
      action === "resume"
    ) {
      if (
        house.listingStatus !==
        "paused"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "当前状态不能恢复发布",
          },
          {
            status: 409,
          }
        );
      }

      nextStatus =
        "available";
    } else {
      if (
        house.listingStatus !==
          "available" &&
        house.listingStatus !==
          "paused"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "当前状态不能标记为已出租",
          },
          {
            status: 409,
          }
        );
      }

      nextStatus =
        "rented";
    }

    const updatedHouse =
      await prisma.house.update({
        where: {
          id: houseId,
        },

        data: {
          listingStatus:
            nextStatus,
        },

        select: {
          id: true,
          moderationStatus: true,
          listingStatus: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      success: true,

      data: updatedHouse,
    });
  } catch (error) {
    console.error(
      "[PATCH /api/account/houses/:id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "房源状态更新失败",
      },
      {
        status: 500,
      }
    );
  }
}