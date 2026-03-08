// app/api/notices/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

// GET /api/notices — Public + filter by category
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const page     = parseInt(searchParams.get("page")  || "1");
  const limit    = parseInt(searchParams.get("limit") || "20");
  const pinned   = searchParams.get("pinned");

  const where: any = { isPublished: true };
  if (category) where.category = category.toUpperCase();
  if (pinned === "true") where.isPinned = true;

  const [data, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notice.count({ where }),
  ]);

  return apiResponse({ data, total, page, pages: Math.ceil(total / limit) });
}

const NoticeSchema = z.object({
  title:       z.string().min(5).max(200),
  content:     z.string().min(10),
  category:    z.enum(["GENERAL", "EXAM", "HOLIDAY", "ADMISSION", "RESULT", "FEE", "EVENT"]).default("GENERAL"),
  isPublished: z.boolean().default(false),
  isPinned:    z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  expiresAt:   z.string().datetime().optional(),
});

// POST /api/notices — Create notice (admin)
export async function POST(req: NextRequest) {
  const { error } = requireAuth(req, ["ADMIN"]);
  if (error) return apiError(error, 401);

  try {
    const body = await req.json();
    const parsed = NoticeSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors.map((e) => e.message).join(", "));

    const notice = await prisma.notice.create({
      data: {
        ...parsed.data,
        publishedAt: parsed.data.isPublished ? (parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date()) : null,
        expiresAt:   parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    });
    return apiResponse(notice, "Notice created", 201);
  } catch (err) {
    console.error(err);
    return apiError("Internal server error", 500);
  }
}
