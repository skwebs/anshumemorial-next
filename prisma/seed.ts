// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Import enums from generated client
import type { Role, Gender, NoticeCategory } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@AMA2024", 10);
  await prisma.user.upsert({
    where: { email: "admin@anshumemorial.in" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@anshumemorial.in",
      password: adminPassword,
      role: "ADMIN" as Role,
    },
  });

  // Classes
  const classNames = ["Play", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8"];
  const createdClasses: Record<string, string> = {};

  for (const name of classNames) {
    const cls = await prisma.class.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdClasses[name] = cls.id;
  }

  // Subjects for Class 1-8
  const coreSubjects = ["English", "Hindi", "Mathematics", "Science", "Social Studies"];
  for (let i = 1; i <= 8; i++) {
    const cls = await prisma.class.findUnique({ where: { name: String(i) } });
    if (!cls) continue;
    for (const sub of coreSubjects) {
      const subId = `${cls.id}-${sub.replace(/\s+/g, "_")}`;
      await prisma.subject.upsert({
        where: { id: subId },
        update: {},
        create: {
          id: subId,
          name: sub,
          code: sub.substring(0, 3).toUpperCase(),
          classId: cls.id,
        },
      });
    }
  }

  // Teachers
  const teachers = [
    { name: "Manish Kr. Sharma",  designation: "Director / Principal", subject: "Mathematics",    qualification: "M.Sc., B.Ed.", experience: 15 },
    { name: "Priya Singh",        designation: "Senior Teacher",        subject: "English",        qualification: "M.A., B.Ed.",  experience: 10 },
    { name: "Anjali Kumari",      designation: "Teacher",               subject: "Hindi",          qualification: "B.A., B.Ed.",  experience: 7  },
    { name: "Ravi Shankar",       designation: "Teacher",               subject: "Science",        qualification: "B.Sc., B.Ed.", experience: 8  },
    { name: "Sunita Devi",        designation: "Teacher",               subject: "Social Studies", qualification: "M.A., B.Ed.",  experience: 6  },
    { name: "Amit Verma",         designation: "Computer Teacher",      subject: "Computer",       qualification: "BCA, M.Ed.",   experience: 5  },
  ];

  for (const t of teachers) {
    const id = t.name.replace(/\s+/g, "-").toLowerCase();
    await prisma.teacher.upsert({
      where: { id },
      update: {},
      create: { id, ...t },
    });
  }

  // Notices
  const notices = [
    { title: "Admission Open for Session 2025-26",  content: "Admissions are now open for the session 2025-26 for classes Play to 8th. Contact the school office for details.", category: "ADMISSION" as NoticeCategory, isPublished: true, isPinned: true  },
    { title: "Annual Sports Day",                   content: "Annual Sports Day will be held on 15th January 2025. All students must participate.", category: "EVENT" as NoticeCategory, isPublished: true, isPinned: false },
    { title: "Half-Yearly Exam Schedule",           content: "Half-yearly examinations will begin from 10th September 2024. Time table is available at the school office.", category: "EXAM" as NoticeCategory, isPublished: true, isPinned: true  },
    { title: "Fee Submission Last Date",            content: "Monthly fee for October 2024 should be submitted by 10th October 2024.", category: "FEE" as NoticeCategory, isPublished: true, isPinned: false },
    { title: "Diwali Holiday Notice",               content: "School will remain closed from 28th October to 2nd November on account of Diwali festival.", category: "HOLIDAY" as NoticeCategory, isPublished: true, isPinned: false },
  ];

  for (const n of notices) {
    await prisma.notice.create({ data: { ...n, publishedAt: new Date() } });
  }

  // Events
  const events = [
    { title: "Annual Sports Day",      description: "Inter-house sports competition for all students",     date: new Date("2025-01-15"), location: "School Ground",     isPublished: true },
    { title: "Independence Day",       description: "Flag hoisting and cultural programs",                 date: new Date("2025-08-15"), location: "School Campus",     isPublished: true },
    { title: "Science Exhibition",     description: "Annual science exhibition showcasing student projects",date: new Date("2025-02-20"), location: "School Hall",       isPublished: true },
    { title: "Annual Function",        description: "Annual day celebration with cultural performances",   date: new Date("2025-03-10"), location: "School Auditorium", isPublished: true },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
