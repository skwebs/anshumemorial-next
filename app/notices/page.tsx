// app/notices/page.tsx
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Pin, FileText, Calendar, BookOpen, DollarSign, Bell } from "lucide-react";

const categoryConfig: Record<string, { label: string; color: string; Icon: any }> = {
  GENERAL:   { label: "General",   color: "bg-slate-100 text-slate-700",   Icon: Bell },
  EXAM:      { label: "Exam",      color: "bg-blue-100 text-blue-700",     Icon: BookOpen },
  HOLIDAY:   { label: "Holiday",   color: "bg-green-100 text-green-700",   Icon: Calendar },
  ADMISSION: { label: "Admission", color: "bg-purple-100 text-purple-700", Icon: FileText },
  RESULT:    { label: "Result",    color: "bg-indigo-100 text-indigo-700", Icon: BookOpen },
  FEE:       { label: "Fee",       color: "bg-yellow-100 text-yellow-700", Icon: DollarSign },
  EVENT:     { label: "Event",     color: "bg-red-100 text-red-700",       Icon: Calendar },
};

export const metadata = { title: "Notices & Announcements" };
export const revalidate = 60;

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    where: { isPublished: true },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
  });

  const pinned   = notices.filter((n) => n.isPinned);
  const regular  = notices.filter((n) => !n.isPinned);

  return (
    <>
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-saffron-400 mb-2">Stay Updated</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Notices & Announcements</h1>
          <p className="text-slate-300">Important notices, circulars, and announcements from the school.</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-navy-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          {pinned.length > 0 && (
            <div className="mb-8">
              <h2 className="flex items-center gap-2 font-display font-bold text-xl text-navy-900 mb-4">
                <Pin size={18} className="text-saffron-500" /> Pinned Notices
              </h2>
              <div className="space-y-3">
                {pinned.map((n) => <NoticeCard key={n.id} notice={n} />)}
              </div>
            </div>
          )}

          {regular.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-xl text-navy-900 mb-4">All Notices</h2>
              <div className="space-y-3">
                {regular.map((n) => <NoticeCard key={n.id} notice={n} />)}
              </div>
            </div>
          )}

          {notices.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No notices at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function NoticeCard({ notice }: { notice: any }) {
  const cat = categoryConfig[notice.category] || categoryConfig.GENERAL;
  const Icon = cat.Icon;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-navy-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`badge text-xs ${cat.color}`}>{cat.label}</span>
              {notice.isPinned && (
                <span className="badge text-xs bg-saffron-100 text-saffron-700">
                  <Pin size={10} className="mr-0.5" /> Pinned
                </span>
              )}
            </div>
            <h3 className="font-bold text-navy-900">{notice.title}</h3>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{notice.content}</p>
            {notice.publishedAt && (
              <p className="text-xs text-slate-400 mt-2">{formatDate(notice.publishedAt)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
