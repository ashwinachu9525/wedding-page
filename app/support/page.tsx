"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MessageCircle, HelpCircle, Send, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, PhoneCall } from "lucide-react";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWhatsAppDirect = () => {
    const text = `Hello VivahaLuxe Support, I need assistance regarding my wedding invitation site & custom domain configuration.`;
    window.open(`https://api.whatsapp.com/send?phone=917012406453&text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Opening direct WhatsApp chat with Platform Engineer (+91 70124 06453)...");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
    toast.success("Your support inquiry has been logged! Our team will reach out via WhatsApp/Email shortly.");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201E] py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D9]">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#888178] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C4B7A6]" />
              <span>VivahaLuxe Help & Support Center</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#22201E]">How Can We Assist Your Celebration?</h1>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-[#22201E] text-[#FAF8F5] text-xs uppercase tracking-widest hover:bg-[#3A3632] transition-colors flex items-center gap-1.5 rounded-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Primary WhatsApp Support Action Card */}
        <div className="bg-gradient-to-br from-[#123826] to-[#0A2216] text-white p-8 sm:p-10 rounded-sm shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#25D366]/30">
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-[#25D366]/20 text-[#4ade80] px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest border border-[#25D366]/40">
              Instant Live Assistance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light">Direct WhatsApp Concierge</h2>
            <p className="text-xs sm:text-sm text-[#A3C1B4] max-w-lg leading-relaxed">
              Need custom domain connection on Vercel, theme customization assistance, or Super Admin configuration? Connect directly with our lead platform developer on WhatsApp.
            </p>
          </div>

          <button
            onClick={handleWhatsAppDirect}
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-3 shrink-0"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Chat on WhatsApp (+91 70124 06453)</span>
          </button>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl border-b border-[#E8E2D9] pb-3">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] shadow-2xs space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#22201E] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>How do I create a dynamic invitation link?</span>
              </h3>
              <p className="text-xs text-[#55514C] leading-relaxed">
                In your Admin Dashboard (`/admin`), go to the **WhatsApp Invite Studio** tab. You can specify custom couple names or guest names, pick one of 12 luxury card themes, and generate an SEO-friendly URL slug like `/invite/rahul-priya-2026`.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] shadow-2xs space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#22201E] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Can I host my wedding site on a custom domain?</span>
              </h3>
              <p className="text-xs text-[#55514C] leading-relaxed">
                Yes! When deployed on Vercel, simply enter your custom domain (e.g. `https://myroyalwedding.com`) in the domain configuration setting box. When you click send on WhatsApp, it automatically formats your exact live domain.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] shadow-2xs space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#22201E] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>How does Prisma & CockroachDB storage work?</span>
              </h3>
              <p className="text-xs text-[#55514C] leading-relaxed">
                Our application uses Prisma ORM configured for PostgreSQL / CockroachDB serverless storage. If your database connection is temporarily offline, our built-in high-availability fallback engine automatically stores your invitations locally!
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] shadow-2xs space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#22201E] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>What can Super Admins do?</span>
              </h3>
              <p className="text-xs text-[#55514C] leading-relaxed">
                Super Admins can view platform-wide analytics, monitor all active couple invitations, manage user accounts, and oversee global themes in the dedicated `/super-admin` portal.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-[#E8E2D9] p-8 rounded-sm shadow-2xs space-y-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl">Send a Support Ticket</h2>
            <p className="text-xs text-[#55514C] mt-1">Submit a query and our technical team will contact your phone or email.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xs text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="font-semibold text-green-900 text-sm">Inquiry Received Successfully</h3>
              <p className="text-xs text-green-700">We have received your message and will respond via WhatsApp within 15 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">WhatsApp Number / Email</label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. +91 70124 06453"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">Message / Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help optimize your wedding invitation experience..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D9] p-3.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#22201E] text-white px-8 py-3.5 rounded-xs text-xs uppercase tracking-widest font-semibold hover:bg-[#3A3632] transition-colors flex items-center gap-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
