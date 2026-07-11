"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Database, UserCheck, Trash2, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201E] py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D9] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#888178] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C4B7A6]" />
              <span>VivahaLuxe Legal & Compliance</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#22201E]">Application Privacy Policy</h1>
            <p className="text-xs sm:text-sm text-[#55514C] mt-2">
              Effective Date: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • Enterprise Privacy Standard
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2.5 bg-[#22201E] text-[#FAF8F5] text-xs uppercase tracking-widest hover:bg-[#3A3632] transition-colors flex items-center gap-1.5 rounded-xs self-start sm:self-center shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Key Privacy Highlights (Directly addressing core commitments) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#22201E]">No Data Selling</h3>
            <p className="text-xs text-[#55514C] leading-relaxed">
              We do not use, trade, or sell any personal user data, celebration guest lists, or contact details to third-party advertisers or customers under any circumstance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#22201E]">PostgreSQL Security</h3>
            <p className="text-xs text-[#55514C] leading-relaxed">
              All account profiles, Google OAuth tokens, and wedding invitation data are stored safely with strict encryption inside our enterprise PostgreSQL database.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#22201E]">100% Account Deletion</h3>
            <p className="text-xs text-[#55514C] leading-relaxed">
              Users retain full sovereignty over their data. You can completely delete your account and wipe all associated personal records permanently at any time.
            </p>
          </div>
        </div>

        {/* Detailed Privacy Sections */}
        <div className="bg-white border border-[#E8E2D9] p-8 sm:p-10 rounded-sm shadow-xs space-y-8 text-xs sm:text-sm text-[#55514C] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>1. Strict Commitment Against Data Selling</span>
            </h2>
            <p className="font-semibold text-[#22201E] bg-[#FAF8F5] p-4 border-l-4 border-[#D4AF37] rounded-r-xs">
              &quot;We are not using any user data to sell to customers, advertisers, or external data brokers.&quot;
            </p>
            <p>
              Your personal identity, email address, wedding date, venue information, and RSVPs collected through VivahaLuxe are utilized strictly for the operation, rendering, and delivery of your digital invitations. We do not monetize your private information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>2. Pro AI Model Usage & Access Right</span>
            </h2>
            <p>
              VivahaLuxe integrates advanced generative artificial intelligence capabilities (including Google Gemini AI for invitation card image extraction and personalized SEO slug creation).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>
                <strong>Tiered Access:</strong> To ensure optimal computing performance and API security, advanced high-tier Pro AI models (`pro model`) and automated extraction tools are reserved strictly for authenticated paid/pro users.
              </li>
              <li>
                <strong>No AI Model Training on User Data:</strong> Content submitted for AI processing (such as uploaded wedding card scans or invitation text) is processed securely in memory via encrypted API connections and is never used to train public foundational AI models.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>3. Safe PostgreSQL & CockroachDB Data Storage</span>
            </h2>
            <p>
              We prioritize the physical and digital security of your data above all else:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>
                <strong>Database Architecture:</strong> All user records, couple studio configurations, and RSVP submissions are stored safely in an enterprise-grade, encrypted PostgreSQL / CockroachDB Serverless database cluster.
              </li>
              <li>
                <strong>In-Transit & At-Rest Encryption:</strong> All communication between your web browser, our authentication services (`/api/auth/google`), and our database cluster is encrypted using industry-standard TLS 1.3 / SSL encryption (`sslmode=require`).
              </li>
              <li>
                <strong>Google OAuth Tokens:</strong> When you sign in using Google Identity Services, we verify your Google-issued ID token via secure server-to-server validation. We do not store or access your Google account password or private Google Drive files.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>4. Full Right to Account Deletion & Data Erasure</span>
            </h2>
            <p>
              In full compliance with international privacy frameworks (GDPR, CCPA, and Digital Personal Data Protection standards), we empower every user with total data control:
            </p>
            <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#E8E2D9] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#22201E] text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Immediate & Irreversible Deletion Guarantee</span>
              </div>
              <p className="text-xs text-[#55514C]">
                Users are fully able to delete their account directly through their Studio Dashboard settings or by submitting a deletion request to our support concierge. When initiated, all associated user profiles, custom slugs, invitation cards, guest RSVPs, and authentication links are permanently purged from our active PostgreSQL database.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>5. Contact & Privacy Concerns</span>
            </h2>
            <p>
              If you have any questions regarding how your Google OAuth information or celebration data is handled, please reach out to our dedicated Privacy & Platform Engineering team:
            </p>
            <div className="text-xs text-[#22201E] font-mono bg-[#FAF8F5] p-3 rounded-xs border border-[#E8E2D9] inline-block">
              Email: ashwinachu9525@gmail.com • WhatsApp Support: +91 70124 06453
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-4 border-t border-[#E8E2D9] flex flex-wrap justify-center items-center gap-6 text-xs text-[#888178]">
          <Link href="/terms" className="hover:text-[#22201E] font-semibold transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/support" className="hover:text-[#22201E] font-semibold transition-colors">
            Help & Support Center
          </Link>
          <span>•</span>
          <Link href="/auth/login" className="hover:text-[#22201E] font-semibold transition-colors">
            Sign In to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
