// app/admissions/page.tsx
"use client";
import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2, BookOpen, Users, Calendar, FileText } from "lucide-react";
import type { Metadata } from "next";

const classes = ["Play", "Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];

export default function AdmissionsPage() {
  const [form, setForm] = useState({
    studentName: "", fatherName: "", motherName: "",
    dob: "", gender: "", applyingClass: "", phone: "",
    email: "", address: "", previousSchool: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("Your admission enquiry has been submitted successfully! We will contact you within 2 working days.");
        setForm({ studentName: "", fatherName: "", motherName: "", dob: "", gender: "", applyingClass: "", phone: "", email: "", address: "", previousSchool: "" });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-saffron-400 mb-2">Session 2025–26</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Admissions Open</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Join Anshu Memorial Academy and give your child the best foundation for a bright future.
            Limited seats available — apply today!
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="bg-navy-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { step: "1", icon: FileText,   label: "Fill Application",   desc: "Complete the online form below" },
              { step: "2", icon: Users,      label: "School Visit",       desc: "Visit us with required documents" },
              { step: "3", icon: BookOpen,   label: "Assessment",         desc: "Brief interaction with the child" },
              { step: "4", icon: CheckCircle,label: "Confirmation",       desc: "Receive your admission letter" },
            ].map(({ step, icon: Icon, label, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-5 shadow-sm relative">
                <div className="absolute -top-3 left-4 w-7 h-7 bg-saffron-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {step}
                </div>
                <Icon size={28} className="text-navy-700 mx-auto mb-2 mt-2" />
                <p className="font-bold text-navy-900 text-sm">{label}</p>
                <p className="text-slate-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-subtitle mb-2">Apply Online</p>
            <h2 className="section-title">Admission Enquiry Form</h2>
            <p className="text-slate-500 mt-2">Fill in the details below and our team will get back to you.</p>
          </div>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-green-800 mb-2">Application Submitted!</h3>
              <p className="text-green-700">{message}</p>
              <button onClick={() => setStatus("idle")} className="btn-primary mt-6">
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle size={18} />
                  {message}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Student's Full Name *</label>
                  <input name="studentName" value={form.studentName} onChange={handleChange} required className="input-field" placeholder="Enter student's name" />
                </div>
                <div>
                  <label className="label">Father's Name *</label>
                  <input name="fatherName" value={form.fatherName} onChange={handleChange} required className="input-field" placeholder="Enter father's name" />
                </div>
                <div>
                  <label className="label">Mother's Name *</label>
                  <input name="motherName" value={form.motherName} onChange={handleChange} required className="input-field" placeholder="Enter mother's name" />
                </div>
                <div>
                  <label className="label">Date of Birth *</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="label">Gender *</label>
                  <select name="gender" value={form.gender} onChange={handleChange} required className="input-field">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Applying for Class *</label>
                  <select name="applyingClass" value={form.applyingClass} onChange={handleChange} required className="input-field">
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Contact Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required pattern="[6-9][0-9]{9}" className="input-field" placeholder="10-digit mobile number" />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Optional" />
                </div>
              </div>

              <div>
                <label className="label">Residential Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="input-field resize-none" placeholder="Full address with pin code" />
              </div>

              <div>
                <label className="label">Previous School (if any)</label>
                <input name="previousSchool" value={form.previousSchool} onChange={handleChange} className="input-field" placeholder="Name of previous school" />
              </div>

              <button type="submit" disabled={status === "loading"} className="btn-saffron w-full justify-center py-4 text-base">
                {status === "loading" ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                ) : "Submit Admission Enquiry"}
              </button>

              <p className="text-center text-slate-400 text-xs">
                By submitting, you agree to our privacy policy. We'll contact you within 2 working days.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Documents required */}
      <section className="py-12 px-4 bg-navy-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-8">Documents Required at Admission</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Birth Certificate",
              "Aadhar Card (Child & Parents)",
              "Passport Size Photos (4)",
              "Previous School TC (if applicable)",
              "Previous Class Marksheet",
              "Residential Proof",
            ].map((doc) => (
              <div key={doc} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
