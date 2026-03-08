// app/api/students/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

// GET /api/students — List/search students (admin/teacher)
export async function GET(req: NextRequest) {
  const { error } = requireAuth(req, ["ADMIN", "TEACHER"]);
  if (error) return apiError(error, 401);

  const { searchParams } = new URL(req.url);
  const search   = searchParams.get("search")  || "";
  const classId  = searchParams.get("classId") || undefined;
  const session  = searchParams.get("session") || undefined;
  const page     = parseInt(searchParams.get("page")  || "1");
  const limit    = parseInt(searchParams.get("limit") || "20");

  const where: any = { isActive: true };
  if (classId)  where.classId = classId;
  if (session)  where.session = session;
  if (search) {
    where.OR = [
      { name:        { contains: search, mode: "insensitive" } },
      { admissionNo: { contains: search, mode: "insensitive" } },
      { fatherName:  { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: { class: true },
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.student.count({ where }),
  ]);

  return apiResponse({ data, total, page, pages: Math.ceil(total / limit) });
}

const StudentSchema = z.object({
  admissionNo: z.string().min(3),
  name:        z.string().min(2).max(100),
  fatherName:  z.string().min(2).max(100),
  motherName:  z.string().min(2).max(100),
  dob:         z.string(),
  gender:      z.enum(["MALE", "FEMALE", "OTHER"]),
  phone:       z.string().regex(/^[6-9]\d{9}$/),
  address:     z.string().min(5),
  classId:     z.string(),
  session:     z.string(),
  photo:       z.string().url().optional(),
  bloodGroup:  z.string().max(5).optional(),
  aadhaarNo:   z.string().max(16).optional(),
});

// POST /api/students — Create student (admin)
export async function POST(req: NextRequest) {
  const { error } = requireAuth(req, ["ADMIN"]);
  if (error) return apiError(error, 401);

  try {
    const body = await req.json();
    const parsed = StudentSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors.map((e) => e.message).join(", "));

    const student = await prisma.student.create({
      data: { ...parsed.data, dob: new Date(parsed.data.dob) },
      include: { class: true },
    });
    return apiResponse(student, "Student created successfully", 201);
  } catch (err: any) {
    if (err.code === "P2002") return apiError("Admission number already exists");
    console.error(err);
    return apiError("Internal server error", 500);
  }
}
