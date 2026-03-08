// app/faculty/page.tsx
import { prisma } from "@/lib/prisma";
import { GraduationCap, BookOpen, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Faculty" };
export const revalidate = 3600;

export default async function FacultyPage() {
  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
    orderBy: { joinedAt: "asc" },
  });

  const director = teachers.find((t) => t.designation.toLowerCase().includes("director"));
  const rest = teachers.filter((t) => !t.designation.toLowerCase().includes("director"));

  return (
    <>
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-saffron-400 mb-2">Our Team</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Faculty & Staff</h1>
          <p className="text-slate-300">Qualified, experienced, and passionate educators dedicated to your child's growth.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-navy-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Director card */}
          {director && (
            <div className="mb-12">
              <h2 className="section-title text-center mb-8">Leadership</h2>
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-saffron-300">
                <div className="w-24 h-24 mx-auto bg-navy-900 rounded-full flex items-center justify-center text-white font-display font-bold text-3xl mb-4">
                  {director.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <h3 className="font-display font-bold text-2xl text-navy-900">{director.name}</h3>
                <p className="text-saffron-600 font-semibold mt-1">{director.designation}</p>
                <p className="text-slate-500 text-sm mt-1">{director.subject}</p>
                <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><GraduationCap size={14} /> {director.qualification}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {director.experience}+ yrs</span>
                </div>
              </div>
            </div>
          )}

          {/* Teachers grid */}
          <h2 className="section-title text-center mb-8">Teaching Staff</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {rest.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl shadow-sm p-5 text-center border border-slate-100 hover:shadow-md hover:border-navy-200 transition-all group">
                <div className="w-16 h-16 mx-auto bg-navy-100 group-hover:bg-navy-800 rounded-full flex items-center justify-center text-navy-800 group-hover:text-white font-display font-bold text-xl transition-colors mb-3">
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <h3 className="font-bold text-navy-900 text-sm leading-tight">{t.name}</h3>
                <p className="text-saffron-600 text-xs font-semibold mt-0.5">{t.subject}</p>
                <p className="text-slate-400 text-xs mt-0.5">{t.designation}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                    <GraduationCap size={11} /> {t.qualification}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                    <Clock size={11} /> {t.experience} years exp.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {teachers.length === 0 && (
            <p className="text-center text-slate-400 py-20">Faculty information coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
