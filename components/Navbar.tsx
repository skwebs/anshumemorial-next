"use client";
// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home",       href: "/" },
  { label: "About",      href: "/about" },
  {
    label: "Academics",
    href: "#",
    children: [
      { label: "Admissions",  href: "/admissions" },
      { label: "Results",     href: "/results" },
      { label: "Syllabus",    href: "/academics" },
      { label: "Time Table",  href: "/timetable" },
    ],
  },
  { label: "Faculty",    href: "/faculty" },
  { label: "Gallery",    href: "/gallery" },
  { label: "Notices",    href: "/notices" },
  { label: "Contact",    href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-navy-900 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-slate-300">
            Bhatha Chowk, Bhatha Dasi, Rajapakar, Vaishali, Bihar-844124
          </span>
          <div className="flex items-center gap-4">
            <a href="tel:9128289100" className="flex items-center gap-1 hover:text-saffron-400 transition-colors">
              <Phone size={12} />
              9128289100
            </a>
            <span className="text-slate-500">|</span>
            <a href="mailto:info@anshumemorial.in" className="hover:text-saffron-400 transition-colors">
              info@anshumemorial.in
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-navy-800 rounded-full flex items-center justify-center text-white font-display font-bold text-lg shadow-md">
                AMA
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-bold text-navy-900 text-base leading-tight">
                  Anshu Memorial Academy
                </p>
                <p className="text-xs text-saffron-600 font-semibold">
                  CBSE Pattern · English Medium
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative group">
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-navy-800 rounded-lg hover:bg-navy-50 transition-colors"
                      onMouseEnter={() => setDropdown(link.label)}
                      onMouseLeave={() => setDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown size={14} />
                    </button>
                    {/* Dropdown */}
                    <div
                      className={cn(
                        "absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 transition-all duration-200",
                        dropdown === link.label
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      )}
                      onMouseEnter={() => setDropdown(link.label)}
                      onMouseLeave={() => setDropdown(null)}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:text-navy-800 hover:bg-navy-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-navy-800 rounded-lg hover:bg-navy-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link href="/admissions" className="ml-2 btn-saffron text-sm py-2 px-5">
                Apply Now
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg text-navy-800 hover:bg-navy-50"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-slate-100",
            open ? "max-h-screen pb-4" : "max-h-0"
          )}
        >
          <div className="px-4 pt-2 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-bold text-saffron-600 uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block pl-6 pr-3 py-2 text-sm text-slate-700 hover:text-navy-800 hover:bg-navy-50 rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-navy-800 hover:bg-navy-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="block mt-2 btn-saffron text-center text-sm"
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
