// app/api/events/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";

// GET /api/events — Public list of upcoming events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const upcoming = searchParams.get("upcoming") === "true";
  const page     = parseInt(searchParams.get("page")  || "1");
  const limit    = parseInt(searchParams.get("limit") || "10");

  const where: any = { isPublished: true };
  if (upcoming) where.date = { gte: new Date() };

  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { date: upcoming ? "asc" : "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  return apiResponse({ data, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const { error } = requireAuth(req, ["ADMIN"]);
  if (error) return apiError(error, 401);

  try {
    const body = await req.json();
    const event = await prisma.event.create({
      data: {
        ...body,
        date:    new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });
    return apiResponse(event, "Event created", 201);
  } catch (err) {
    console.error(err);
    return apiError("Internal server error", 500);
  }
}
