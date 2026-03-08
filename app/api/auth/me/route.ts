// app/api/auth/me/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { error, payload } = requireAuth(req);
  if (error || !payload) return apiError(error || "Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true, name: true, email: true, role: true,
      student: {
        include: {
          class: true,
          results: {
            include: { subject: true },
            orderBy: [{ session: "desc" }, { examType: "asc" }],
            take: 30,
          },
          fees: { orderBy: { dueDate: "desc" }, take: 12 },
        },
      },
    },
  });

  if (!user) return apiError("User not found", 404);
  return apiResponse(user);
}
