// app/about/page.tsx
import { Target, Eye, Heart, Award, Users, BookOpen, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

const values = [
  { icon: Target, title: "Academic Excellence",  desc: "Rigorous CBSE-pattern curriculum with modern teaching methods that foster deep understanding." },
  { icon: Heart,  title: "Character Building",   desc: "We shape students with strong moral values, empathy, and a sense of civic responsibility." },
  { icon: Shield, title: "Safe Environment",     desc: "A secure, inclusive campus where every child feels respected and valued." },
  { icon: Users,  title: "Community Spirit",     desc: "Encouraging teamwork, leadership, and cooperation through group activities." },
  { icon: Award,  title: "Co-Curricular Focus",  desc: "Sports, arts, and cultural activities complement academic learning." },
  { icon: Eye,    title: "Future Ready",          desc: "Preparing students for the challenges of the modern world with critical thinking." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-saffron-400 mb-2">Who We Are</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">About AMA</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            A decade of excellence in education. Anshu Memorial Academy is committed to
            nurturing every child's potential in a warm, inspiring environment.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle mb-2">Our Story</p>
            <h2 className="section-title mb-6">Built on a Vision of Quality Education</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Anshu Memorial Academy was founded with a singular vision: to provide quality English
              medium education to the children of Vaishali and surrounding areas. Run and managed by
              the AnitaBindeshwar Foundation, our school has grown into one of the region's most
              trusted educational institutions.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              We offer a CBSE-pattern curriculum from Play Group through Class 8, catering to
              children from their earliest years. Our approach balances rigorous academics with
              holistic development — encompassing sports, arts, moral education, and life skills.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We believe that quality education should be both accessible and affordable. Our
              programs are designed to prepare students not just for examinations, but for life.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: "10+",  label: "Years of Excellence" },
              { value: "500+", label: "Students Enrolled" },
              { value: "20+",  label: "Expert Faculty" },
              { value: "11",   label: "Classes (Play–VIII)" },
            ].map(({ value, label }) => (
              <div key={label}
                className="bg-gradient-to-br from-navy-900 to-navy-800 text-white rounded-2xl p-6 text-center shadow-lg">
                <p className="font-display font-bold text-4xl text-saffron-400">{value}</p>
                <p className="text-slate-300 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 px-4 bg-navy-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-saffron-100 rounded-xl flex items-center justify-center mb-4">
              <Target size={24} className="text-saffron-600" />
            </div>
            <h3 className="font-display font-bold text-2xl text-navy-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              To provide affordable, high-quality English medium education that empowers every
              child with knowledge, values, and skills for lifelong success. We aim to shape
              responsible citizens who contribute positively to society.
            </p>
          </div>
          <div className="bg-navy-900 text-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-saffron-500/20 rounded-xl flex items-center justify-center mb-4">
              <Eye size={24} className="text-saffron-400" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">Our Vision</h3>
            <p className="text-slate-300 leading-relaxed">
              To be the leading educational institution in Vaishali, recognized for academic
              excellence, character development, and the holistic growth of every student. We
              envision graduates who are confident, compassionate, and capable.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-subtitle mb-2">What We Stand For</p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-navy-200 transition-all group">
                <div className="w-12 h-12 bg-navy-100 group-hover:bg-navy-800 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Icon size={22} className="text-navy-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-navy-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Director message */}
      <section className="py-16 px-4 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-32 h-32 bg-saffron-500 rounded-full flex items-center justify-center text-navy-900 font-display font-bold text-5xl flex-shrink-0">
              M
            </div>
            <div>
              <p className="section-subtitle text-saffron-400 mb-2">From the Desk of</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
                Manish Kr. Sharma, Director
              </h2>
              <blockquote className="text-slate-300 leading-relaxed text-base italic border-l-4 border-saffron-500 pl-5">
                "Anshu Memorial Academy is more than a school — it is a community where young minds
                are nurtured with care, discipline, and inspiration. Our aim is to shape your ward
                into a successful, responsible, and benign personality. We believe in deeds, not
                words, offering a quality education that is both affordable and accessible."
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
