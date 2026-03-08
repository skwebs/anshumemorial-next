// components/Footer.tsx
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from "lucide-react";

const quickLinks = [
  { label: "About Us",    href: "/about" },
  { label: "Admissions",  href: "/admissions" },
  { label: "Results",     href: "/results" },
  { label: "Faculty",     href: "/faculty" },
  { label: "Gallery",     href: "/gallery" },
  { label: "Notices",     href: "/notices" },
  { label: "Contact",     href: "/contact" },
];

const policies = [
  { label: "Privacy Policy",  href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer",      href: "/disclaimer" },
  { label: "Student Panel",   href: "/portal/student" },
  { label: "Teacher Panel",   href: "/portal/teacher" },
  { label: "Admin Panel",     href: "/portal/admin" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white">
      {/* CTA strip */}
      <div className="bg-saffron-500 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-display font-bold text-navy-900 text-lg">
              Admissions Open for Session 2025–26
            </p>
            <p className="text-navy-800 text-sm">Play Group to Class 8th · Limited Seats</p>
          </div>
          <Link
            href="/admissions"
            className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm whitespace-nowrap"
          >
            Apply Now →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-saffron-500 rounded-full flex items-center justify-center text-navy-900 font-display font-bold">
              AMA
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">
                Anshu Memorial Academy
              </p>
              <p className="text-saffron-400 text-xs">AnitaBindeshwar Foundation</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            A co-educational English medium institution committed to academic excellence
            and character formation. CBSE Pattern, Play to Class 8th.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-navy-800 hover:bg-saffron-500 rounded-full flex items-center justify-center transition-colors">
              <Facebook size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-navy-800 hover:bg-saffron-500 rounded-full flex items-center justify-center transition-colors">
              <Youtube size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-navy-800 hover:bg-saffron-500 rounded-full flex items-center justify-center transition-colors">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-saffron-400 text-sm transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-display font-bold text-white mb-4">Policies & Portals</h3>
          <ul className="space-y-2">
            {policies.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-saffron-400 text-sm transition-colors flex items-center gap-1.5">
                  <span className="text-saffron-500">›</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-saffron-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-400 text-sm">
                Bhatha Chowk, Bhatha Dasi,<br />
                Rajapakar, Vaishali,<br />
                Bihar – 844124
              </span>
            </li>
            <li>
              <a href="tel:9128289100" className="flex items-center gap-3 text-slate-400 hover:text-saffron-400 text-sm transition-colors">
                <Phone size={16} className="text-saffron-400 flex-shrink-0" />
                +91 91282 89100
              </a>
            </li>
            <li>
              <a href="tel:9973757920" className="flex items-center gap-3 text-slate-400 hover:text-saffron-400 text-sm transition-colors">
                <Phone size={16} className="text-saffron-400 flex-shrink-0" />
                +91 99737 57920
              </a>
            </li>
            <li>
              <a href="mailto:info@anshumemorial.in" className="flex items-center gap-3 text-slate-400 hover:text-saffron-400 text-sm transition-colors">
                <Mail size={16} className="text-saffron-400 flex-shrink-0" />
                info@anshumemorial.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-slate-500 text-xs">
            © {year} Anshu Memorial Academy. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Designed & Developed with ❤️ for education
          </p>
        </div>
      </div>
    </footer>
  );
}
