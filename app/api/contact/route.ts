// app/api/contact/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const ContactSchema = z.object({
  name:    z.string().min(3).max(100),
  mobile:  z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  email:   z.string().email().optional().or(z.literal("")),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

// POST /api/contact — Submit contact form (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation error: " + parsed.error.errors.map((e) => e.message).join(", "));
    }

    await prisma.contact.create({ data: { ...parsed.data, email: parsed.data.email || null } });
    return apiResponse(null, "Message received! We'll get back to you within 24 hours.", 201);
  } catch (err) {
    console.error(err);
    return apiError("Internal server error", 500);
  }
}

// GET /api/contact — List messages (admin only)
export async function GET(req: NextRequest) {
  const { error } = requireAuth(req, ["ADMIN"]);
  if (error) return apiError(error, 401);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const page   = parseInt(searchParams.get("page") || "1");
  const limit  = parseInt(searchParams.get("limit") || "20");

  const [data, total] = await Promise.all([
    prisma.contact.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contact.count({ where: status ? { status: status as any } : {} }),
  ]);

  return apiResponse({ data, total, page, pages: Math.ceil(total / limit) });
}
