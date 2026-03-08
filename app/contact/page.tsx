// app/contact/page.tsx
"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Loader2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStatus("success"); setMsg("Thank you! We'll get back to you within 24 hours.");
      setForm({ name: "", mobile: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error"); setMsg(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-saffron-400 mb-2">Contact Us</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Get In Touch</h1>
          <p className="text-slate-300">Have questions? We're here to help. Reach us anytime.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="section-title mb-8">Contact Information</h2>
            <div className="space-y-5">
              {[
                { icon: MapPin, label: "Address", value: "Bhatha Chowk, Bhatha Dasi, Rajapakar, Vaishali, Bihar-844124", href: "https://maps.google.com/?q=Anshu+Memorial+Academy" },
                { icon: Phone, label: "Phone", value: "+91 91282 89100", href: "tel:9128289100" },
                { icon: Phone, label: "WhatsApp", value: "+91 99737 57920", href: "https://wa.me/919973757920" },
                { icon: Mail, label: "Email", value: "info@anshumemorial.in", href: "mailto:info@anshumemorial.in" },
                { icon: Clock, label: "Office Hours", value: "Mon–Sat: 8:00 AM – 4:00 PM", href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-navy-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                        className="text-navy-900 font-semibold hover:text-saffron-600 transition-colors text-sm">
                        {value}
                      </a>
                    ) : (
                      <p className="text-navy-900 font-semibold text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-56">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.888!2d85.3579377!3d25.7501674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed65dea0882835%3A0xf138a62b245e3bcb!2sAnshu%20Memorial%20Academy!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="AMA Location"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="section-title mb-8">Send a Message</h2>
            {status === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                <p className="font-bold text-green-800 text-lg mb-2">Message Sent!</p>
                <p className="text-green-700 text-sm">{msg}</p>
                <button onClick={() => setStatus("idle")} className="btn-primary mt-5">Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {status === "error" && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle size={16} /> {msg}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your Name *</label>
                    <input name="name" value={form.name} onChange={handle} required className="input-field" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="label">Mobile No. *</label>
                    <input name="mobile" value={form.mobile} onChange={handle} required pattern="[6-9][0-9]{9}" className="input-field" placeholder="10-digit number" />
                  </div>
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handle} className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="label">Subject *</label>
                  <input name="subject" value={form.subject} onChange={handle} required className="input-field" placeholder="e.g. Admission Enquiry" />
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea name="message" value={form.message} onChange={handle} required rows={5} className="input-field resize-none" placeholder="Write your message here..." />
                </div>
                <button type="submit" disabled={status === "loading"} className="btn-saffron w-full justify-center py-4">
                  {status === "loading" ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><MessageSquare size={18} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
