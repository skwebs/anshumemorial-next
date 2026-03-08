import "./globals.css";
// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default:
      "Anshu Memorial Academy – CBSE English Medium School, Vaishali Bihar",
    template: "%s | Anshu Memorial Academy",
  },
  description:
    "Anshu Memorial Academy – A premier English medium school in Bhatha Dasi, Rajapakar, Vaishali, Bihar offering CBSE pattern education from Play to Class 8th. Run by AnitaBindeshwar Foundation.",
  keywords: [
    "Anshu Memorial Academy",
    "AMA school",
    "CBSE school Vaishali Bihar",
    "English medium school Rajapakar",
    "school Bihar",
    "admission 2025",
  ],
  authors: [{ name: "Anshu Memorial Academy" }],
  openGraph: {
    title: "Anshu Memorial Academy",
    description: "CBSE Pattern English Medium School, Vaishali Bihar",
    url: "https://anshumemorial.in",
    siteName: "Anshu Memorial Academy",
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081629",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
