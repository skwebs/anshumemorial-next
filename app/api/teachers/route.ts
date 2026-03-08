// app/api/teachers/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

// GET /api/teachers — Public list
export async function GET(req: NextRequest) {
  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
    orderBy: { joinedAt: "asc" },
    select: {
      id: true, name: true, designation: true, subject: true,
      qualification: true, experience: true, photo: true,
    },
  });
  return apiResponse(teachers);
}

const TeacherSchema = z.object({
  name:          z.string().min(2),
  designation:   z.string().min(2),
  subject:       z.string().min(2),
  qualification: z.string().min(2),
  experience:    z.number().int().min(0),
  phone:         z.string().optional(),
  email:         z.string().email().optional(),
  photo:         z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  const { error } = requireAuth(req, ["ADMIN"]);
  if (error) return apiError(error, 401);

  try {
    const body = await req.json();
    const parsed = TeacherSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors.map((e) => e.message).join(", "));

    const teacher = await prisma.teacher.create({ data: parsed.data });
    return apiResponse(teacher, "Teacher added successfully", 201);
  } catch (err) {
    console.error(err);
    return apiError("Internal server error", 500);
  }
}
