"use client";

import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, AlertTriangle, ArrowLeft, Sparkles, Shield, Crown } from "lucide-react";

export default function TermsOfServicePage() {
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
            <h1 className="font-serif text-3xl sm:text-4xl text-[#22201E]">Terms of Service</h1>
            <p className="text-xs sm:text-sm text-[#55514C] mt-2">
              Effective Date: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • Platform Service Agreement
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

        {/* Quick Highlights Box */}
        <div className="bg-gradient-to-r from-[#1F1D1A] to-[#2E2B26] text-[#FAF8F5] p-6 sm:p-8 rounded-sm shadow-md border border-[#D4AF37]/30 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
            <Crown className="w-4 h-4" />
            <span>Core User Rights & Service Guarantees</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="bg-white/5 p-4 rounded-xs border border-white/10 space-y-1">
              <div className="font-semibold text-white">No Data Selling</div>
              <div className="text-[#C4B7A6] text-xs">We are not using any user data to sell to customers or third parties.</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xs border border-white/10 space-y-1">
              <div className="font-semibold text-white">Pro Model Access</div>
              <div className="text-[#C4B7A6] text-xs">Only paid users have the right to use advanced Pro AI models and custom automation.</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xs border border-white/10 space-y-1">
              <div className="font-semibold text-white">Full Account Sovereignty</div>
              <div className="text-[#C4B7A6] text-xs">Data is stored in PostgreSQL safely and users can delete their account fully anytime.</div>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white border border-[#E8E2D9] p-8 sm:p-10 rounded-sm shadow-xs space-y-8 text-xs sm:text-sm text-[#55514C] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>1. Acceptance of Service Terms</span>
            </h2>
            <p>
              By creating an account, accessing the VivahaLuxe Couple Studio, or utilizing our Google OAuth sign-in (`/api/auth/google`), you agree to be bound by these Terms of Service. If you do not agree to our terms of privacy, data protection, and usage tiers, you must discontinue use of the platform immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>2. User Data Ownership & Anti-Selling Policy</span>
            </h2>
            <p className="font-semibold text-[#22201E] bg-[#FAF8F5] p-4 border-l-4 border-[#22201E] rounded-r-xs">
              &quot;We are strictly not using any user data to sell to customers, commercial partners, or advertising aggregators.&quot;
            </p>
            <p>
              All invitation content, guest RSVPs, uploaded photographs, and couple biographies created on our platform remain your sole intellectual property. We do not claim ownership over your celebration data, nor do we harvest or syndicate your user profile data to external parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>3. Pro AI Model Usage Rights & Subscriptions</span>
            </h2>
            <p>
              To maintain high-quality rendering speeds, cloud resources, and secure generation limits, access to specific artificial intelligence features is structured by user tiers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Free / Demo Tier:</strong> Users utilizing demo accounts or standard free tiers are entitled to core invitation creation, standard theme selection, and basic link sharing.
              </li>
              <li>
                <strong>Paid / Pro Tier Rights:</strong> <strong>Right to use high-capacity Pro models (`pro model`) is strictly reserved for paid users.</strong> When you upgrade or subscribe to a paid plan, you unlock unlimited AI invitation card scanning, custom SEO slug customization, priority rendering queues, and premium custom domains.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>4. Safe PostgreSQL Storage & Account Deletion</span>
            </h2>
            <p>
              We provide enterprise-grade reliability and complete user autonomy over personal data lifecycle:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Safe PostgreSQL Storage:</strong> All user credentials, active sessions, and wedding profiles are safely stored inside our encrypted PostgreSQL / CockroachDB database cluster with continuous backup protection and strict access controls.
              </li>
              <li>
                <strong>Full Account Deletion Right:</strong> Every user has the absolute right and ability to delete their account fully from our database at any time. Initiating account deletion immediately removes all personal data, Google OAuth associations, invitation pages, and uploaded assets without hidden retention periods.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>5. Acceptable Use & Platform Integrity</span>
            </h2>
            <p>
              Users agree not to misuse the VivahaLuxe platform, attempt unauthorized scraping, inject malicious payloads into wedding invitation templates, or bypass tier restrictions to access paid Pro models without valid authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#22201E] flex items-center gap-2 border-b border-[#FAF8F5] pb-2">
              <span>6. Contact Information</span>
            </h2>
            <p>
              For inquiries regarding terms of service, tier upgrades, or account deletion support, please contact:
            </p>
            <div className="text-xs text-[#22201E] font-mono bg-[#FAF8F5] p-3 rounded-xs border border-[#E8E2D9] inline-block">
              Email: ashwinachu9525@gmail.com • WhatsApp Support: +91 70124 06453
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-4 border-t border-[#E8E2D9] flex flex-wrap justify-center items-center gap-6 text-xs text-[#888178]">
          <Link href="/privacy" className="hover:text-[#22201E] font-semibold transition-colors">
            Privacy Policy
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
