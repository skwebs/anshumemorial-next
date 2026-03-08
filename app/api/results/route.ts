// app/api/results/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError, getGrade } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

// GET /api/results?admissionNo=XXX&session=2024-25&examType=ANNUAL
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admissionNo = searchParams.get("admissionNo");
  const session     = searchParams.get("session");
  const examType    = searchParams.get("examType");
  const studentId   = searchParams.get("studentId"); // for admin/teacher use

  // Public result lookup
  if (admissionNo && session && examType) {
    const student = await prisma.student.findUnique({
      where: { admissionNo },
      include: { class: true },
    });

    if (!student) return apiError("Student not found. Please check your admission number.", 404);

    const results = await prisma.result.findMany({
      where: { studentId: student.id, session, examType: examType as any },
      include: { subject: true },
      orderBy: { subject: { name: "asc" } },
    });

    if (results.length === 0) return apiError("Result not found for the selected exam and session.", 404);

    const totalObt = results.reduce((s, r) => s + r.marksObt, 0);
    const totalMax = results.reduce((s, r) => s + r.maxMarks, 0);
    const percentage = (totalObt / totalMax) * 100;

    return apiResponse({
      student: {
        name:        student.name,
        admissionNo: student.admissionNo,
        class:       student.class.name,
        fatherName:  student.fatherName,
        session,
      },
      examType,
      session,
      results: results.map((r) => ({
        subject:  r.subject.name,
        marksObt: r.marksObt,
        maxMarks: r.maxMarks,
        grade:    r.grade || getGrade(r.marksObt, r.maxMarks),
        remarks:  r.remarks,
      })),
      totalObt,
      totalMax,
      percentage: Math.round(percentage * 10) / 10,
      grade: getGrade(totalObt, totalMax),
    });
  }

  // Admin: list results for a student
  const { error, payload } = requireAuth(req, ["ADMIN", "TEACHER"]);
  if (error) return apiError(error, 401);

  if (studentId) {
    const results = await prisma.result.findMany({
      where: { studentId, ...(session ? { session } : {}) },
      include: { subject: true },
      orderBy: [{ session: "desc" }, { examType: "asc" }],
    });
    return apiResponse(results);
  }

  return apiError("Missing parameters", 400);
}

// POST /api/results — Add/update result (admin/teacher)
const ResultSchema = z.object({
  studentId: z.string(),
  subjectId: z.string(),
  examType:  z.enum(["UNIT_TEST_1", "UNIT_TEST_2", "HALF_YEARLY", "ANNUAL", "QUARTERLY"]),
  session:   z.string(),
  marksObt:  z.number().min(0),
  maxMarks:  z.number().min(1),
  remarks:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { error, payload } = requireAuth(req, ["ADMIN", "TEACHER"]);
  if (error) return apiError(error, 401);

  try {
    const body = await req.json();
    // Support batch upload
    const items = Array.isArray(body) ? body : [body];
    const created = [];

    for (const item of items) {
      const parsed = ResultSchema.safeParse(item);
      if (!parsed.success) continue;

      const { marksObt, maxMarks } = parsed.data;
      const grade = getGrade(marksObt, maxMarks);

      const result = await prisma.result.upsert({
        where: {
          studentId_subjectId_examType_session: {
            studentId: parsed.data.studentId,
            subjectId: parsed.data.subjectId,
            examType:  parsed.data.examType,
            session:   parsed.data.session,
          },
        },
        update: { marksObt, maxMarks, grade, remarks: parsed.data.remarks },
        create: { ...parsed.data, grade },
      });
      created.push(result);
    }

    return apiResponse(created, `${created.length} result(s) saved`, 201);
  } catch (err) {
    console.error(err);
    return apiError("Failed to save results", 500);
  }
}
