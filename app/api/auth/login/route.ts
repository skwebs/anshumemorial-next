// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid email or password format");

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      include: { student: { include: { class: true } } },
    });

    if (!user) return apiError("Invalid email or password", 401);

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return apiError("Invalid email or password", 401);

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return apiResponse({
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        student: user.student ? {
          id:           user.student.id,
          name:         user.student.name,
          admissionNo:  user.student.admissionNo,
          class:        user.student.class.name,
          fatherName:   user.student.fatherName,
        } : null,
      },
    }, "Login successful");
  } catch (err) {
    console.error(err);
    return apiError("Internal server error", 500);
  }
}
