"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getInvitationBySlug, getAllInvitations } from "@/lib/mock-storage";
import {
  Upload,
  Video,
  Image as ImageIcon,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Users,
  Layout,
  Check,
  Send,
  MessageCircle,
  Copy,
  Share2,
  ExternalLink,
  Globe,
  ShieldCheck,
  HelpCircle,
  Film,
  Calendar,
  Music,
  MapPin,
  Building2,
  LogOut,
  Printer,
  Package,
  Truck,
  Clock,
  Eye,
  CreditCard,
  Crown,
  Receipt,
  Zap,
} from "lucide-react";
import AdBanner from "@/components/AdBanner";
import { useRazorpay } from "@/hooks/useRazorpay";

type ThemeKey =
  | "alabaster"
  | "velvet"
  | "emerald"
  | "rose"
  | "marigold"
  | "mysore"
  | "crimson"
  | "ivory"
  | "peacock"
  | "lotus"
  | "sandalwood"
  | "banarasi";

const INVITE_THEMES: { key: ThemeKey; name: string; bgClass: string; textClass: string; borderClass: string }[] = [
  { key: "alabaster", name: "Alabaster Cream", bgClass: "bg-[#FAF8F5]", textClass: "text-[#22201E]", borderClass: "border-[#C4B7A6]" },
  { key: "velvet", name: "Midnight Velvet", bgClass: "bg-[#1F1D1A]", textClass: "text-[#FAF8F5]", borderClass: "border-[#D4AF37]" },
  { key: "emerald", name: "Heritage Emerald", bgClass: "bg-[#112A21]", textClass: "text-[#FAF8F5]", borderClass: "border-[#D4AF37]" },
  { key: "rose", name: "Jaipur Rose Palace", bgClass: "bg-[#FFF8F8]", textClass: "text-[#4A1D24]", borderClass: "border-[#D48C9A]" },
  { key: "marigold", name: "Sunset Marigold", bgClass: "bg-[#2A1808]", textClass: "text-[#FFF6ED]", borderClass: "border-[#E8984E]" },
  { key: "mysore", name: "Mysore Royal Silk", bgClass: "bg-[#0A1628]", textClass: "text-[#F3EAD8]", borderClass: "border-[#C5A059]" },
  { key: "crimson", name: "Kanchipuram Crimson", bgClass: "bg-[#380B10]", textClass: "text-[#FCEEE3]", borderClass: "border-[#E6C280]" },
  { key: "ivory", name: "Minimalist Ivory", bgClass: "bg-[#FFFFFF]", textClass: "text-[#1F1D1A]", borderClass: "border-[#E0DCD5]" },
  { key: "peacock", name: "Royal Peacock Teal", bgClass: "bg-[#0A2229]", textClass: "text-[#E8F8FA]", borderClass: "border-[#38A3A5]" },
  { key: "lotus", name: "Sacred Pink Lotus", bgClass: "bg-[#FFF0F5]", textClass: "text-[#5C1D34]", borderClass: "border-[#D8829D]" },
  { key: "sandalwood", name: "Mysore Sandalwood", bgClass: "bg-[#2A2019]", textClass: "text-[#F3E6DA]", borderClass: "border-[#C19A6B]" },
];

const BUILTIN_MUSIC_TRACKS = [
  { name: "🎹 Romantic Piano Serenade (Mixkit)", url: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-136.mp3" },
  { name: "🪈 Royal Shehnai & Flute Harmony", url: "https://assets.mixkit.co/music/preview/mixkit-wedding-bliss-600.mp3" },
  { name: "🎻 Sufi Acoustic Love Melody", url: "https://assets.mixkit.co/music/preview/mixkit-serenade-for-two-613.mp3" },
  { name: "🎸 Acoustic Guitar Celebration", url: "https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3" },
  { name: "🪕 Classical Veena & Strings Gala", url: "https://assets.mixkit.co/music/preview/mixkit-gentle-love-serenade-499.mp3" },
  { name: "📁 Custom File: /music/royal-piano.mp3", url: "/music/royal-piano.mp3" },
  { name: "📁 Custom File: /music/shehnai-flute.mp3", url: "/music/shehnai-flute.mp3" },
  { name: "📁 Custom File: /music/sufi-melody.mp3", url: "/music/sufi-melody.mp3" },
];

const PRINT_CARD_DESIGNS = [
  {
    id: "banarasi",
    sku: "KNKC4076",
    name: "Wedding Invitations - Arch Floral Bi-Fold",
    price: 306.80,
    desc: "Elegant bi-fold arch wedding invitations with couple photo display frame and floral border.",
    previewImg: "https://printo-s3.dietpixels.net/site/2024/Invitations/1280/Wedding_1735680512.jpg",
    gallery: [
      "https://printo-s3.dietpixels.net/site/2024/Invitations/1280/Wedding_1735680512.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitations/New/Wedding-Invitations_1735759374.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/Shape-chart_1718599323.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/All_1718608973.jpg",
    ],
    dimensions: "Available in A5, DL and A6 • 350 GSM Velvet Matte",
  },
  {
    id: "mysore",
    sku: "KNKC4088",
    name: "Luxury Gold Foil Flat Invitation Suite",
    price: 240.00,
    desc: "Premium flat cardstock with gold embossed traditional motifs and matching envelope.",
    previewImg: "https://printo-s3.dietpixels.net/site/2024/Invitations/New/Wedding-Invitations_1735759374.jpg",
    gallery: [
      "https://printo-s3.dietpixels.net/site/2024/Invitations/New/Wedding-Invitations_1735759374.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitations/1280/Wedding_1735680512.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/Shape-chart_1718599323.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/All_1718608973.jpg",
    ],
    dimensions: "Available in A5, DL and A6 • Smooth Luxury Paper",
  },
  {
    id: "sandalwood",
    sku: "KNKC4092",
    name: "Royal Palace Archway Pocket Folio",
    price: 350.00,
    desc: "Intricate laser-cut palace archways with customized insert sheets and wax seal.",
    previewImg: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop",
      "https://printo-s3.dietpixels.net/site/2024/Invitations/1280/Wedding_1735680512.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/Shape-chart_1718599323.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/All_1718608973.jpg",
    ],
    dimensions: "7 x 10 inches • Textured Handmade Sandalwood Stock",
  },
  {
    id: "rose",
    sku: "KNKC4105",
    name: "Jaipur Rose Floral Scroll Enclosure",
    price: 280.00,
    desc: "Traditional royal farman scroll stored in an embroidered golden tube.",
    previewImg: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
      "https://printo-s3.dietpixels.net/site/2024/Invitations/New/Wedding-Invitations_1735759374.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/Shape-chart_1718599323.jpg",
      "https://printo-s3.dietpixels.net/site/2024/Invitation/Infographics/All_1718608973.jpg",
    ],
    dimensions: "6.5 x 9 inches • Pearl Metallic Stock",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [activeTab, setActiveTab] = useState<"invites" | "hero" | "photos" | "card" | "rsvps" | "bulk-print" | "billing">("invites");
  const [userPlan, setUserPlan] = useState<"FREE" | "PRO">("FREE");
  const [upgradingPro, setUpgradingPro] = useState(false);
  const [proTransactions, setProTransactions] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("couple@vivahaluxe.com");

  // Bulk Print Studio State
  const [selectedDesign, setSelectedDesign] = useState(PRINT_CARD_DESIGNS[0]);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
  const [typeShape, setTypeShape] = useState("Flat");
  const [cardSize, setCardSize] = useState("A5");
  const [paperType, setPaperType] = useState("Smooth Paper");
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState("Flat 402, Royal Residency, MG Road, Bangalore - 560001");
  const [orderContactMobile, setOrderContactMobile] = useState("+91 98765 43210");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  // Personalize & Send Invitation Card Studio State
  const [guestNameInput, setGuestNameInput] = useState("Sri Rajesh Sharma & Family");
  const [guestPhoneInput, setGuestPhoneInput] = useState("");
  const [guestEmailInput, setGuestEmailInput] = useState("rajesh@sharma.in");
  const [inviteNoteInput, setInviteNoteInput] = useState(
    "We joyfully invite you and your family to join us as we celebrate our beginning as husband and wife. Your presence and blessings mean the world to us!"
  );
  const [cardTheme, setCardTheme] = useState<ThemeKey>("velvet");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Custom Invitation State
  const [customDomain, setCustomDomain] = useState("https://aswin-and-annapoorna.vercel.app");
  const [activePreset, setActivePreset] = useState("rahul-anjali");
  const [slugInput, setSlugInput] = useState("rahul-anjali");
  const [coupleNames, setCoupleNames] = useState("Rahul Sharma & Anjali Mehta");
  const [brideDetails, setBrideDetails] = useState("Daughter of Dr. Rajesh Mehta & Smt. Sunita Mehta");
  const [groomDetails, setGroomDetails] = useState("Son of Sri Suresh Sharma & Smt. Anita Sharma");
  const [weddingDate, setWeddingDate] = useState("2026-12-14T11:00");
  const [weddingDateDisplay, setWeddingDateDisplay] = useState("December 14–15, 2026");
  const [venueName, setVenueName] = useState("Umaid Bhawan Palace & Rambagh Palace");
  const [venueAddress, setVenueAddress] = useState("Jaipur, Rajasthan, India • Partner Hotels: Taj Rambagh & Umaid Heritage");
  const [mapUrl, setMapUrl] = useState("https://maps.google.com/?q=Rambagh+Palace+Jaipur");
  const [story, setStory] = useState("From college best friends to soulful life partners, our journey is filled with laughter, adventures, and unconditional devotion.");
  const [inviteTheme, setInviteTheme] = useState<ThemeKey>("velvet");

  // Hero Configuration State
  const [heroBgType, setHeroBgType] = useState<"image" | "video">("image");
  const [heroBgUrl, setHeroBgUrl] = useState("https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop");
  const [musicUrl, setMusicUrl] = useState("https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-136.mp3");

  const [photosList, setPhotosList] = useState<any[]>([
    { id: "1", src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop", caption: "Mandap Moments", category: "ceremony" },
    { id: "2", src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1974&auto=format&fit=crop", caption: "Garden Celebration", category: "reception" },
  ]);
  const [photoSrcInput, setPhotoSrcInput] = useState("");
  const [photoCaptionInput, setPhotoCaptionInput] = useState("");
  const [photoCategoryInput, setPhotoCategoryInput] = useState("ceremony");

  const [rsvps, setRsvps] = useState<any[]>([
    { id: 1, name: "Vikram & Pooja Sharma", attending: "yes", guests: "2", dietary: "Vegetarian", allergies: "None", songRequest: "Tum Se Hi", events: ["Mehendi", "Ceremony"] },
    { id: 2, name: "Rajesh K Nair", attending: "yes", guests: "1", dietary: "No restrictions", allergies: "Shellfish", songRequest: "Kesariya", events: ["Reception"] },
  ]);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") setIsAuthenticated(true);

    if (typeof window !== "undefined" && window.location.origin && !window.location.origin.includes("localhost")) {
      setCustomDomain(window.location.origin);
    }

    const userStr = sessionStorage.getItem("vivaha_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.isDemo || u.email === "demo@vivahaluxe.com") {
          setIsDemoUser(true);
        }
        if (u.email) setUserEmail(u.email);
        if (u.coupleNames) setCoupleNames(u.coupleNames);
        if (u.slug) setSlugInput(u.slug);
        if (u.venueName) {
          setVenueName(u.venueName);
          setVenueAddress(u.venueName);
        }
        if (u.weddingDate) {
          setWeddingDate(`${u.weddingDate}T11:00`);
          setWeddingDateDisplay(u.weddingDate);
        }
        if (u.plan === "PRO" || u.isPro) {
          setUserPlan("PRO");
        } else {
          try {
            const regStr = localStorage.getItem("vivaha_registered_users") || "[]";
            const regList = JSON.parse(regStr);
            const found = regList.find((x: any) => x.email === u.email);
            if (found && (found.plan === "PRO" || found.isPro)) {
              setUserPlan("PRO");
              u.plan = "PRO";
              u.isPro = true;
              sessionStorage.setItem("vivaha_user", JSON.stringify(u));
            }
          } catch (err) {}
        }
      } catch (e) {}
    }

    const pendingTheme = sessionStorage.getItem("vivaha_pending_theme");
    if (pendingTheme) {
      setInviteTheme(pendingTheme as ThemeKey);
      sessionStorage.removeItem("vivaha_pending_theme");
      toast.success(`Applied adopted template theme style to your Studio!`);
    }

    try {
      const ordStr = localStorage.getItem("vivaha_print_orders") || "[]";
      const allOrders: any[] = JSON.parse(ordStr);
      setUserOrders(allOrders);
    } catch (e) {}

    try {
      const txStr = localStorage.getItem("vivaha_pro_transactions") || "[]";
      setProTransactions(JSON.parse(txStr));
    } catch (e) {}
  }, []);

  // ── Razorpay: called by useRazorpay hook after successful payment + verification ──
  const onRazorpaySuccess = (paymentRecord: any) => {
    const newTx = {
      txId: paymentRecord.razorpayPaymentId || paymentRecord.txId,
      razorpayOrderId: paymentRecord.razorpayOrderId,
      razorpayPaymentId: paymentRecord.razorpayPaymentId,
      coupleNames: paymentRecord.coupleNames || coupleNames,
      userEmail: paymentRecord.userEmail || userEmail,
      amount: paymentRecord.amount || 499,
      paymentMethod: paymentRecord.paymentMethod || "Razorpay",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Approved & Active",
    };

    try {
      const txStr = localStorage.getItem("vivaha_pro_transactions") || "[]";
      const txList = JSON.parse(txStr);
      const updatedList = [newTx, ...txList];
      localStorage.setItem("vivaha_pro_transactions", JSON.stringify(updatedList));
      setProTransactions(updatedList);
    } catch (err) {}

    // Auto-activate Pro since payment is verified by Razorpay
    setUserPlan("PRO");
    try {
      const uStr = sessionStorage.getItem("vivaha_user");
      if (uStr) {
        const u = JSON.parse(uStr);
        u.plan = "PRO";
        u.isPro = true;
        sessionStorage.setItem("vivaha_user", JSON.stringify(u));
      }
    } catch (err) {}

    toast.success("💎 Pro Account Activated!", {
      description: "Your Razorpay payment was verified. All ads removed instantly. Reference: " + (paymentRecord.razorpayPaymentId || paymentRecord.txId),
    });
  };

  const { initiatePayment } = useRazorpay({
    coupleNames,
    userEmail,
    onSuccess: onRazorpaySuccess,
    onFailure: () => setUpgradingPro(false),
  });

  const handleRazorpayCheckout = async () => {
    if (proTransactions.some((t) => t.status === "Pending Approval")) {
      toast.warning("You already have a pending Pro request. Please wait for Super Admin review.");
      return;
    }
    setUpgradingPro(true);
    await initiatePayment();
    setUpgradingPro(false);
  };

  const handlePlaceBulkPrintOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuantity < 100) {
      toast.error("Minimum bulk print order quantity is 100 cards.");
      return;
    }
    setPlacingOrder(true);
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = orderQuantity * selectedDesign.price;

    let userEmail = "couple@vivahaluxe.com";
    try {
      const userStr = sessionStorage.getItem("vivaha_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.email) userEmail = u.email;
      }
    } catch (err) {}

    const newOrder = {
      id: orderId,
      slug: slugInput,
      coupleNames,
      userEmail,
      design: selectedDesign.name,
      typeShape,
      cardSize,
      paperType,
      quantity: orderQuantity,
      unitPrice: selectedDesign.price,
      totalAmount,
      deliveryAddress: orderDeliveryAddress,
      contactMobile: orderContactMobile,
      status: "In Review",
      orderedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };

    try {
      const ordStr = localStorage.getItem("vivaha_print_orders") || "[]";
      let allOrders: any[] = [];
      try {
        allOrders = JSON.parse(ordStr);
      } catch (e) {}
      const updatedOrders = [newOrder, ...allOrders];
      localStorage.setItem("vivaha_print_orders", JSON.stringify(updatedOrders));
      setUserOrders(updatedOrders);

      await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      toast.success("✨ Bulk Print Order Placed Successfully!", {
        description: `Order ID ${orderId}. Alert dispatched to Admin Team (ashwinachu9525@gmail.com).`,
      });
    } catch (err) {
      toast.success("✨ Bulk Print Order Placed!", {
        description: `Order ID ${orderId} saved locally. Our production team has been alerted.`,
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  // Load selected celebration preset
  const handleSelectPreset = (slug: string) => {
    setActivePreset(slug);
    const inv = getInvitationBySlug(slug);
    if (inv) {
      setSlugInput(inv.slug);
      setCoupleNames(inv.coupleNames);
      setBrideDetails(inv.brideDetails || "Daughter of Bride Family");
      setGroomDetails(inv.groomDetails || "Son of Groom Family");
      setWeddingDate(inv.weddingDate ? inv.weddingDate.substring(0, 16) : "2026-12-14T11:00");
      setWeddingDateDisplay(inv.weddingDateDisplay);
      setVenueName(inv.venueName);
      setVenueAddress(inv.venueAddress || "India");
      setMapUrl(inv.mapUrl || "https://maps.google.com");
      setStory(inv.story);
      setInviteTheme((inv.theme as ThemeKey) || "velvet");
      if (inv.heroBgUrl) setHeroBgUrl(inv.heroBgUrl);
      if (inv.heroBgType) setHeroBgType(inv.heroBgType);
      if (inv.musicUrl) setMusicUrl(inv.musicUrl);
      toast.success(`Loaded settings for /invite/${inv.slug}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("vivaha_user");
    sessionStorage.removeItem("vivaha_onboarded");
    sessionStorage.removeItem("vivaha_email_verified");
    toast.success("Logged out successfully.");
    router.push("/auth/login");
  };

  // Device File Uploader handler for Hero Media
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is larger than 15MB. Please choose a smaller file or enter direct URL.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setHeroBgUrl(reader.result as string);
        if (file.type.startsWith("video/")) {
          setHeroBgType("video");
        } else {
          setHeroBgType("image");
        }
        toast.success(`Successfully uploaded ${file.name} from your device!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Device File Uploader handler for Background Audio Track
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Audio track is larger than 10MB. Please upload a smaller MP3 or enter direct URL.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setMusicUrl(reader.result as string);
        toast.success(`Uploaded background music track "${file.name}"!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Device File Uploader handler for Gallery Photos
  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPhotosList([
          {
            id: Date.now().toString(),
            src: reader.result as string,
            caption: file.name.split(".")[0] || "Device Upload",
            category: photoCategoryInput,
          },
          ...photosList,
        ]);
        toast.success(`Uploaded ${file.name} to Masonry Gallery!`);
      }
    };
    reader.readAsDataURL(file);
  };



  const handleSaveInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    const invData = {
      slug: slugInput,
      coupleNames,
      brideDetails,
      groomDetails,
      weddingDate,
      weddingDateDisplay,
      venueName,
      venueAddress,
      mapUrl,
      story,
      theme: inviteTheme,
      heroBgType,
      heroBgUrl,
      musicUrl,
      galleryJson: JSON.stringify(photosList.map((p) => p.src)),
    };

    // Save to local storage for guaranteed instant sync across browser tabs
    try {
      const localSavedStr = localStorage.getItem("vivaha_saved_invitations") || "{}";
      let localSaved: Record<string, any> = {};
      try {
        localSaved = JSON.parse(localSavedStr);
      } catch (e) {}
      localSaved[slugInput.toLowerCase()] = {
        ...localSaved[slugInput.toLowerCase()],
        ...invData,
      };
      localStorage.setItem("vivaha_saved_invitations", JSON.stringify(localSaved));
    } catch (err) {}

    try {
      await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invData),
      });
      toast.success("✨ Celebration Portal Saved Successfully!", {
        description: `Live preview updated at /invite/${slugInput}`,
      });
    } catch (err) {
      toast.success("✨ Saved Locally!", {
        description: `Live preview updated at /invite/${slugInput}`,
      });
    }
  };

  // Construct Standalone Digital Card URL
  const getInviteCardUrl = () => {
    const cleanDomain = customDomain.trim().replace(/\/$/, "");
    const params = new URLSearchParams({
      guest: guestNameInput || "Honored Guest",
      note: inviteNoteInput,
      theme: cardTheme,
    });
    return `${cleanDomain}/invite/${slugInput}?${params.toString()}`;
  };

  const handleSendWhatsAppCard = () => {
    const inviteUrl = getInviteCardUrl();
    const text = `✨ *ROYAL WEDDING INVITATION* ✨\n\nDearest *${guestNameInput}*,\n\nWith hearts full of love, we request the honor of your presence at our royal wedding celebration:\n\n👰 *${coupleNames.toUpperCase()}* 🤵\n\n🗓 *Date*: ${weddingDateDisplay}\n📍 *Location*: ${venueName}\n\n💌 *Tap below to view your personalized digital invitation card & RSVP online*:\n${inviteUrl}\n\nWith warm regards,\n${coupleNames}`;

    const cleanPhone = guestPhoneInput.replace(/[^0-9]/g, "");
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank");
    toast.success("Opened WhatsApp with your personalized digital card link!");
  };

  const handleSendEmailCard = async () => {
    if (!guestEmailInput) {
      toast.error("Please enter a guest email address to send invitation.");
      return;
    }
    setSendingEmail(true);
    const inviteUrl = getInviteCardUrl();
    try {
      const res = await fetch("/api/invitations/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: guestEmailInput,
          guestName: guestNameInput,
          coupleNames,
          weddingDate: weddingDateDisplay,
          venue: venueName,
          note: inviteNoteInput,
          inviteUrl,
          theme: cardTheme,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Royal invitation email dispatched to ${guestEmailInput}!`);
      } else {
        toast.error(data.error || "Failed to dispatch email");
      }
    } catch (err) {
      toast.error("Could not connect to SMTP mail dispatch endpoint.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCopyInviteText = () => {
    const inviteUrl = getInviteCardUrl();
    const text = `✨ ROYAL WEDDING INVITATION ✨\n\nDearest ${guestNameInput},\n\nWe request the honor of your presence at our royal wedding celebration:\n\n${coupleNames}\nDate: ${weddingDateDisplay}\nLocation: ${venueName}\n\nView Digital Card & RSVP Online:\n${inviteUrl}`;
    navigator.clipboard.writeText(text);
    toast.success("Invitation message & direct URL copied to clipboard!");
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoSrcInput) return;
    setPhotosList([{ id: Date.now().toString(), src: photoSrcInput, caption: photoCaptionInput || "Wedding Moment", category: photoCategoryInput }, ...photosList]);
    setPhotoSrcInput("");
    setPhotoCaptionInput("");
    toast.success("Photo published to gallery!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#22201E] flex flex-col items-center justify-center p-6 text-[#FAF8F5]">
        <h1 className="font-serif text-3xl mb-4">Please Sign In</h1>
        <p className="text-xs text-[#C4B7A6] mb-6">You must authenticate to configure your wedding landing page.</p>
        <Link href="/auth/login" className="px-6 py-3 bg-[#D4AF37] text-[#1F1D1A] font-bold text-xs uppercase tracking-widest rounded-xs">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const currentThemeObj = INVITE_THEMES.find((t) => t.key === inviteTheme) || INVITE_THEMES[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201E] py-8 sm:py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Support Alert Bar */}
        <div className="bg-emerald-900 text-white px-5 py-3 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2 text-xs">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Need customization assistance or Prisma database help? Chat directly with Platform Support (+91 70124 06453).</span>
          </div>
          <a
            href="https://wa.me/917012406453?text=Hello%20VivahaLuxe%20Support%2C%20I%20need%20help%20with%20my%20wedding%20invitation"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#888178] mb-1">
              <Unlock className="w-3.5 h-3.5 text-[#C4B7A6]" />
              <span>Couple Studio Dashboard</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#22201E]">Wedding Website Configurator</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/invite/${slugInput}`}
              target="_blank"
              className="px-4 py-2 bg-emerald-800 text-white text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center gap-1.5 rounded-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Page</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-2 bg-[#22201E] text-white text-xs uppercase tracking-widest hover:bg-[#3A3632] transition-colors flex items-center gap-1.5 rounded-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hub</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center gap-1.5 rounded-xs font-bold shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Active Logged-In Couple Profile Banner */}
        <div className="bg-white p-4 rounded-sm border border-[#E8E2D9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#22201E]">Logged in Celebration:</span>
                <span className="text-sm font-serif font-bold text-emerald-800">{coupleNames}</span>
              </div>
              <p className="text-[11px] text-[#888178] font-mono mt-0.5">
                Live Portal: /invite/{slugInput}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified Owner</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xs flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Display Advertisement banner neatly if user is on Free plan */}
        <AdBanner slot="admin" className="my-2" />

        {/* Tabs */}
        <div className="flex border-b border-[#E8E2D9] gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("invites")}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "invites" ? "border-[#22201E] text-[#22201E] font-bold" : "border-transparent text-[#888178]"
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>Full Profile Details &amp; Themes</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "hero" ? "border-[#22201E] text-[#22201E] font-bold" : "border-transparent text-[#888178]"
            }`}
          >
            <Film className="w-4 h-4 text-amber-600" />
            <span>Hero Media &amp; Audio Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "photos" ? "border-[#22201E] text-[#22201E] font-bold" : "border-transparent text-[#888178]"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery Device Upload ({photosList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("card")}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "card" ? "border-[#22201E] text-[#22201E] font-bold" : "border-transparent text-[#888178]"
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Personalize &amp; Send Invitation (WhatsApp &amp; Mail)</span>
          </button>

          <button
            onClick={() => setActiveTab("rsvps")}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "rsvps" ? "border-[#22201E] text-[#22201E] font-bold" : "border-transparent text-[#888178]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guest RSVPs ({rsvps.length})</span>
          </button>

          {!isDemoUser && (
            <button
              onClick={() => setActiveTab("bulk-print")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "bulk-print" ? "border-[#22201E] text-[#22201E] font-bold" : "border-transparent text-[#888178]"
              }`}
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span>🖨️ Physical Bulk Print Orders ({userOrders.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "billing" ? "border-[#662D91] text-[#662D91] font-bold" : "border-transparent text-[#888178]"
            }`}
          >
            <Crown className="w-4 h-4 text-[#662D91]" />
            <span>💎 Pro Plan &amp; Billing (₹499)</span>
          </button>
        </div>

        {/* Tab 1: Invites & Full Profile Details */}
        {activeTab === "invites" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-sm shadow-2xs space-y-6">
              <h2 className="font-serif text-2xl">Configure Custom Landing Page details</h2>

              <form onSubmit={handleSaveInvitation} className="space-y-4">
                <div className="bg-[#FAF8F5] p-3.5 rounded-xs border border-[#E8E2D9]">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C]">
                      Unique URL Slug (SEO Friendly)
                    </label>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      🔒 System Generated (Unique)
                    </span>
                  </div>
                  <div className="flex items-center relative">
                    <span className="bg-gray-100 border border-r-0 border-[#E8E2D9] px-3 py-2 text-xs text-gray-500 rounded-l-xs font-mono select-none">
                      /invite/
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={slugInput}
                      className="flex-1 bg-gray-50 border border-[#E8E2D9] px-3.5 py-2 text-xs rounded-r-xs font-bold text-emerald-800 font-mono cursor-not-allowed select-all"
                    />
                  </div>
                  <p className="text-[10px] text-[#888178] mt-1.5 italic">
                    Strictly generated by system to ensure non-repeating values and prevent URL duplication.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1">Couple Display Names (#hero &amp; Navbar)</label>
                  <input
                    type="text"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1">Bride Family Lineage Details</label>
                    <input
                      type="text"
                      value={brideDetails}
                      onChange={(e) => setBrideDetails(e.target.value)}
                      placeholder="Daughter of..."
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1">Groom Family Lineage Details</label>
                    <input
                      type="text"
                      value={groomDetails}
                      onChange={(e) => setGroomDetails(e.target.value)}
                      placeholder="Son of..."
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Exact Date/Time (#hero Countdown)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1">Celebration Dates Display String</label>
                    <input
                      type="text"
                      value={weddingDateDisplay}
                      onChange={(e) => setWeddingDateDisplay(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1">Venues &amp; Palaces Display Name</label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Hotels &amp; Accommodations Guide Address</span>
                  </label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="e.g. Jaipur, Rajasthan • Recommended Hotels: Taj Rambagh..."
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1">Google Maps Navigation Link</label>
                  <input
                    type="url"
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2 text-xs rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-1">Love Story Quote</label>
                  <textarea
                    rows={2}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] p-3 text-xs rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                    Select Landing Page Theme Palette (12 Luxury Options)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {INVITE_THEMES.map((th) => (
                      <button
                        key={th.key}
                        type="button"
                        onClick={() => setInviteTheme(th.key)}
                        className={`p-2.5 rounded-xs border text-center text-xs font-medium transition-all ${
                          inviteTheme === th.key ? `${th.bgClass} ${th.textClass} ${th.borderClass} font-bold ring-2 ring-current` : "bg-white border-[#E8E2D9] text-[#66625D]"
                        }`}
                      >
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex-1 bg-[#22201E] text-white py-3.5 rounded-xs text-xs uppercase tracking-widest font-bold">
                    Save Landing Page Settings
                  </button>
                  <button type="button" onClick={handleSendWhatsAppCard} className="bg-[#25D366] text-white px-6 py-3.5 rounded-xs text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full mb-2 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#888178]">Theme Preview ({currentThemeObj.name})</span>
                <Link href={`/invite/${slugInput}`} target="_blank" className="text-xs text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1">
                  <span>Open Multi-Section Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className={`w-full p-8 rounded-sm border-2 shadow-xl text-center ${currentThemeObj.bgClass} ${currentThemeObj.textClass} ${currentThemeObj.borderClass} space-y-4`}>
                <div className="text-[10px] uppercase tracking-[0.35em] opacity-70">Modular Landing Page</div>
                <div className="font-serif text-3xl font-light">{coupleNames}</div>
                <div className="w-12 h-[1px] bg-current/30 mx-auto" />
                <p className="font-serif italic text-xs opacity-90">&ldquo;{story}&rdquo;</p>
                <div className="text-[11px] font-semibold opacity-80">{brideDetails} • {groomDetails}</div>
                <div className="text-xs uppercase tracking-widest font-semibold pt-2">{weddingDateDisplay}</div>
                <div className="text-[11px] opacity-75">{venueName}</div>
                <div className="text-[10px] opacity-60">{venueAddress}</div>
                <button onClick={handleSendWhatsAppCard} className="mt-4 bg-[#25D366] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send Website Link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hero Video & Music Studio with Device Upload */}
        {activeTab === "hero" && (
          <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-sm shadow-2xs max-w-3xl space-y-8">
            <div>
              <h2 className="font-serif text-2xl">Hero Background &amp; Audio Studio</h2>
              <p className="text-xs text-[#66625D] mt-1">Upload video, photo, or background music directly from your device storage.</p>
            </div>

            {/* Device File Upload Boxes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Box 1: Video / Image Upload */}
              <div className="p-6 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-sm text-center space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <Upload className="w-7 h-7 text-emerald-700 mx-auto" />
                  <h3 className="font-bold text-xs text-emerald-900 uppercase tracking-wider">Hero Visual Background</h3>
                  <p className="text-[11px] text-emerald-700">Upload MP4 Video Loop or High-Res Image (JPG, PNG)</p>
                </div>
                <label className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xs text-[11px] font-bold uppercase tracking-widest cursor-pointer shadow-md transition-all">
                  <span>Upload Video / Photo</span>
                  <input type="file" accept="image/*,video/*" onChange={handleHeroFileUpload} className="hidden" />
                </label>
              </div>

              {/* Box 2: Audio MP3 Upload */}
              <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-300 rounded-sm text-center space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <Music className="w-7 h-7 text-amber-700 mx-auto" />
                  <h3 className="font-bold text-xs text-amber-900 uppercase tracking-wider">Background Music Track</h3>
                  <p className="text-[11px] text-amber-700">Upload MP3 / WAV Audio file for floating music player</p>
                </div>
                <label className="inline-block bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-xs text-[11px] font-bold uppercase tracking-widest cursor-pointer shadow-md transition-all">
                  <span>Upload MP3 Audio Track</span>
                  <input type="file" accept="audio/*,.mp3,.wav,.m4a" onChange={handleAudioFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <form onSubmit={handleSaveInvitation} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C]">Active Display Mode</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setHeroBgType("image")}
                    className={`flex-1 py-3 px-4 border rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      heroBgType === "image" ? "bg-[#22201E] text-white border-[#22201E]" : "bg-[#FAF8F5] border-[#E8E2D9] text-[#66625D]"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Static Luxury Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroBgType("video")}
                    className={`flex-1 py-3 px-4 border rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      heroBgType === "video" ? "bg-amber-600 text-white border-amber-600" : "bg-[#FAF8F5] border-[#E8E2D9] text-[#66625D]"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Cinematic MP4 Video</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Hero Visual Preview */}
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#22201E] flex items-center gap-1.5">
                      {heroBgType === "video" ? <Video className="w-4 h-4 text-amber-600" /> : <ImageIcon className="w-4 h-4 text-emerald-600" />}
                      <span>Live Hero Visual Preview ({heroBgType.toUpperCase()})</span>
                    </label>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono uppercase font-bold">Active Studio Preview</span>
                  </div>
                  <div className="relative w-full h-48 sm:h-56 bg-black rounded-xs overflow-hidden border border-black/20 shadow-inner flex items-center justify-center">
                    {heroBgType === "video" ? (
                      <video
                        key={heroBgUrl}
                        src={heroBgUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={heroBgUrl}
                        alt="Hero Background Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                      Hero Media URL / Data Blob
                    </label>
                    <input
                      type="text"
                      value={heroBgUrl.length > 80 ? heroBgUrl.substring(0, 80) + "..." : heroBgUrl}
                      onChange={(e) => setHeroBgUrl(e.target.value)}
                      placeholder="Direct URL or auto-filled from Device upload above"
                      className="w-full bg-white border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs font-mono"
                    />
                  </div>
                </div>

                {/* Background Audio Preview */}
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#22201E] flex items-center gap-1.5">
                        <Music className="w-4 h-4 text-amber-600" />
                        <span>Live Soundtrack Preview Player</span>
                      </label>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono uppercase font-bold">MP3 Audio Test</span>
                    </div>
                    <div className="p-4 bg-white border border-[#E8E2D9] rounded-xs shadow-xs space-y-3">
                      <p className="text-xs text-[#66625D]">
                        Test your celebration background music. When guests open your invitation portal, a gold floating vinyl player will play this track.
                      </p>
                      <audio
                        key={musicUrl}
                        src={musicUrl}
                        controls
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                        Select from Built-in Music Library (/public/music)
                      </label>
                      <select
                        value={musicUrl}
                        onChange={(e) => {
                          if (e.target.value) {
                            setMusicUrl(e.target.value);
                            toast.success(`Selected audio track from library!`);
                          }
                        }}
                        className="w-full bg-white border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs font-semibold"
                      >
                        <option value="">-- Choose Built-in Library Track --</option>
                        {BUILTIN_MUSIC_TRACKS.map((t, idx) => (
                          <option key={idx} value={t.url}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                        Or Custom Audio Track URL / Uploaded Blob
                      </label>
                      <input
                        type="text"
                        value={musicUrl.length > 80 ? musicUrl.substring(0, 80) + "..." : musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        placeholder="Direct URL or auto-filled from Device MP3 upload above"
                        className="w-full bg-white border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full sm:w-auto bg-[#22201E] hover:bg-black text-white px-8 py-3.5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-all">
                Save Hero &amp; Audio Settings
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Photos Uploader with Device Upload */}
        {activeTab === "photos" && (
          <div className="space-y-8 bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-sm shadow-2xs">
            <div>
              <h2 className="font-serif text-2xl">Masonry Gallery Manager</h2>
              <p className="text-xs text-[#66625D] mt-1">Upload memories directly from your device or add via URL.</p>
            </div>

            {/* Device Uploader box */}
            <div className="p-6 bg-[#FAF8F5] border-2 border-dashed border-[#C4B7A6] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Upload className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">Upload Photo from Device</h3>
                  <p className="text-xs text-[#66625D]">Select category below before choosing file</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={photoCategoryInput}
                  onChange={(e) => setPhotoCategoryInput(e.target.value)}
                  className="bg-white border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs font-semibold uppercase"
                >
                  <option value="ceremony">Ceremony</option>
                  <option value="reception">Reception</option>
                  <option value="engagement">Engagement</option>
                  <option value="portraits">Portraits</option>
                </select>

                <label className="bg-[#22201E] hover:bg-[#3A3632] text-white px-5 py-2.5 rounded-xs text-xs font-bold uppercase tracking-widest cursor-pointer whitespace-nowrap">
                  <span>Pick Image File</span>
                  <input type="file" accept="image/*" onChange={handleGalleryFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* URL Form fallback */}
            <form onSubmit={handleAddPhoto} className="flex gap-3 max-w-2xl pt-2">
              <input
                type="url"
                required
                placeholder="Or paste external Image URL https://..."
                value={photoSrcInput}
                onChange={(e) => setPhotoSrcInput(e.target.value)}
                className="flex-1 bg-white border border-[#E8E2D9] px-4 py-2.5 text-xs rounded-xs"
              />
              <input
                type="text"
                placeholder="Caption..."
                value={photoCaptionInput}
                onChange={(e) => setPhotoCaptionInput(e.target.value)}
                className="w-36 bg-white border border-[#E8E2D9] px-3 py-2.5 text-xs rounded-xs"
              />
              <button type="submit" className="bg-[#D4AF37] text-black px-6 py-2.5 rounded-xs text-xs font-bold uppercase tracking-widest">
                Add URL
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E2D9]">
              {photosList.map((p) => (
                <div key={p.id} className="relative aspect-4/3 rounded-xs overflow-hidden border border-[#E8E2D9] group">
                  <Image src={p.src} alt="Moment" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                    <span className="text-[9px] uppercase tracking-widest text-amber-300 font-bold">{p.category}</span>
                    <p className="font-serif text-xs leading-tight">{p.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Personalize & Send Invitation Studio */}
        {activeTab === "card" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* Left Customizer Form */}
            <div className="lg:col-span-6 bg-white border border-[#E8E2D9] p-5 sm:p-8 rounded-sm shadow-2xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Personalize &amp; Send Invitation Studio</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#22201E]">Send via WhatsApp &amp; SMTP Mail</h2>
                <p className="text-xs text-[#55514C] mt-1 leading-relaxed">
                  Generates a dedicated standalone invitation card URL (`/invite/{slugInput}?guest=...`) for each guest!
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#FAF8F5] p-3 rounded-xs border border-[#E8E2D9]">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Vercel / Live Public Domain URL</span>
                  </label>
                  <input
                    type="url"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="https://your-wedding.vercel.app"
                    className="w-full bg-white border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E] font-mono text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">
                    Guest Name / Family Name
                  </label>
                  <input
                    type="text"
                    value={guestNameInput}
                    onChange={(e) => setGuestNameInput(e.target.value)}
                    placeholder="e.g. Sri Rajesh Sharma & Family"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E] font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">
                      Guest WhatsApp Mobile
                    </label>
                    <input
                      type="tel"
                      value={guestPhoneInput}
                      onChange={(e) => setGuestPhoneInput(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">
                      Guest Email Address (For Mail)
                    </label>
                    <input
                      type="email"
                      value={guestEmailInput}
                      onChange={(e) => setGuestEmailInput(e.target.value)}
                      placeholder="guest@domain.com"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">
                    Personalized Invitation Note
                  </label>
                  <textarea
                    rows={3}
                    value={inviteNoteInput}
                    onChange={(e) => setInviteNoteInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] p-3.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                    Visual Card Theme Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                    {INVITE_THEMES.slice(0, 8).map((th) => {
                      const isSelected = cardTheme === th.key;
                      return (
                        <button
                          key={th.key}
                          type="button"
                          onClick={() => setCardTheme(th.key)}
                          className={`p-2.5 rounded-xs border text-center text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? `${th.bgClass} ${th.borderClass} ${th.textClass} shadow-md ring-2 ring-current font-semibold scale-[1.02]`
                              : "bg-white border-[#E8E2D9] text-[#66625D] hover:border-[#C4B7A6]"
                          }`}
                        >
                          <span className="truncate w-full">{th.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Generated URL Box */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                    Generated Standalone Card Link
                  </span>
                  <Link
                    href={`/invite/${slugInput}?guest=${encodeURIComponent(guestNameInput)}&note=${encodeURIComponent(inviteNoteInput)}&theme=${cardTheme}`}
                    target="_blank"
                    className="text-[10px] text-emerald-700 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Test Card in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-[11px] font-mono text-emerald-900 break-all bg-white p-2 border border-emerald-100 rounded-xs">
                  {getInviteCardUrl()}
                </p>
              </div>

              {/* Action Share Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSendWhatsAppCard}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 px-4 rounded-xs font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendEmailCard}
                  disabled={sendingEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xs font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingEmail ? "Mailing..." : "Send via Mail"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyInviteText}
                  className="px-4 py-3 bg-[#22201E] hover:bg-[#3A3632] text-white rounded-xs font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full mb-3 flex justify-between items-center px-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888178]">
                  Live Digital Card Preview
                </span>
                <span className="text-[10px] text-[#C4B7A6] italic">Ready to broadcast</span>
              </div>

              {(() => {
                const currentThemeObj = INVITE_THEMES.find((t) => t.key === cardTheme) || INVITE_THEMES[0];
                return (
                  <div
                    className={`w-full max-w-md p-8 sm:p-10 rounded-sm border-2 shadow-xl relative overflow-hidden transition-all duration-300 text-center ${currentThemeObj.bgClass} ${currentThemeObj.borderClass} ${currentThemeObj.textClass}`}
                  >
                    <div className="absolute inset-3 border border-current/15 pointer-events-none rounded-2xs" />

                    <div className="relative z-10 space-y-6">
                      <div className="text-[10px] uppercase tracking-[0.35em] text-current/70">
                        The Wedding Celebration
                      </div>

                      <div className="font-serif text-3xl sm:text-4xl tracking-wide uppercase font-light">
                        {coupleNames}
                      </div>

                      <div className="w-12 h-[1px] bg-current/30 mx-auto" />

                      <div className="py-2.5 bg-current/5 border border-current/15 rounded-xs px-4">
                        <p className="text-[10px] uppercase tracking-widest text-current/60 mb-0.5">Inviting</p>
                        <p className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                          {guestNameInput || "Honored Guest"}
                        </p>
                      </div>

                      <p className="font-serif italic text-sm sm:text-base leading-relaxed text-current/90 px-2">
                        &ldquo;{inviteNoteInput}&rdquo;
                      </p>

                      <div className="text-xs uppercase tracking-[0.2em] space-y-1 pt-2">
                        <p className="font-semibold">{weddingDateDisplay}</p>
                        <p className="text-[11px] text-current/75">{venueName}</p>
                      </div>

                      <div className="pt-4 border-t border-current/15 flex gap-2 justify-center">
                        <button
                          onClick={handleSendWhatsAppCard}
                          className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-md hover:bg-[#20BD5A] transition-colors"
                        >
                          <MessageCircle className="w-3 h-3 fill-white" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={handleSendEmailCard}
                          className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-md hover:bg-blue-500 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Email Card</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Tab 5: RSVPs */}
        {activeTab === "rsvps" && (
          <div className="bg-white border border-[#E8E2D9] p-6 rounded-sm space-y-4">
            <h2 className="font-serif text-2xl">Guest RSVP Responses</h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E2D9] uppercase text-[#888178]">
                  <th className="py-3">Guest Name</th>
                  <th className="py-3">Attending</th>
                  <th className="py-3">Count</th>
                  <th className="py-3">Dietary / Allergies</th>
                  <th className="py-3">Song Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {rsvps.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 font-medium">{r.name}</td>
                    <td className="py-3"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">{r.attending}</span></td>
                    <td className="py-3">{r.guests}</td>
                    <td className="py-3">{r.dietary} ({r.allergies})</td>
                    <td className="py-3 font-serif italic text-amber-700">{r.songRequest || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 6: Physical Bulk Print Orders */}
        {activeTab === "bulk-print" && !isDemoUser && (
          <div className="space-y-8">
            <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-sm shadow-2xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Printer className="w-4 h-4" />
                  <span>Physical Card Bulk Print Studio</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#22201E]">Order Physical Luxury Wedding Cards</h2>
                <p className="text-xs text-[#55514C] mt-1 leading-relaxed">
                  Select your physical card design and customize bulk quantities (minimum 100 units). Once requested, instant alerts are dispatched to our production team (<strong className="text-black">ashwinachu9525@gmail.com</strong>) and your registered email.
                </p>
              </div>

              {/* Design Selector Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[#E8E2D9] pb-4">
                {PRINT_CARD_DESIGNS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDesign(d);
                      setActiveGalleryIdx(0);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-xs transition-all border ${
                      selectedDesign.id === d.id
                        ? "bg-[#22201E] text-white border-[#22201E] shadow-sm"
                        : "bg-white text-[#55514C] border-[#E8E2D9] hover:bg-gray-50"
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              {/* 🛍️ Exact Printo E-Commerce Product Studio Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                {/* 1. Left Gallery & Image Canvas Column (col-span-7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-[#F8F9FA] p-6 sm:p-10 rounded-sm border border-[#E5E7EB] flex items-center justify-center min-h-[460px] shadow-sm relative group overflow-hidden">
                    {activeGalleryIdx === 0 ? (
                      /* Main Photographic Product Mockup (Exact Printo Arch Bi-Fold & Envelope) */
                      <div className="relative flex flex-col items-center justify-center">
                        <img
                          src={selectedDesign.gallery?.[activeGalleryIdx] || selectedDesign.previewImg}
                          alt={selectedDesign.name}
                          className="max-h-[420px] w-auto object-contain drop-shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-purple-200 px-3 py-1 rounded shadow-xs text-[11px] font-bold text-[#662D91]">
                          ✨ Real Physical Card Photography
                        </div>
                      </div>
                    ) : (
                      /* Other Gallery Images / Specs */
                      <img
                        src={selectedDesign.gallery?.[activeGalleryIdx] || selectedDesign.previewImg}
                        alt={`${selectedDesign.name} angle ${activeGalleryIdx + 1}`}
                        className="max-h-[420px] w-auto object-contain drop-shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
                      />
                    )}

                    <span className="absolute bottom-3 left-3 bg-white/95 text-[10px] font-mono text-[#55514C] px-3 py-1 rounded shadow-xs border border-[#E5E7EB]">
                      {activeGalleryIdx === 0
                        ? "View 1: Bi-Fold Card & Matching Envelope Suite"
                        : activeGalleryIdx === 1
                        ? "View 2: Flat Floral Foil Front Design"
                        : activeGalleryIdx === 2
                        ? "View 3: Shape & Fold Options Guide"
                        : "View 4: Size & Envelope Comparison Chart"}
                    </span>
                  </div>

                  {/* Horizontal 4-Thumbnail Selector Below Image */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { img: selectedDesign.gallery?.[0] || selectedDesign.previewImg, label: "Open Suite" },
                      { img: selectedDesign.gallery?.[1] || selectedDesign.previewImg, label: "Flat Front" },
                      { img: selectedDesign.gallery?.[2] || selectedDesign.previewImg, label: "Shape Chart" },
                      { img: selectedDesign.gallery?.[3] || selectedDesign.previewImg, label: "Size Chart" },
                    ].map((thumb, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveGalleryIdx(idx)}
                        className={`aspect-[4/3] rounded overflow-hidden transition-all bg-white p-1.5 border flex flex-col items-center justify-center ${
                          activeGalleryIdx === idx
                            ? "border-2 border-[#662D91] shadow-md scale-[1.03]"
                            : "border-[#E5E7EB] opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img src={thumb.img} alt={thumb.label} className="w-full h-12 object-contain" />
                        <span className="text-[10px] font-bold text-[#38414A] mt-1 block truncate w-full text-center">
                          {thumb.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Right Column Product Specifications & Order Dropdowns (col-span-5) */}
                <div className="lg:col-span-5 space-y-5 text-[#38414A]">
                  <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827] leading-tight">
                        Wedding Invitations
                      </h2>
                      <p className="text-xs text-[#6B7280] mt-1 font-mono">{selectedDesign.sku}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.success("Share product link copied to clipboard!")}
                      className="p-2 border border-[#E5E7EB] rounded-full hover:bg-gray-100 text-[#38414A] transition-colors"
                      title="Share Product"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Highlights Bullet Points */}
                  <div className="text-xs sm:text-sm text-[#4B5563] space-y-2 leading-relaxed">
                    <p>Make your big day unforgettable with our elegant wedding invitations, perfect for any celebration style.</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[#374151]">
                      <li>Available in 3 sizes - A5, DL and A6</li>
                      <li>Choose from a variety of shapes and 3 different paper materials.</li>
                      <li>Design your own invitation with custom couple names and wedding photo.</li>
                      <li>Comes with plain envelopes as standard or upgrade to custom printed envelopes.</li>
                      <li>Order from as low as 100 units.</li>
                    </ul>
                  </div>

                  {/* Same-Day Express Delivery Notice Banner */}
                  <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-md p-3 text-xs text-[#662D91] font-semibold flex items-start gap-2">
                    <span className="text-base">⚡</span>
                    <span>
                      Order before <strong>4:30 PM</strong> and enjoy same-day delivery within 4–6 hours in <strong>Bengaluru, Pune, Hyderabad, NCR &amp; Chennai</strong>.
                    </span>
                  </div>

                  {/* Interactive Printo Dropdown Selectors */}
                  <div className="space-y-4 pt-2 border-t border-[#E5E7EB]">
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5">Type &amp; Shapes</label>
                      <select
                        value={typeShape}
                        onChange={(e) => setTypeShape(e.target.value)}
                        className="w-full bg-white border border-[#D1D5DB] rounded-md px-3.5 py-2.5 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#662D91] focus:ring-1 focus:ring-[#662D91]"
                      >
                        <option value="Flat">Flat</option>
                        <option value="Bi-Fold Arch Frame">Bi-Fold Arch Frame</option>
                        <option value="Pocket Folio Suite">Pocket Folio Suite</option>
                        <option value="Royal Scroll Case">Royal Scroll Case</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5">Card Sizes</label>
                      <select
                        value={cardSize}
                        onChange={(e) => setCardSize(e.target.value)}
                        className="w-full bg-white border border-[#D1D5DB] rounded-md px-3.5 py-2.5 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#662D91] focus:ring-1 focus:ring-[#662D91]"
                      >
                        <option value="A5">A5 (148 x 210 mm)</option>
                        <option value="DL">DL Long (99 x 210 mm)</option>
                        <option value="A6">A6 Compact (105 x 148 mm)</option>
                        <option value="Royal Box">Royal Box (9 x 11.5 in)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5">Paper Type</label>
                      <select
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value)}
                        className="w-full bg-white border border-[#D1D5DB] rounded-md px-3.5 py-2.5 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#662D91] focus:ring-1 focus:ring-[#662D91]"
                      >
                        <option value="Smooth Paper">Smooth Paper</option>
                        <option value="350 GSM Velvet Matte">350 GSM Velvet Matte</option>
                        <option value="Handmade Sandalwood Ivory">Handmade Sandalwood Ivory</option>
                        <option value="Pearl Metallic Stock">Pearl Metallic Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Customization & Submission Box */}
                  <form onSubmit={handlePlaceBulkPrintOrder} className="bg-[#F8F9FA] p-5 rounded-md border border-[#E5E7EB] space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#374151] mb-1">Quantity (Min 100)</label>
                        <input
                          type="number"
                          min={100}
                          step={25}
                          required
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(Number(e.target.value))}
                          className="w-full bg-white border border-[#D1D5DB] px-3.5 py-2 text-sm font-bold text-[#111827] rounded-md focus:outline-none focus:border-[#662D91]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#374151] mb-1">Total Estimated</label>
                        <div className="w-full bg-white border border-[#D1D5DB] px-3.5 py-2 text-sm font-serif font-bold text-[#662D91] rounded-md">
                          ₹{(orderQuantity * selectedDesign.price).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4B5563] mb-1">Mobile Contact</label>
                        <input
                          type="tel"
                          required
                          value={orderContactMobile}
                          onChange={(e) => setOrderContactMobile(e.target.value)}
                          className="w-full bg-white border border-[#D1D5DB] px-3 py-1.5 text-xs rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#4B5563] mb-1">Delivery PIN &amp; City</label>
                        <input
                          type="text"
                          required
                          value={orderDeliveryAddress}
                          onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                          placeholder="e.g. 560001, Bangalore"
                          className="w-full bg-white border border-[#D1D5DB] px-3 py-1.5 text-xs rounded-md"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={placingOrder}
                      className="w-full bg-[#662D91] hover:bg-[#522178] text-white font-bold py-3.5 text-sm uppercase tracking-wider rounded-md transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4 text-white" />
                      <span>{placingOrder ? "Placing Order..." : "Order Physical Cards Now"}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Live Order Tracking Table */}
            <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#22201E]">Your Print Order History &amp; Live Tracking</h3>
                  <p className="text-xs text-[#888178]">Real-time fulfillment updates managed by Super Admin team.</p>
                </div>
                <button
                  onClick={() => {
                    try {
                      const ordStr = localStorage.getItem("vivaha_print_orders") || "[]";
                      setUserOrders(JSON.parse(ordStr));
                      toast.success("Refreshed live order tracking statuses!");
                    } catch (e) {}
                  }}
                  className="p-2 border border-[#E8E2D9] rounded hover:bg-gray-50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-[#55514C]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Status</span>
                </button>
              </div>

              {userOrders.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F5] border border-dashed border-[#C4B7A6] rounded-xs text-xs text-[#888178]">
                  No bulk physical print orders requested yet. Select a luxury card design above to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E8E2D9] uppercase text-[#888178] tracking-wider">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Card Design Option</th>
                        <th className="py-3 px-3">Quantity</th>
                        <th className="py-3 px-3">Total Cost</th>
                        <th className="py-3 px-3">Order Date</th>
                        <th className="py-3 px-3 text-right">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D9]">
                      {userOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3.5 px-3 font-mono font-bold text-[#22201E]">{ord.id}</td>
                          <td className="py-3.5 px-3 font-medium text-[#22201E]">{ord.design}</td>
                          <td className="py-3.5 px-3 font-bold">{ord.quantity} units</td>
                          <td className="py-3.5 px-3 font-serif font-bold text-[#D4AF37]">₹{ord.totalAmount?.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 px-3 text-[#66625D]">{ord.orderedAt}</td>
                          <td className="py-3.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ord.status === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : ord.status === "In Transit"
                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                  : ord.status === "In Progress"
                                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}
                            >
                              {ord.status === "Delivered" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : ord.status === "In Transit" ? (
                                <Truck className="w-3 h-3" />
                              ) : ord.status === "In Progress" ? (
                                <Package className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              <span>{ord.status || "In Review"}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 7: Payment Management & Pro Account Upgrade */}
        {activeTab === "billing" && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Subscription Status Banner */}
            <div className={`p-6 sm:p-8 rounded-sm border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${
              userPlan === "PRO"
                ? "bg-gradient-to-r from-[#FAF5FF] via-[#FFFDF9] to-[#FAF8F5] border-[#662D91]"
                : "bg-white border-[#E8E2D9]"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                  userPlan === "PRO"
                    ? "bg-[#662D91] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}>
                  {userPlan === "PRO" ? <Crown className="w-7 h-7" /> : <CreditCard className="w-7 h-7" />}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      userPlan === "PRO"
                        ? "bg-[#662D91] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}>
                      {userPlan === "PRO" ? "💎 Pro Account Active" : proTransactions.some((t) => t.status === "Pending Approval") ? "⏳ Approval Pending" : "Free Account"}
                    </span>
                    {userPlan === "PRO" && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✨ 100% Ad-Free Experience
                      </span>
                    )}
                    {userPlan === "FREE" && proTransactions.some((t) => t.status === "Pending Approval") && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                        ⏳ Awaiting Super Admin Approval
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#22201E] mt-2 font-bold">
                    {userPlan === "PRO" ? "Lifetime Pro Subscription" : "VivahaLuxe Free Plan"}
                  </h2>
                  <p className="text-xs text-[#55514C] mt-1 max-w-2xl leading-relaxed">
                    {userPlan === "PRO"
                      ? "Your wedding website and portal are completely ad-free. Enjoy exclusive premium features, unlimited RSVP exports, and priority concierge support."
                      : proTransactions.some((t) => t.status === "Pending Approval")
                      ? "Your Pro upgrade request has been submitted and is currently awaiting review and approval by the Super Administrator. You will be notified once activated."
                      : "Your account currently displays partner advertisements on the landing page and dashboard. Submit a Pro upgrade request for ₹499 — activation requires Super Admin approval."}
                  </p>
                </div>
              </div>

              {userPlan === "FREE" && (
                <div className="text-center md:text-right shrink-0">
                  <div className="text-xs text-[#888178] uppercase font-bold tracking-wider">One-Time Fee</div>
                  <div className="font-serif text-3xl font-bold text-[#662D91]">₹499</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Lifetime Access • Activated by Super Admin</div>
                </div>
              )}
            </div>

            {/* Feature Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-sm border border-[#E8E2D9] space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#22201E]">Free Account Features</h3>
                  <span className="text-xs font-mono text-[#888178]">Included</span>
                </div>
                <ul className="space-y-3 text-xs text-[#55514C]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Create &amp; host custom wedding invitation portal</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Digital RSVP management &amp; QR code check-in</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Physical bulk print order placement studio</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-amber-700 font-medium">
                    <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold">📢</span>
                    <span>Displays sponsored partner ads on landing page</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#FAF5FF] to-white p-6 rounded-sm border-2 border-[#662D91] space-y-4 shadow-sm relative">
                <div className="absolute -top-3 right-4 bg-[#662D91] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded shadow-xs">
                  Recommended
                </div>
                <div className="flex items-center justify-between border-b border-purple-200 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#662D91] flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    <span>Pro Account Benefits</span>
                  </h3>
                  <span className="text-xs font-bold text-[#662D91]">₹499 Flat</span>
                </div>
                <ul className="space-y-3 text-xs text-[#22201E] font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#662D91] shrink-0" />
                    <span>Everything included in Free Account</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-bold text-[#662D91]">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>100% Ad-Free across all landing pages &amp; invitation views</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#662D91] shrink-0" />
                    <span>Priority 4-hour express card printing queue</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#662D91] shrink-0" />
                    <span>VIP dedicated designer support &amp; custom domain setup</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Razorpay Checkout Card (Only if Free) */}
            {userPlan === "FREE" && (
              <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-sm shadow-md space-y-6">
                <div className="border-b border-[#E8E2D9] pb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#22201E]">Upgrade to Pro — ₹499 (Lifetime)</h3>
                    <p className="text-xs text-[#888178] mt-1">Pay securely via Razorpay. Supports UPI, Cards, Net Banking, Wallets and more. Ads removed instantly after payment.</p>
                  </div>
                  {/* Razorpay Logo */}
                  <div className="shrink-0 bg-[#072654] px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider">
                    razor<span className="text-[#3395FF]">pay</span>
                  </div>
                </div>

                {/* Accepted Payment Methods */}
                <div className="space-y-2">
                  <p className="text-[11px] uppercase font-bold tracking-widest text-[#888178]">Accepted Payment Methods</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "UPI", color: "#6B21A8", sub: "GPay · PhonePe · Paytm" },
                      { label: "Visa", color: "#1A1F71", sub: "Debit / Credit" },
                      { label: "Mastercard", color: "#EB001B", sub: "Debit / Credit" },
                      { label: "RuPay", color: "#0A5C99", sub: "National Card" },
                      { label: "Net Banking", color: "#065F46", sub: "50+ Banks" },
                      { label: "Wallets", color: "#92400E", sub: "Amazon · Mobikwik" },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        <div>
                          <div className="text-[10px] font-bold text-[#22201E]">{m.label}</div>
                          <div className="text-[9px] text-[#888178]">{m.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded p-3.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Secure · PCI-DSS Compliant · 256-bit SSL</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Your payment is processed by Razorpay — a certified RBI-regulated payment gateway. VivahaLuxe does not store any card details. Payment reference is tracked in our secure database.</p>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-center sm:text-left">
                    <div className="font-serif text-3xl font-bold text-[#662D91]">₹499</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">One-time • Lifetime Access • Ads Removed Instantly</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRazorpayCheckout}
                    disabled={upgradingPro}
                    className="flex items-center gap-3 bg-[#3395FF] hover:bg-[#2276CC] disabled:opacity-60 text-white font-bold px-8 py-4 rounded text-sm uppercase tracking-widest shadow-lg transition-all"
                  >
                    {upgradingPro ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span>Pay ₹499 via Razorpay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Pending Approval Alert Banner */}
            {userPlan === "FREE" && proTransactions.some((t) => t.status === "Pending Approval") && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-sm p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-xl">
                  ⏳
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Pro Request Pending Super Admin Approval</p>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Your upgrade request has been received. The Super Administrator will review your payment and activate your Pro status shortly. Once approved, all advertisements will be removed automatically.
                  </p>
                  <p className="text-[11px] text-amber-700 mt-2 font-semibold">📧 Contact Super Admin: ashwinachu9525@gmail.com</p>
                </div>
              </div>
            )}

            {/* Subscription Requests & Payment History Table */}
            <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-sm shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#22201E]">Subscription Requests &amp; Payment History</h3>
                  <p className="text-xs text-[#888178]">Track the status of your Pro upgrade request. Status is updated by the Super Admin.</p>
                </div>
                <Receipt className="w-5 h-5 text-[#888178]" />
              </div>

              <div className="overflow-x-auto border border-[#E8E2D9] rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#888178] uppercase text-[10px] tracking-wider border-b border-[#E8E2D9]">
                    <tr>
                      <th className="py-3 px-4">Razorpay Payment ID</th>
                        <th className="py-3 px-4">Order Reference</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D9]">
                      {proTransactions.length > 0 ? (
                        proTransactions.map((tx, idx) => (
                          <tr key={idx}>
                            <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-[#662D91] max-w-[130px] truncate" title={tx.txId || tx.razorpayPaymentId}>
                              {tx.razorpayPaymentId || tx.txId || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[10px] text-[#888178] max-w-[120px] truncate" title={tx.razorpayOrderId}>
                              {tx.razorpayOrderId || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-[#22201E]">₹{tx.amount || 499}.00</td>
                            <td className="py-3.5 px-4 text-[#55514C]">{tx.paymentMethod || "Razorpay"}</td>
                            <td className="py-3.5 px-4 text-[#888178]">{tx.date}</td>
                            <td className="py-3.5 px-4 text-right">
                              <span className={`font-bold px-2.5 py-1 rounded text-[10px] ${
                                tx.status === "Active" || tx.status === "Approved & Active"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : tx.status === "Revoked"
                                  ? "bg-red-100 text-red-800 border border-red-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                              }`}>
                                {tx.status || "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-[#888178] italic">
                            No Pro subscription transactions yet. Click "Pay ₹499 via Razorpay" above to start.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
