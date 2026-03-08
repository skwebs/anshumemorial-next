// app/api/admissions/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const AdmissionSchema = z.object({
  studentName:   z.string().min(2).max(100),
  fatherName:    z.string().min(2).max(100),
  motherName:    z.string().min(2).max(100),
  dob:           z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  gender:        z.enum(["MALE", "FEMALE", "OTHER"]),
  applyingClass: z.string().min(1).max(20),
  phone:         z.string().regex(/^[6-9]\d{9}$/),
  email:         z.string().email().optional().or(z.literal("")),
  address:       z.string().min(5).max(500),
  previousSchool:z.string().max(200).optional(),
});

// POST /api/admissions — Submit admission enquiry (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AdmissionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation failed: " + parsed.error.errors.map((e) => e.message).join(", "));
    }

    const { email, previousSchool, ...rest } = parsed.data;
    const admission = await prisma.admission.create({
      data: {
        ...rest,
        dob: new Date(rest.dob),
        email:          email         || null,
        previousSchool: previousSchool|| null,
      },
    });

    return apiResponse({ id: admission.id }, "Admission enquiry submitted successfully", 201);
  } catch (err) {
    console.error(err);
    return apiError("Internal server error", 500);
  }
}

// GET /api/admissions — List admissions (admin only)
export async function GET(req: NextRequest) {
  const { error, payload } = requireAuth(req, ["ADMIN"]);
  if (error) return apiError(error, 401);

  const { searchParams } = new URL(req.url);
  const status  = searchParams.get("status")  || undefined;
  const page    = parseInt(searchParams.get("page")  || "1");
  const limit   = parseInt(searchParams.get("limit") || "20");

  const [data, total] = await Promise.all([
    prisma.admission.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { appliedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.admission.count({ where: status ? { status: status as any } : {} }),
  ]);

  return apiResponse({ data, total, page, pages: Math.ceil(total / limit) });
}
