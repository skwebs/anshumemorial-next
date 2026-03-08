// app/page.tsx
import Link from "next/link";
import {
  BookOpen, Users, Award, MapPin, Phone, Mail,
  ChevronRight, Star, Megaphone, Calendar, GraduationCap,
  Heart, Target, Globe, Shield
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function getHomeData() {
  const [notices, events, teachers] = await Promise.all([
    prisma.notice.findMany({
      where: { isPublished: true },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 5,
    }),
    prisma.event.findMany({
      where: { isPublished: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
    }),
    prisma.teacher.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { joinedAt: "asc" },
    }),
  ]);
  return { notices, events, teachers };
}

export default async function HomePage() {
  const { notices, events, teachers } = await getHomeData();

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(249,134,7,0.08)_0%,transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 bg-saffron-500/20 border border-saffron-500/30 text-saffron-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Star size={14} className="fill-current" />
              Admissions Open 2025–26
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Anshu Memorial{" "}
              <span className="text-saffron-400">Academy</span>
            </h1>
            <p className="text-navy-200 text-lg mb-3 font-semibold">
              CBSE Pattern • English Medium • Play to Class 8th
            </p>
            <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-lg">
              A premier institution run by AnitaBindeshwar Foundation committed to academic
              excellence, character building, and nurturing future leaders in the heart of Vaishali, Bihar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admissions" className="btn-saffron text-base px-8 py-3.5">
                Apply for Admission
              </Link>
              <Link href="/results" className="btn-outline border-white/40 text-white hover:bg-white/10 hover:text-white text-base px-8 py-3.5">
                Check Results
              </Link>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              {[
                { label: "Years of Excellence", value: "10+" },
                { label: "Students Enrolled",   value: "500+" },
                { label: "Qualified Teachers",  value: "20+" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-display font-bold text-saffron-400">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div className="animate-fade-up delay-300">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h2 className="font-display font-bold text-2xl mb-6 text-saffron-300">
                Why Choose AMA?
              </h2>
              {[
                { icon: BookOpen, text: "CBSE Pattern curriculum with modern teaching methods" },
                { icon: Users,    text: "Experienced & dedicated faculty team" },
                { icon: Award,    text: "Focus on academic excellence + moral values" },
                { icon: Heart,    text: "Safe, nurturing, and inclusive environment" },
                { icon: Target,   text: "Co-curricular activities & sports programs" },
                { icon: Globe,    text: "Affordable quality education for all" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className="w-8 h-8 bg-saffron-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={16} className="text-saffron-400" />
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Notices ticker ───────────────────────────────────────────────────── */}
      {notices.length > 0 && (
        <div className="bg-saffron-500 text-navy-900 py-3 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <span className="flex items-center gap-2 font-bold text-sm whitespace-nowrap flex-shrink-0">
              <Megaphone size={16} /> Latest:
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-marquee whitespace-nowrap">
                {[...notices, ...notices].map((n, i) => (
                  <Link
                    key={`${n.id}-${i}`}
                    href="/notices"
                    className="text-sm font-medium hover:underline"
                  >
                    {n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── About snippet ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Director message */}
          <div>
            <p className="section-subtitle mb-2">Director's Message</p>
            <h2 className="section-title mb-6">
              Shaping Young Minds,<br />Building Bright Futures
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4 text-base">
              Anshu Memorial Academy is a co-educational institution which nurtures academic and
              cultural development of children. We instill ideals of courage, truth, perseverance,
              fortitude and virtuosity in our students.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 text-base">
              Our priorities are not only academic excellence, but also the formation of youth in
              discipline, hard work, and moral values — preparing them for life by promoting
              intellectual excellence and uprightness of character.
            </p>
            <div className="flex items-center gap-4 p-4 bg-navy-50 rounded-2xl">
              <div className="w-12 h-12 bg-navy-800 rounded-full flex items-center justify-center text-white font-display font-bold">
                MK
              </div>
              <div>
                <p className="font-bold text-navy-900">Manish Kr. Sharma</p>
                <p className="text-sm text-slate-500">Director, Anshu Memorial Academy</p>
              </div>
            </div>
            <Link href="/about" className="btn-primary mt-6 inline-flex">
              Read More <ChevronRight size={16} />
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield,        label: "Safe Environment",   desc: "CCTV monitored, secure campus" },
              { icon: BookOpen,      label: "Smart Learning",     desc: "Modern teaching methodologies" },
              { icon: GraduationCap, label: "Expert Faculty",     desc: "Qualified & experienced teachers" },
              { icon: Award,         label: "Awards & Results",   desc: "Consistent academic performance" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-navy-50 p-5 rounded-2xl hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-navy-800 group-hover:bg-saffron-500 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <Icon size={20} className="text-white" />
                </div>
                <p className="font-bold text-navy-900 text-sm">{label}</p>
                <p className="text-slate-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Classes offered ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-navy-50">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <p className="section-subtitle mb-2">Classes Offered</p>
          <h2 className="section-title">From Play Group to Class 8</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            We welcome children from the earliest stage and nurture them through foundational years.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
          {["Play", "Nursery", "KG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((cls, i) => (
            <div key={cls}
              className="aspect-square flex flex-col items-center justify-center rounded-2xl font-display font-bold text-sm transition-all hover:-translate-y-1 hover:shadow-lg cursor-default"
              style={{
                background: i < 3
                  ? "linear-gradient(135deg,#f98607,#dd6202)"
                  : "linear-gradient(135deg,#163c79,#0f2952)",
                color: "white",
              }}
            >
              <span className="text-xs opacity-70">Class</span>
              <span className="text-base">{cls}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Notices & Events ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Notices */}
          <div>
            <p className="section-subtitle mb-2">Announcements</p>
            <h2 className="section-title mb-6">Latest Notices</h2>
            <div className="space-y-3">
              {notices.length === 0 ? (
                <p className="text-slate-400">No notices at the moment.</p>
              ) : notices.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-navy-200 hover:bg-navy-50 transition-colors group">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isPinned ? "bg-saffron-500" : "bg-navy-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy-900 text-sm group-hover:text-navy-700 truncate">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {n.publishedAt ? formatDate(n.publishedAt) : ""}
                      {n.isPinned && <span className="ml-2 text-saffron-600 font-semibold">📌 Pinned</span>}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-navy-500 transition-colors flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
            <Link href="/notices" className="btn-outline mt-6 text-sm inline-flex">
              View All Notices
            </Link>
          </div>

          {/* Events */}
          <div>
            <p className="section-subtitle mb-2">Upcoming</p>
            <h2 className="section-title mb-6">Events & Activities</h2>
            {events.length === 0 ? (
              <p className="text-slate-400">No upcoming events.</p>
            ) : (
              <div className="space-y-4">
                {events.map((e) => (
                  <div key={e.id} className="flex items-start gap-4 p-5 rounded-2xl bg-navy-50 border border-navy-100">
                    <div className="bg-navy-800 text-white rounded-xl p-3 text-center min-w-[56px] flex-shrink-0">
                      <p className="text-xl font-display font-bold leading-none">
                        {new Date(e.date).getDate()}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider opacity-80">
                        {new Date(e.date).toLocaleString("en-IN", { month: "short" })}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">{e.title}</p>
                      {e.description && (
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{e.description}</p>
                      )}
                      {e.location && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin size={11} /> {e.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Faculty ──────────────────────────────────────────────────────────── */}
      {teachers.length > 0 && (
        <section className="py-20 px-4 bg-navy-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="section-subtitle mb-2">Our Team</p>
              <h2 className="section-title">Meet the Faculty</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {teachers.map((t) => (
                <div key={t.id} className="card p-5 text-center">
                  <div className="w-16 h-16 mx-auto bg-navy-800 rounded-full flex items-center justify-center text-white font-display font-bold text-xl mb-3">
                    {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <p className="font-bold text-navy-900 text-sm leading-tight">{t.name}</p>
                  <p className="text-saffron-600 text-xs mt-0.5">{t.subject}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{t.designation}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/faculty" className="btn-primary inline-flex">
                View All Faculty
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Contact CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle mb-2 text-saffron-400">Get In Touch</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            We'd Love to Hear From You
          </h2>
          <p className="text-slate-300 mb-10 text-base">
            Have questions about admissions, fees, or the curriculum? Reach us anytime.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Phone, label: "Call Us",      value: "+91 91282 89100", href: "tel:9128289100" },
              { icon: Mail,  label: "Email Us",     value: "info@anshumemorial.in", href: "mailto:info@anshumemorial.in" },
              { icon: MapPin,label: "Visit Us",     value: "Bhatha Chowk, Vaishali", href: "https://maps.google.com" },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/15 rounded-2xl transition-colors border border-white/10">
                <div className="w-10 h-10 bg-saffron-500 rounded-full flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
                <p className="text-white font-semibold text-sm text-center">{value}</p>
              </a>
            ))}
          </div>
          <Link href="/contact" className="btn-saffron text-base px-10 py-4">
            Send Us a Message
          </Link>
        </div>
      </section>
    </>
  );
}
