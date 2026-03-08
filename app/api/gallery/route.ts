// app/api/gallery/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";

// GET /api/gallery — Public
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const page     = parseInt(searchParams.get("page")  || "1");
  const limit    = parseInt(searchParams.get("limit") || "20");

  const where: any = { isPublished: true };
  if (category) where.category = category;

  const [data, total] = await Promise.all([
    prisma.gallery.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.gallery.count({ where }),
  ]);

  // Also return distinct categories
  const categories = await prisma.gallery.findMany({
    where: { isPublished: true },
    select: { category: true },
    distinct: ["category"],
  });

  return apiResponse({ data, total, page, pages: Math.ceil(total / limit), categories: categories.map((c) => c.category) });
}

export async function POST(req: NextRequest) {
  const { error } = requireAuth(req, ["ADMIN"]);
  if (error) return apiError(error, 401);

  try {
    const body = await req.json();
    const gallery = await prisma.gallery.create({
      data: { ...body, takenAt: body.takenAt ? new Date(body.takenAt) : null },
    });
    return apiResponse(gallery, "Image added to gallery", 201);
  } catch (err) {
    console.error(err);
    return apiError("Internal server error", 500);
  }
}
