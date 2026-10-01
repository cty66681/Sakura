import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| GET /api/publishers/:id
|--------------------------------------------------------------------------
|
| 发布者公开资料
|
| 返回：
| - 发布者姓名
| - 公司名
| - 认证状态
| - 注册时间
| - 公开房源
|
| 不返回：
| - userId
| - 用户邮箱
| - 房源联系电话
| - 房源联系邮箱
| - 房源完整 address
|
|--------------------------------------------------------------------------
*/

export async function GET(
  _request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    if (!id.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "无效的发布者 ID",
        },
        {
          status: 400,
        }
      );
    }

    const now = new Date();

    const publisher =
      await prisma.publisher.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          name: true,
          company: true,
          verified: true,
          createdAt: true,

          houses: {
            where: {
              moderationStatus: "approved",

              listingStatus: {
                in: [
                  "available",
                  "paused",
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
            },

            orderBy: [
              {
                publishedAt: "desc",
              },
              {
                createdAt: "desc",
              },
            ],

            select: {
              id: true,

              title: true,

              rent: true,
              managementFee: true,

              depositMonths: true,
              keyMoneyMonths: true,

              layout: true,
              area: true,

              prefecture: true,
              city: true,

              station: true,
              walkMinutes: true,

              foreignerAllowed: true,
              studentAllowed: true,

              tags: true,
              features: true,

              listingStatus: true,

              lastVerifiedAt: true,

              views: true,

              publishedAt: true,
              createdAt: true,

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
          },
        },
      });

    if (!publisher) {
      return NextResponse.json(
        {
          success: false,
          error: "发布者不存在",
        },
        {
          status: 404,
        }
      );
    }

    const houses =
      publisher.houses.map(
        (house) => ({
          id: house.id,

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

          foreignerAllowed:
            house.foreignerAllowed,

          studentAllowed:
            house.studentAllowed,

          tags:
            house.tags,

          features:
            house.features,

          listingStatus:
            house.listingStatus,

          lastVerifiedAt:
            house.lastVerifiedAt,

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
        })
      );

    return NextResponse.json({
      success: true,

      data: {
        id: publisher.id,

        name: publisher.name,

        company:
          publisher.company,

        verified:
          publisher.verified,

        createdAt:
          publisher.createdAt,

        houseCount:
          houses.length,

        houses,
      },
    });
  } catch (error) {
    console.error(
      "[GET /api/publishers/:id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "获取发布者信息失败",
      },
      {
        status: 500,
      }
    );
  }
}