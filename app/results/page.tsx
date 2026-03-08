// app/results/page.tsx
"use client";
import { useState } from "react";
import { Search, Loader2, Award, AlertCircle, Printer } from "lucide-react";
import { getGrade } from "@/lib/utils";

interface ResultData {
  student: {
    name: string; admissionNo: string; class: string;
    fatherName: string; session: string;
  };
  examType: string;
  session: string;
  results: { subject: string; marksObt: number; maxMarks: number; grade: string }[];
  totalObt: number; totalMax: number; percentage: number; grade: string;
}

export default function ResultsPage() {
  const [admissionNo, setAdmissionNo] = useState("");
  const [session, setSession]         = useState("2024-25");
  const [examType, setExamType]       = useState("ANNUAL");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [data, setData]               = useState<ResultData | null>(null);

  const sessions  = ["2024-25", "2023-24", "2022-23"];
  const examTypes = [
    { value: "ANNUAL",       label: "Annual Exam" },
    { value: "HALF_YEARLY",  label: "Half Yearly" },
    { value: "UNIT_TEST_1",  label: "Unit Test 1" },
    { value: "UNIT_TEST_2",  label: "Unit Test 2" },
    { value: "QUARTERLY",    label: "Quarterly" },
  ];

  const fetchResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNo.trim()) return;
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch(
        `/api/results?admissionNo=${admissionNo}&session=${session}&examType=${examType}`
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json.data);
    } catch (err: any) {
      setError(err.message || "Result not found. Please check your admission number.");
    } finally {
      setLoading(false);
    }
  };

  const gradeColor = (g: string) => {
    if (["A1","A2"].includes(g)) return "text-green-600 bg-green-50";
    if (["B1","B2"].includes(g)) return "text-blue-600 bg-blue-50";
    if (["C1","C2"].includes(g)) return "text-yellow-600 bg-yellow-50";
    if (g === "D")               return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-saffron-400 mb-2">Academic Results</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Check Your Result</h1>
          <p className="text-slate-300">Enter your admission number to view your academic performance.</p>
        </div>
      </section>

      {/* Search form */}
      <section className="py-12 px-4 bg-navy-50">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={fetchResult} className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-1">
                <label className="label">Admission No. *</label>
                <input
                  value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)}
                  required className="input-field" placeholder="e.g. AMA2024001"
                />
              </div>
              <div>
                <label className="label">Session</label>
                <select value={session} onChange={(e) => setSession(e.target.value)} className="input-field">
                  {sessions.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Exam Type</label>
                <select value={examType} onChange={(e) => setExamType(e.target.value)} className="input-field">
                  {examTypes.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Searching...</> : <><Search size={18} /> Search Result</>}
            </button>
          </form>

          {error && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Result card */}
      {data && (
        <section className="py-8 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Report card */}
            <div className="bg-white border-2 border-navy-200 rounded-2xl overflow-hidden shadow-lg" id="result-card">
              {/* Header */}
              <div className="bg-navy-900 text-white p-6 text-center">
                <div className="w-16 h-16 bg-saffron-500 rounded-full flex items-center justify-center text-navy-900 font-display font-bold text-2xl mx-auto mb-3">
                  AMA
                </div>
                <h2 className="font-display font-bold text-xl">Anshu Memorial Academy</h2>
                <p className="text-slate-300 text-sm">Bhatha Chowk, Rajapakar, Vaishali, Bihar</p>
                <div className="mt-3 inline-block bg-saffron-500 text-navy-900 text-sm font-bold px-4 py-1 rounded-full">
                  {examTypes.find((e) => e.value === data.examType)?.label} – {data.session}
                </div>
              </div>

              {/* Student info */}
              <div className="p-6 bg-navy-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Student Name",  value: data.student.name },
                  { label: "Admission No.", value: data.student.admissionNo },
                  { label: "Class",         value: data.student.class },
                  { label: "Father's Name", value: data.student.fatherName },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="font-bold text-navy-900 text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Marks table */}
              <div className="p-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-navy-200">
                      <th className="text-left py-2 font-bold text-navy-900">Subject</th>
                      <th className="text-center py-2 font-bold text-navy-900">Max</th>
                      <th className="text-center py-2 font-bold text-navy-900">Obtained</th>
                      <th className="text-center py-2 font-bold text-navy-900">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-2.5 font-medium text-slate-700">{r.subject}</td>
                        <td className="text-center text-slate-500">{r.maxMarks}</td>
                        <td className="text-center font-bold text-navy-900">{r.marksObt}</td>
                        <td className="text-center">
                          <span className={`badge ${gradeColor(r.grade)}`}>{r.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-navy-300 bg-navy-50">
                      <td className="py-3 font-bold text-navy-900">Total</td>
                      <td className="text-center font-bold text-navy-900">{data.totalMax}</td>
                      <td className="text-center font-bold text-navy-900">{data.totalObt}</td>
                      <td className="text-center">
                        <span className={`badge font-bold ${gradeColor(data.grade)}`}>
                          {data.grade}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Percentage",     value: `${data.percentage.toFixed(1)}%` },
                    { label: "Overall Grade",  value: data.grade },
                    { label: "Status",         value: data.percentage >= 33 ? "PASS" : "FAIL",
                      color: data.percentage >= 33 ? "text-green-600" : "text-red-600" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center bg-navy-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
                      <p className={`font-display font-bold text-2xl mt-1 ${color || "text-navy-900"}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => window.print()} className="btn-outline mt-6 w-full justify-center">
              <Printer size={18} /> Print Result
            </button>
          </div>
        </section>
      )}
    </>
  );
}
