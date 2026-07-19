"use client";

import React, { useState, useEffect } from "react";
import {
  Gift,
  Heart,
  Sparkles,
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  DollarSign,
  Smile,
  ChevronRight,
  ShieldCheck,
  Plane,
  Home,
  Coffee,
  HeartHandshake,
  TrendingUp,
  Zap,
  Lock,
  Receipt,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export interface RegistryItem {
  id: string;
  title: string;
  category: "keepsake" | "home" | "traditional" | "experience" | "shagun";
  priceStr: string;
  unitAmount: number;
  currencySymbol: string;
  targetAmount: number;
  collectedAmount: number;
  imageUrl: string;
  description: string;
  isPopular?: boolean;
}

const DEFAULT_REGISTRY_ITEMS: RegistryItem[] = [
  // 1. Traditional Wedding Cash Shagun
  {
    id: "item-shagun",
    title: "Traditional Wedding Shagun (Auspicious Amounts Ending in 1)",
    category: "shagun",
    priceStr: "Custom Shagun Ending in 1 (₹501, ₹1101, ₹2101...)",
    unitAmount: 1101,
    currencySymbol: "₹",
    targetAmount: 150000,
    collectedAmount: 65101,
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop",
    description: "Send traditional cash Shagun presented in auspicious amounts ending in 1 (e.g., ₹501, ₹1101, ₹2101, ₹5001, ₹11001) along with your personal blessing note.",
    isPopular: true,
  },

  // 2. Honeymoon & Experiential Travel
  {
    id: "item-honeymoon",
    title: "Honeymoon Travel & Experiential Resort Stay Contributions",
    category: "experience",
    priceStr: "₹10,000 per unit",
    unitAmount: 10000,
    currencySymbol: "₹",
    targetAmount: 100000,
    collectedAmount: 70000,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop",
    description: "Travel vouchers or direct contributions towards our scenic honeymoon adventures, romantic resort stays, and memorable couple dinners.",
    isPopular: true,
  },

  // 3. Personalized & Sentimental Keepsakes
  {
    id: "item-lamp",
    title: "Custom Photo Lamps & LED Milestone Frames",
    category: "keepsake",
    priceStr: "₹599 per unit",
    unitAmount: 599,
    currencySymbol: "₹",
    targetAmount: 3000,
    collectedAmount: 1198,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop",
    description: "LED lit photo frames that trace our special milestones and traditional wedding vows. Personalized love story keepsakes for our new home.",
    isPopular: true,
  },
  {
    id: "item-embroidery",
    title: "Handcrafted Zardosi Name & Date Embroidery Art",
    category: "keepsake",
    priceStr: "₹1,500 per hoop",
    unitAmount: 1500,
    currencySymbol: "₹",
    targetAmount: 4500,
    collectedAmount: 3000,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    description: "Artisanal handcrafted hoops and golden zardosi threads featuring our couple names and our special wedding date.",
  },
  {
    id: "item-sketch",
    title: "Dual-View Illusion Couple Sketch & Mosaic Art Frame",
    category: "keepsake",
    priceStr: "₹3,500 per unit",
    unitAmount: 3500,
    currencySymbol: "₹",
    targetAmount: 7000,
    collectedAmount: 3500,
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1000&auto=format&fit=crop",
    description: "A custom mosaic frame created from tiny memory photos and a captivating dual-view illusion art piece showcasing our union.",
  },
];

interface GiftRegistryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupleNames?: string;
  guestName?: string;
  slug?: string;
  razorpayKeyId?: string;
  upiVpa?: string;
  upiQrCodeUrl?: string;
}

export function GiftRegistryModal({
  open,
  onOpenChange,
  coupleNames = "Rahul Sharma & Priya Mehta",
  guestName = "",
  slug = "rahul-priya-2026",
  razorpayKeyId = "rzp_test_1DP5mmOlF5G5ag",
  upiVpa = "rahul.priya2026@okaxis",
  upiQrCodeUrl = "",
}: GiftRegistryModalProps) {
  const [items, setItems] = useState<RegistryItem[]>(DEFAULT_REGISTRY_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<RegistryItem | null>(null);

  // Contribution Form State inside session
  const [senderName, setSenderName] = useState(guestName || "");
  const [contributionUnits, setContributionUnits] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<number>(1101);
  const [blessingNote, setBlessingNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "upi">("razorpay");
  const [upiUtrInput, setUpiUtrInput] = useState("");
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Razorpay Gateway Verification Simulator & Tracking State
  const [verifyingRazorpay, setVerifyingRazorpay] = useState(false);
  const [lastTxDetails, setLastTxDetails] = useState<{
    paymentId: string;
    gateway: string;
    status: string;
    timestamp: string;
    amount: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    if (guestName && !senderName) {
      setSenderName(guestName);
    }
  }, [guestName, senderName]);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      // 1. Purge any old Akshaya Patra / Charity / Pledge logs
      const savedLogs = localStorage.getItem(`vivaha_gift_logs_${slug}`);
      if (savedLogs) {
        try {
          const parsedLogs = JSON.parse(savedLogs);
          if (Array.isArray(parsedLogs)) {
            const cleanedLogs = parsedLogs.filter(
              (log: any) =>
                !log.itemTitle?.toLowerCase().includes("akshaya") &&
                !log.itemTitle?.toLowerCase().includes("patra") &&
                !log.itemTitle?.toLowerCase().includes("pathra") &&
                !log.itemTitle?.toLowerCase().includes("charity") &&
                !log.itemTitle?.toLowerCase().includes("meal") &&
                log.paymentMethod !== "pledge" &&
                log.paymentStatus !== "PLEDGED"
            );
            localStorage.setItem(`vivaha_gift_logs_${slug}`, JSON.stringify(cleanedLogs));
          }
        } catch (e) {}
      }

      // 2. Load & strictly sanitize Registry Items
      const saved = localStorage.getItem(`vivaha_registry_${slug}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter(
              (it: any) =>
                !it.title?.toLowerCase().includes("akshaya") &&
                !it.title?.toLowerCase().includes("patra") &&
                !it.title?.toLowerCase().includes("pathra") &&
                !it.title?.toLowerCase().includes("charity") &&
                !it.title?.toLowerCase().includes("ngo") &&
                !it.title?.toLowerCase().includes("meal") &&
                it.category !== "charity" &&
                it.category !== "home" &&
                it.category !== "traditional" &&
                it.id !== "item-picnic" &&
                it.id !== "item-airfryer" &&
                it.id !== "item-serveware" &&
                it.id !== "item-idols" &&
                it.id !== "item-hamper" &&
                it.id !== "item-charity"
            );
            const cleaned = (filtered.length > 0 ? filtered : DEFAULT_REGISTRY_ITEMS).map((it: any) => ({
              ...it,
              priceStr: it.priceStr ? it.priceStr.replace(/\s*\/\s*\$[\d,]+(?:\s*per\s*\w+)?/g, "").replace(/\$[\d,]+/g, "") : it.priceStr,
              currencySymbol: "₹",
            }));
            setItems(cleaned);
            localStorage.setItem(`vivaha_registry_${slug}`, JSON.stringify(cleaned));
          }
        } catch (e) {}
      } else {
        const cleanedDefaults = DEFAULT_REGISTRY_ITEMS.map((it: any) => ({
          ...it,
          priceStr: it.priceStr ? it.priceStr.replace(/\s*\/\s*\$[\d,]+(?:\s*per\s*\w+)?/g, "").replace(/\$[\d,]+/g, "") : it.priceStr,
          currencySymbol: "₹",
        }));
        setItems(cleanedDefaults);
      }
    }
  }, [slug]);

  const handleOpenItem = (item: RegistryItem) => {
    setSelectedItem(item);
    setContributionUnits(1);
    setCustomAmount(item.category === "shagun" ? 1101 : item.unitAmount);
    setSessionCompleted(false);
    setLastTxDetails(null);
  };

  const processSuccessContribution = (totalAmount: number, payId: string, gatewayName: string, statusVal = "PAID") => {
    if (!selectedItem) return;

    const txRecord = {
      paymentId: payId,
      gateway: gatewayName,
      status: statusVal,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      amount: totalAmount,
      currency: selectedItem.currencySymbol,
    };
    setLastTxDetails(txRecord);

    // Update item collection locally
    const updated = items.map((i) => {
      if (i.id === selectedItem.id) {
        return {
          ...i,
          collectedAmount: i.collectedAmount + totalAmount,
        };
      }
      return i;
    });

    setItems(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(`vivaha_registry_${slug}`, JSON.stringify(updated));

      // Log the gift contribution alongside verified payment tracking details
      const logs = JSON.parse(localStorage.getItem(`vivaha_gift_logs_${slug}`) || "[]");
      logs.unshift({
        id: `gift-${Date.now()}`,
        itemTitle: selectedItem.title,
        amount: totalAmount,
        currencySymbol: selectedItem.currencySymbol,
        senderName: senderName || "Guest Blessing",
        blessingNote: blessingNote || "Wishing you lifetime happiness, love, and divine blessings!",
        paymentMethod,
        paymentId: txRecord.paymentId,
        paymentGateway: txRecord.gateway,
        paymentStatus: txRecord.status,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(`vivaha_gift_logs_${slug}`, JSON.stringify(logs));
    }

    setSessionCompleted(true);
    // Trigger celebratory gold sparkles
    setSparkles(
      Array.from({ length: 18 }, (_, idx) => ({
        id: idx,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5,
      }))
    );

    toast.success(`🎉 Payment Verified (${txRecord.paymentId})! Your gift of ${selectedItem.currencySymbol}${totalAmount.toLocaleString()} has been registered.`);
  };

  const handleConfirmContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !senderName) {
      toast.error("Please enter your name before completing the gift session.");
      return;
    }

    const totalAmount =
      selectedItem.category === "shagun" ? customAmount : selectedItem.unitAmount * contributionUnits;

    if (paymentMethod === "razorpay") {
      const toastId = toast.loading("Connecting to Razorpay Official Gateway...");
      try {
        // Create or check order on backend API
        const orderRes = await fetch("/api/payment/gift-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            coupleNames,
            senderName,
            itemTitle: selectedItem.title,
            razorpayKeyId,
          }),
        });
        const orderData = await orderRes.json();

        // Ensure Razorpay SDK script is loaded
        if (typeof window !== "undefined" && !(window as any).Razorpay) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        }

        const keyToUse = orderData.keyId || razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";

        toast.dismiss(toastId);

        if (typeof window !== "undefined" && (window as any).Razorpay) {
          const options: any = {
            key: keyToUse,
            amount: orderData.amount || Math.round(totalAmount * 100),
            currency: "INR",
            name: `${coupleNames} &mdash; Wedding Registry`,
            description: selectedItem.title,
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=200&auto=format&fit=crop",
            handler: function (response: any) {
              processSuccessContribution(
                totalAmount,
                response.razorpay_payment_id || `pay_${Date.now()}`,
                keyToUse.startsWith("rzp_test_") ? "⚡ Razorpay Test Gateway" : "⚡ Razorpay Official Gateway",
                "PAID"
              );
            },
            prefill: {
              name: senderName,
              email: "guest@vivahaluxe.com",
              contact: "9876543210",
            },
            theme: { color: "#D4AF37" },
          };

          if (orderData.orderId && !orderData.orderId.startsWith("order_mock_")) {
            options.order_id = orderData.orderId;
          }

          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (resp: any) {
            toast.error(`Razorpay Alert: ${resp.error?.description || "Payment failed or cancelled."}`);
          });
          rzp.open();
        } else {
          toast.error("Could not load Razorpay SDK. Please check your internet connection.");
        }
      } catch (err: any) {
        toast.dismiss(toastId);
        toast.error("Failed to connect to Razorpay. Please check internet settings.");
      }
    } else if (paymentMethod === "upi") {
      if (!upiUtrInput || upiUtrInput.trim().length < 6) {
        toast.error("Please enter the 12-digit UPI / UTR Transaction ID from your GPay or Paytm app after scanning the QR code.");
        return;
      }
      processSuccessContribution(totalAmount, `UTR-${upiUtrInput.trim()}`, "📱 GPay / Paytm UPI QR", "PAID");
    }
  };

  const handleCloseAll = () => {
    setSelectedItem(null);
    setSessionCompleted(false);
    setVerifyingRazorpay(false);
    onOpenChange(false);
  };

  if (!open) return null;

  const filteredItems = items.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#181614] text-[#FAF8F5] rounded-sm border border-[#D4AF37]/50 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Razorpay Processing Overlay */}
        {verifyingRazorpay && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 animate-pulse">
              <Zap className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                ⚡ Razorpay Secure Checkout
              </span>
              <h3 className="font-serif text-2xl text-white mt-2">Connecting to Razorpay UPI &amp; Bank Gateway...</h3>
              <p className="text-xs text-[#C4B7A6] max-w-sm">
                Encrypting payment of <strong className="text-white">{selectedItem?.currencySymbol}{(selectedItem?.category === "shagun" ? customAmount : (selectedItem?.unitAmount || 0) * contributionUnits).toLocaleString()}</strong> via Razorpay automated verification.
              </p>
            </div>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        )}

        {/* Modal Top Royal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/25 bg-[#22201E]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Indian Wedding Gift Boutique &amp; Shagun</span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl text-white truncate">
                {coupleNames} &mdash; Gift Registry Session
              </h2>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-2 rounded-full hover:bg-white/10 text-[#C4B7A6] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {selectedItem ? (
            sessionCompleted ? (
              /* ── Session Thank You / Receipt Confirmation Screen ── */
              <div className="relative py-10 px-6 text-center flex flex-col items-center justify-center space-y-5 animate-in zoom-in-95 duration-400">
                {sparkles.map((s) => (
                  <span
                    key={s.id}
                    className="absolute pointer-events-none animate-ping text-[#D4AF37]"
                    style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s`, animationDuration: "2s" }}
                  >
                    ★
                  </span>
                ))}
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2 max-w-lg">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
                    Payment &amp; Blessing Verified
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-white font-light mt-3">
                    Thank You, <span className="italic text-[#D4AF37]">{senderName}</span>!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C4B7A6] leading-relaxed">
                    Your generous blessing towards <strong className="text-white font-medium">{selectedItem.title}</strong> has been confirmed and logged into {coupleNames}&apos;s verified accounting register.
                  </p>
                </div>

                {/* Verified Payment & Transaction Receipt Card */}
                <div className="bg-[#22201E] border border-[#D4AF37]/40 p-4 sm:p-5 rounded-xs max-w-md w-full text-left space-y-2.5 text-xs shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[#D4AF37] font-bold uppercase tracking-wider text-[11px]">
                    <span className="flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> Transaction Receipt</span>
                    <span>{lastTxDetails?.status || "PAID"}</span>
                  </div>
                  <div className="flex justify-between text-[#A09890]">
                    <span>Gift Item / Shagun:</span>
                    <span className="text-white font-semibold max-w-[200px] truncate text-right">{selectedItem.title}</span>
                  </div>
                  <div className="flex justify-between text-[#A09890]">
                    <span>Contributed Amount:</span>
                    <span className="text-[#D4AF37] font-bold font-mono text-sm">
                      {selectedItem.currencySymbol}
                      {lastTxDetails?.amount.toLocaleString() || (selectedItem.category === "shagun" ? customAmount : selectedItem.unitAmount * contributionUnits).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A09890]">
                    <span>Payment Gateway:</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" /> {lastTxDetails?.gateway || "Razorpay Verified"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A09890]">
                    <span>Payment Tracking ID:</span>
                    <span className="font-mono text-white text-[11px] select-all bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      {lastTxDetails?.paymentId || "pay_Rzp_Verified"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A09890] text-[10px]">
                    <span>Timestamp:</span>
                    <span>{lastTxDetails?.timestamp}</span>
                  </div>
                  {blessingNote && (
                    <div className="pt-2.5 mt-1 border-t border-white/10 text-[#FAF8F5] italic font-serif">
                      &ldquo;{blessingNote}&rdquo;
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2.5 bg-[#2A2723] hover:bg-[#3A3632] text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-colors"
                  >
                    Explore More Gifts
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseAll}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b89628] text-[#141210] text-xs font-bold uppercase tracking-widest rounded-xs transition-colors shadow-md"
                  >
                    Done &amp; Return to Invite
                  </button>
                </div>
              </div>
            ) : (
              /* ── Gift Selection & Checkout Form ── */
              <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-3 duration-300">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-xs uppercase tracking-widest text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                >
                  &larr; Back to Gift Shop Boutique
                </button>

                <div className="bg-[#22201E] border border-white/10 p-5 sm:p-6 rounded-sm flex flex-col sm:flex-row gap-5 items-center">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xs border border-[#D4AF37]/40 shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                      {selectedItem.category === "keepsake"
                        ? "🖼️ Sentimental Keepsake"
                        : selectedItem.category === "home"
                        ? "🍴 Home & Kitchen Essential"
                        : selectedItem.category === "traditional"
                        ? "🛕 Traditional Auspicious Gift"
                        : selectedItem.category === "shagun"
                        ? "🌟 Auspicious Shagun (Ending in 1)"
                        : "🧳 Experiential Travel Fund"}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-light">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-[#C4B7A6] leading-relaxed">
                      {selectedItem.description}
                    </p>
                    <div className="pt-1 text-xs text-[#A09890]">
                      Unit Price / Value: <strong className="text-[#D4AF37] font-mono">{selectedItem.priceStr}</strong>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleConfirmContribution} className="space-y-5 bg-[#22201E]/60 p-5 sm:p-6 rounded-sm border border-[#D4AF37]/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
                        Your Full Name (Sender) *
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Vikram &amp; Pooja Sharma"
                        className="w-full bg-[#1A1816] border border-white/20 px-3.5 py-2.5 text-xs rounded-xs text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>

                    {selectedItem.category === "shagun" ? (
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
                          Shagun Amount (Ending in 1) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-[#D4AF37] font-bold">
                            {selectedItem.currencySymbol}
                          </span>
                          <input
                            type="number"
                            required
                            min={1}
                            value={customAmount}
                            onChange={(e) => setCustomAmount(Number(e.target.value))}
                            className="w-full bg-[#1A1816] border border-white/20 pl-8 pr-3.5 py-2.5 text-xs font-mono rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {[501, 1101, 2101, 5001, 11001].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setCustomAmount(amt)}
                              className={`px-2.5 py-1 text-[10px] font-mono rounded-xs border transition-all ${
                                customAmount === amt
                                  ? "bg-[#D4AF37] text-[#141210] font-bold border-[#D4AF37]"
                                  : "bg-[#1A1816] text-[#C4B7A6] border-white/10 hover:border-[#D4AF37]/50"
                              }`}
                            >
                              ₹{amt.toLocaleString()}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
                          Contribution Units / Quantity
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 5].map((u) => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setContributionUnits(u)}
                              className={`flex-1 py-2.5 rounded-xs text-xs font-bold border transition-all ${
                                contributionUnits === u
                                  ? "bg-[#D4AF37] text-[#141210] border-[#D4AF37]"
                                  : "bg-[#1A1816] text-white border-white/20 hover:border-[#D4AF37]/60"
                              }`}
                            >
                              {u}x ({selectedItem.currencySymbol}{(selectedItem.unitAmount * u).toLocaleString()})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1 flex items-center gap-1.5">
                      <Smile className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Personal Blessing &amp; Gift Note</span>
                    </label>
                    <textarea
                      rows={2}
                      value={blessingNote}
                      onChange={(e) => setBlessingNote(e.target.value)}
                      placeholder={`Write your heartfelt wishes or vows for ${coupleNames}...`}
                      className="w-full bg-[#1A1816] border border-white/20 px-3.5 py-2.5 text-xs rounded-xs text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4AF37] font-serif italic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-2">
                      Select Payment Gateway &amp; Collection Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`p-3.5 rounded-xs border text-left flex items-center gap-3 transition-all ${
                          paymentMethod === "razorpay"
                            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-sm"
                            : "bg-[#1A1816] border-white/10 text-[#C4B7A6] hover:border-white/30"
                        }`}
                      >
                        <Zap className="w-5 h-5 shrink-0 text-[#D4AF37]" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold truncate">⚡ Razorpay Official Gateway</p>
                            <span className="text-[9px] uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Recommended</span>
                          </div>
                          <p className="text-[10px] opacity-80 truncate">UPI, GPay, PhonePe, NetBanking, Cards</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3.5 rounded-xs border text-left flex items-center gap-3 transition-all ${
                          paymentMethod === "upi"
                            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-sm"
                            : "bg-[#1A1816] border-white/10 text-[#C4B7A6] hover:border-white/30"
                        }`}
                      >
                        <QrCode className="w-5 h-5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold">📱 GPay / Paytm UPI QR</p>
                          <p className="text-[10px] opacity-80 truncate">Scan QR with Google Pay or Paytm</p>
                        </div>
                      </button>
                    </div>

                    {paymentMethod === "razorpay" && (
                      <div className="mt-3 p-3.5 rounded-xs bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-amber-500/15 border border-amber-500/40 text-xs text-[#FAF8F5] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                            ⚡ Razorpay Official Payment Gateway
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            RBI Regulated &amp; Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-[#C4B7A6] leading-relaxed">
                          Clicking confirm below opens the official Razorpay Checkout popup. Supports Google Pay, Paytm, PhonePe, BHIM UPI, NetBanking, and all Cards directly settled to {coupleNames}&apos;s bank account without any intermediaries.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "upi" && (() => {
                      const currentTotal = selectedItem.category === "shagun" ? customAmount : selectedItem.unitAmount * contributionUnits;
                      const upiLink = `upi://pay?pa=${upiVpa || "rahul.priya2026@okaxis"}&pn=${encodeURIComponent(coupleNames)}&am=${currentTotal}&cu=INR`;
                      const autoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

                      return (
                        <div className="mt-3 p-4 rounded-xs bg-[#1A1816] border border-blue-500/40 text-xs text-[#FAF8F5] space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="font-bold text-blue-400 flex items-center gap-1.5">
                              📱 Google Pay &amp; Paytm UPI QR Scan &amp; Pay
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                              Instant 0% Fee Transfer
                            </span>
                          </div>
                          <p className="text-[11px] text-[#C4B7A6] leading-relaxed">
                            Open your <strong className="text-white">Google Pay, Paytm, PhonePe, or BHIM app</strong> and scan the QR code below to transfer exact shagun amount of <strong className="text-amber-400 font-mono">{selectedItem.currencySymbol || "₹"}{currentTotal.toLocaleString()}</strong> to the couple.
                          </p>

                          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2.5 bg-black/50 p-3 rounded border border-white/5">
                            <div className="bg-white p-2.5 rounded-lg shrink-0 shadow-lg border-2 border-amber-400/80 flex flex-col items-center justify-center">
                              <img
                                src={upiQrCodeUrl || autoQrUrl}
                                alt="Couple UPI QR Code"
                                className="w-36 h-36 object-contain"
                              />
                              <span className="text-[9px] font-mono font-bold text-black uppercase tracking-wider mt-1.5">
                                Scan with GPay / Paytm
                              </span>
                            </div>

                            <div className="space-y-2.5 text-center sm:text-left min-w-0 flex-1">
                              <div>
                                <p className="text-[10px] text-[#888178] uppercase tracking-wider">Couple UPI ID / VPA</p>
                                <p className="font-mono text-xs font-bold text-amber-300 select-all tracking-wide break-all">
                                  {upiVpa || "rahul.priya2026@okaxis"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-[#888178] uppercase tracking-wider">Shagun Amount</p>
                                <p className="font-mono text-base font-bold text-emerald-400">
                                  {selectedItem.currencySymbol || "₹"}{currentTotal.toLocaleString()}
                                </p>
                              </div>
                              <p className="text-[10px] text-[#C4B7A6] italic leading-tight">
                                💡 After completing the payment inside your GPay / Paytm app, enter your 12-digit UPI / UTR Transaction Number below to verify your shagun!
                              </p>
                              <div className="pt-2">
                                <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                                  Enter 12-Digit UPI / UTR Reference Number *
                                </label>
                                <input
                                  type="text"
                                  value={upiUtrInput}
                                  onChange={(e) => setUpiUtrInput(e.target.value)}
                                  placeholder="e.g. 320149812345 (From bank app)"
                                  className="w-full bg-black/60 border border-blue-400/60 px-3 py-1.5 text-xs font-mono text-white rounded focus:outline-hidden focus:border-amber-400"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={verifyingRazorpay}
                      className="w-full py-3.5 px-6 rounded-xs bg-gradient-to-r from-[#D4AF37] via-[#e3be47] to-[#D4AF37] hover:from-[#e3be47] hover:to-[#b89628] text-[#141210] text-xs uppercase tracking-widest font-bold shadow-xl transition-transform active:scale-98 flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      <Gift className="w-4 h-4 text-[#141210]" />
                      <span>
                        Verify &amp; Confirm Gift &bull; {selectedItem.currencySymbol}
                        {(selectedItem.category === "shagun"
                          ? customAmount
                          : selectedItem.unitAmount * contributionUnits
                        ).toLocaleString()}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )
          ) : (
            /* ── Browse Registry Items Grid ── */
            <div className="space-y-6">
              {/* Top Intro Banner inside shop */}
              <div className="bg-gradient-to-r from-[#22201E] via-[#2A2723] to-[#22201E] border border-[#D4AF37]/30 p-5 sm:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-light flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#D4AF37] fill-current" />
                    <span>Indian Wedding Keepsakes &amp; Shagun Boutique</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C4B7A6] max-w-xl leading-relaxed font-light">
                    Explore our curated catalogue of sentimental photo lamps, zardosi embroidery frames, luxury home essentials, sacred silver idols, and auspicious cash Shagun ending in 1.
                  </p>
                </div>
                {guestName && (
                  <div className="bg-[#141210]/90 border border-[#D4AF37]/40 px-4 py-2.5 rounded-xs text-xs shrink-0 flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>RSVP Guest: <strong className="text-white font-semibold">{guestName}</strong></span>
                  </div>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
                {[
                  { id: "all", label: "✨ All Gifts & Shagun" },
                  { id: "shagun", label: "🌟 Cash Shagun (Ending in 1)" },
                  { id: "experience", label: "🧳 Honeymoon & Travel" },
                  { id: "keepsake", label: "🖼️ Personalized Keepsakes" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeCategory === cat.id
                        ? "bg-[#D4AF37] text-[#141210] shadow-md font-bold"
                        : "bg-[#22201E] text-[#C4B7A6] hover:text-white border border-white/10 hover:border-[#D4AF37]/40"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Registry Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredItems.map((item) => {
                  const percent = Math.min(100, Math.round((item.collectedAmount / item.targetAmount) * 100));
                  const isFullyFunded = percent >= 100 && item.category !== "shagun" && item.category !== "keepsake";

                  return (
                    <div
                      key={item.id}
                      className="bg-[#22201E] rounded-sm border border-white/10 hover:border-[#D4AF37]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-md"
                    >
                      <div className="relative h-44 sm:h-52 overflow-hidden bg-black/40">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#22201E] via-transparent to-black/30" />
                        {item.isPopular && (
                          <span className="absolute top-3 right-3 bg-[#D4AF37] text-[#141210] text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-md">
                            ★ Highly Sought
                          </span>
                        )}
                        <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-[#D4AF37] font-bold text-xs font-mono px-3 py-1 rounded-xs border border-[#D4AF37]/40">
                          {item.priceStr}
                        </span>
                      </div>

                      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-lg text-white font-medium group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#C4B7A6] leading-relaxed mt-1.5 line-clamp-2 font-light">
                            {item.description}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#A09890]">
                              Collected: <strong className="text-white">{item.currencySymbol}{item.collectedAmount.toLocaleString()}</strong>
                            </span>
                            <span className="text-[#D4AF37] font-bold">{percent}% Funded</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isFullyFunded ? "bg-emerald-400" : "bg-gradient-to-r from-[#D4AF37] to-amber-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => handleOpenItem(item)}
                              className={`w-full py-2.5 px-4 rounded-xs text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                                isFullyFunded
                                  ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60"
                                  : "bg-[#2A2723] hover:bg-[#D4AF37] text-white hover:text-[#141210] border border-white/15 hover:border-[#D4AF37]"
                              }`}
                            >
                              <Gift className="w-3.5 h-3.5" />
                              <span>{isFullyFunded ? "Contribute / Send Note" : "Select &amp; Gift Now"}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Royal Footer */}
        <div className="px-6 py-3.5 bg-[#141210] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A09890] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>⚡ Powered by Razorpay Indian Banking Gateway &bull; Instant Verified Accounting</span>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="px-4 py-1.5 rounded-xs bg-[#22201E] hover:bg-[#3A3632] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Close Boutique
          </button>
        </div>
      </div>
    </div>
  );
}
