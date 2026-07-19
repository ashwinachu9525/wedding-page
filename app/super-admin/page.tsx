"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WeddingDatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import {
  ShieldCheck,
  Users,
  FileText,
  BarChart3,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Layout,
  MessageCircle,
  Trash2,
  UserPlus,
  Bell,
  Building,
  KeyRound,
  Send,
  Power,
  X,
  Printer,
  Truck,
  Package,
  Clock,
  RotateCcw,
  Eye,
  Mail,
  RefreshCw,
} from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  username: string;
  invitationSlug?: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  provider: "google" | "credentials";
  invitationsCount: number;
  joinedDate: string;
  rsvpsCount: number;
  views: number;
  isDemo?: boolean;
  plan?: "FREE" | "PRO";
  subStatus?: "ACTIVE" | "EXPIRED";
}

const INITIAL_DEMO_USERS: UserRecord[] = [
  { id: "demo-1", name: "Rahul Sharma & Priya Mehta", username: "rahul-priya-2026", email: "demo@vivahaluxe.com", role: "SUPER_ADMIN", status: "ACTIVE", provider: "google", invitationsCount: 1, joinedDate: "July 2026", rsvpsCount: 42, views: 342, isDemo: true, plan: "PRO", subStatus: "ACTIVE" },
  { id: "demo-2", name: "Rahul Sharma & Anjali", username: "rahul-anjali", email: "rahul@sharma.in", role: "USER", status: "ACTIVE", provider: "credentials", invitationsCount: 1, joinedDate: "July 2026", rsvpsCount: 18, views: 189, isDemo: true, plan: "PRO", subStatus: "ACTIVE" },
  { id: "demo-3", name: "Vikram & Pooja Rao", username: "vikram-pooja", email: "vikram@rao.org", role: "USER", status: "SUSPENDED", provider: "google", invitationsCount: 1, joinedDate: "June 2026", rsvpsCount: 25, views: 210, isDemo: true, plan: "FREE", subStatus: "EXPIRED" },
  { id: "demo-4", name: "Sneha & Arjun Nair", username: "sneha-arjun", email: "sneha@nair.co", role: "USER", status: "ACTIVE", provider: "credentials", invitationsCount: 1, joinedDate: "July 2026", rsvpsCount: 31, views: 175, isDemo: true, plan: "FREE", subStatus: "EXPIRED" },
  { id: "demo-5", name: "Evaluation Showcase User", username: "demo-showcase", email: "demo@vivahaluxe.com", role: "USER", status: "ACTIVE", provider: "credentials", invitationsCount: 1, joinedDate: "July 2026", rsvpsCount: 10, views: 99, isDemo: true, plan: "FREE", subStatus: "EXPIRED" },
];

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [usersList, setUsersList] = useState<UserRecord[]>(INITIAL_DEMO_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDirectoryTab, setActiveDirectoryTab] = useState<"overview" | "registered" | "demo" | "print-orders" | "pro-subscriptions" | "email-logs" | "system-errors" | "testimonials">("overview");
  const [announcement, setAnnouncement] = useState("🎉 VivahaLuxe v2.0 Live: 12 New Royal Themes & CockroachDB Prisma Storage Engine deployed!");
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("Scheduled Maintenance: The platform will be down for upgrades.");
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [printOrders, setPrintOrders] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [emailLogsLoading, setEmailLogsLoading] = useState(false);
  const [systemErrors, setSystemErrors] = useState<any[]>([]);
  const [systemErrorsLoading, setSystemErrorsLoading] = useState(false);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [systemStatsLoading, setSystemStatsLoading] = useState(false);

  const [proTransactions, setProTransactions] = useState<any[]>([]);
  const [globalAdConfig, setGlobalAdConfig] = useState({
    enabled: true,
    sponsorName: "Tanishq Royal Wedding Jewels",
    tagline: "Exclusive Heritage Bridal Gold & Diamond Collections • Up to 20% Off Making Charges",
    linkUrl: "https://tanishq.co.in",
    ctaText: "Explore Bridal Collection",
  });

  // Testimonials state
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [testimonialsAdminLoading, setTestimonialsAdminLoading] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "", venue: "", date: "", quote: "", rating: 5,
    theme: "", themeColor: "#22201E", textColor: "#FAF8F5",
  });
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupleName, setNewCoupleName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    // Check super-admin session via cookie
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user?.isSuperAdmin) setIsAuthenticated(true);
      })
      .catch(() => {});

    // Load Bulk Print Orders (no auth needed — localStorage)
    try {
      const ordStr = localStorage.getItem("vivaha_print_orders") || "[]";
      setPrintOrders(JSON.parse(ordStr));
    } catch (e) {}

    // Load Ad Config
    try {
      const adStr = localStorage.getItem("vivaha_global_ad_config");
      if (adStr) setGlobalAdConfig(JSON.parse(adStr));
    } catch (e) {}
  }, []);

  // Load DB data only after super admin is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load real registered users from DB
    fetch("/api/super-admin/users", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const dbUsers: UserRecord[] = data.map((u: any) => ({
            id: u.id,
            name: u.name || u.email,
            username: u.username || u.email?.split("@")[0] || "user",
            email: u.email,
            role: u.role || "USER",
            status: u.status || "ACTIVE",
            provider: u.provider || "credentials",
            invitationsCount: u.invitationsCount || 0,
            joinedDate: u.joinedDate || "2026",
            rsvpsCount: u.rsvpsCount || 0,
            views: u.views || 0,
            isDemo: false,
            plan: u.plan || "FREE",
            subStatus: u.plan === "PRO" ? "ACTIVE" : "EXPIRED",
          }));
          setUsersList((prev) => [...dbUsers, ...prev.filter((p) => p.isDemo)]);
        }
      })
      .catch(console.error);

    fetch("/api/super-admin/transactions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProTransactions(data);
      })
      .catch(console.error);

    // Load Email Logs from DB
    setEmailLogsLoading(true);
    fetch("/api/super-admin/email-logs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEmailLogs(data);
      })
      .catch(() => {})
      .finally(() => setEmailLogsLoading(false));

    refreshSystemErrors();
    refreshSystemStats();

    // Fetch Maintenance Config from DB
    fetch("/api/system-config")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.config) {
          setMaintenanceMode(data.config.maintenanceMode);
          if (data.config.maintenanceText) setMaintenanceText(data.config.maintenanceText);
          if (data.config.maintenanceDate) setMaintenanceDate(data.config.maintenanceDate);
          setAlertEnabled(data.config.alertEnabled);
          if (data.config.alertText) setAnnouncement(data.config.alertText);
        }
      })
      .catch(console.error);

    // Load Testimonials from DB
    refreshTestimonials();
  }, [isAuthenticated]);

  const refreshSystemStats = async () => {
    setSystemStatsLoading(true);
    try {
      const res = await fetch("/api/super-admin/system-stats");
      const data = await res.json();
      if (!data.error) {
        setSystemStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSystemStatsLoading(false);
    }
  };

  const refreshSystemErrors = async () => {
    setSystemErrorsLoading(true);
    try {
      const res = await fetch("/api/super-admin/system-errors");
      const data = await res.json();
      if (data.errors) {
        setSystemErrors(data.errors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSystemErrorsLoading(false);
    }
  };

  const updateSystemErrorStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/super-admin/system-errors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Error marked as ${status}`);
        refreshSystemErrors();
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const refreshEmailLogs = async () => {
    setEmailLogsLoading(true);
    try {
      const r = await fetch("/api/super-admin/email-logs");
      const data = await r.json();
      if (Array.isArray(data)) setEmailLogs(data);
      toast.success(`Refreshed — ${data.length} email logs loaded`);
    } catch (e) {
      toast.error("Failed to refresh email logs");
    } finally {
      setEmailLogsLoading(false);
    }
  };

  const refreshTestimonials = async () => {
    setTestimonialsAdminLoading(true);
    try {
      const res = await fetch("/api/super-admin/testimonials");
      const data = await res.json();
      if (data.success && Array.isArray(data.testimonials)) {
        setTestimonialsList(data.testimonials);
      }
    } catch (e) {
      toast.error("Failed to load testimonials");
    } finally {
      setTestimonialsAdminLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.quote) {
      toast.error("Name and Quote are required.");
      return;
    }
    setSavingTestimonial(true);
    try {
      const res = await fetch("/api/super-admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTestimonial, sortOrder: testimonialsList.length }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Testimonial added!");
        setNewTestimonial({ name: "", venue: "", date: "", quote: "", rating: 5, theme: "", themeColor: "#22201E", textColor: "#FAF8F5" });
        refreshTestimonials();
      } else {
        toast.error(data.error || "Failed to add testimonial");
      }
    } catch (e) {
      toast.error("Failed to add testimonial");
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleSaveEditTestimonial = async () => {
    if (!editingTestimonial) return;
    setSavingTestimonial(true);
    try {
      const res = await fetch(`/api/super-admin/testimonials/${editingTestimonial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTestimonial),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Testimonial updated!");
        setEditingTestimonial(null);
        refreshTestimonials();
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch (e) {
      toast.error("Failed to update testimonial");
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial permanently?")) return;
    try {
      const res = await fetch(`/api/super-admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Testimonial deleted.");
        refreshTestimonials();
      } else {
        toast.error("Failed to delete.");
      }
    } catch (e) {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleToggleVisibility = async (t: any) => {
    try {
      const res = await fetch(`/api/super-admin/testimonials/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !t.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t.isVisible ? "Hidden from homepage" : "Now visible on homepage");
        refreshTestimonials();
      }
    } catch (e) {
      toast.error("Failed to toggle visibility");
    }
  };

  const handleToggleUserProPlan = async (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;

    const newPlan = target.plan === "PRO" ? "FREE" : "PRO";

    // Optimistic UI update
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, plan: newPlan as any, subStatus: newPlan === "PRO" ? "ACTIVE" : "EXPIRED" }
          : u
      )
    );

    try {
      const res = await fetch("/api/super-admin/set-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target.email, plan: newPlan }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Revert optimistic update on failure
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, plan: target.plan, subStatus: target.subStatus } : u
          )
        );
        toast.error(data.error || "Failed to update plan");
        return;
      }

      toast.success(
        newPlan === "PRO"
          ? `💎 PRO granted to ${target.name} — no payment required`
          : `PRO revoked for ${target.name}`
      );

      // Add a record to the local transactions list for visibility
      if (newPlan === "PRO") {
        const adminTx = {
          txId: `ADMIN-GRANT-${Date.now()}`,
          userEmail: target.email,
          coupleNames: target.name,
          amount: 0,
          paymentMethod: "Admin Grant",
          upiId: "N/A",
          date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          status: "Approved & Active",
        };
        setProTransactions((prev) => [adminTx, ...prev]);
      } else {
        setProTransactions((prev) =>
          prev.map((tx) =>
            tx.userEmail === target.email ? { ...tx, status: "Revoked" } : tx
          )
        );
      }
    } catch (err) {
      toast.error("Network error — could not update plan");
      // Revert
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, plan: target.plan, subStatus: target.subStatus } : u
        )
      );
    }
  };

  const handleApproveTransaction = (txId: string, action: "Approve" | "Revoke") => {
    let userEmail = "";
    const updatedTx = proTransactions.map((tx) => {
      if (tx.txId === txId) {
        userEmail = tx.userEmail;
        return { ...tx, status: action === "Approve" ? "Approved & Active" : "Revoked" };
      }
      return tx;
    });
    setProTransactions(updatedTx);
    localStorage.setItem("vivaha_pro_transactions", JSON.stringify(updatedTx));

    if (userEmail) {
      const newPlan = action === "Approve" ? "PRO" : "FREE";
      const newStatus = action === "Approve" ? "ACTIVE" : "EXPIRED";
      setUsersList((prev) =>
        prev.map((u) => (u.email === userEmail ? { ...u, plan: newPlan as any, subStatus: newStatus as any } : u))
      );

      try {
        const regStr = localStorage.getItem("vivaha_registered_users") || "[]";
        const regList = JSON.parse(regStr);
        const updatedReg = regList.map((u: any) =>
          u.email === userEmail ? { ...u, plan: newPlan, isPro: newPlan === "PRO" } : u
        );
        localStorage.setItem("vivaha_registered_users", JSON.stringify(updatedReg));
      } catch (e) {}
    }

    toast.success(`Transaction ${txId} has been ${action === "Approve" ? "Approved & Activated" : "Revoked"}!`);
  };

  const handleSaveGlobalAdConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("vivaha_global_ad_config", JSON.stringify(globalAdConfig));
    toast.success("Global Advertisement configuration saved and applied across Free accounts!");
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = printOrders.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
    setPrintOrders(updated);
    localStorage.setItem("vivaha_print_orders", JSON.stringify(updated));
    toast.success(`Updated order ${orderId} fulfillment status to: ${newStatus}!`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    try {
      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "super-admin", username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        toast.success("Super Admin access granted!");
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Failed to authenticate against server .env");
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    setIsAuthenticated(false);
    toast.success("Signed out of Super Admin Command Hub");
  };

  // Governance actions
  const handleStatusToggle = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          toast.success(`Account @${u.username} marked as ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete account "${name}"? This will also delete all their invitations, RSVPs, and WhatsApp logs.`)) {
      try {
        const res = await fetch(`/api/super-admin/users?userId=${id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) throw new Error("Failed to delete user");

        setUsersList((prev) => prev.filter((u) => u.id !== id));
        toast.error(`Account "${name}" and all associated data permanently deleted.`);
      } catch (e) {
        toast.error("Failed to delete user on server.");
      }
    }
  };

  const handleResetUserViews = async (id: string, username: string, name: string) => {
    if (confirm(`Are you sure you want to reset unique visitor view count to 0 for "${name}" (/invite/${username})?`)) {
      setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, views: 0 } : u)));
      try {
        await fetch("/api/super-admin/reset-views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id, username }),
        });
        toast.success(`Reset view count to 0 for "${name}".`);
      } catch (e) {
        toast.error("Failed to reset views on server.");
      }
    }
  };

  const handleToggleAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMode = !alertEnabled;
    setAlertEnabled(newMode);
    
    try {
      await fetch("/api/system-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenanceMode,
          maintenanceText,
          maintenanceDate,
          alertEnabled: newMode,
          alertText: announcement
        })
      });
      window.dispatchEvent(new Event("vivaha_maintenance_updated"));
      toast.success(newMode ? "Global Alert activated!" : "Global Alert disabled!");
    } catch (error) {
      toast.error("Failed to update alert settings.");
      setAlertEnabled(!newMode);
    }
  };

  const handleToggleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMode = !maintenanceMode;
    setMaintenanceMode(newMode);
    
    // Save to database via API
    try {
      await fetch("/api/system-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenanceMode: newMode,
          maintenanceText,
          maintenanceDate,
          alertEnabled,
          alertText: announcement
        })
      });
      // Dispatch event so same-window layouts pick up the change immediately
      window.dispatchEvent(new Event("vivaha_maintenance_updated"));
      toast.success(newMode ? "Maintenance mode activated globally in Database!" : "Maintenance mode disabled globally!");
    } catch (error) {
      toast.error("Failed to update maintenance settings in database.");
      // Revert optimism
      setMaintenanceMode(!newMode);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupleName || !newSlug || !newEmail) return;

    const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: newCoupleName,
      username: cleanSlug,
      email: newEmail,
      role: "USER",
      status: "ACTIVE",
      provider: "credentials",
      invitationsCount: 1,
      joinedDate: "July 2026",
      rsvpsCount: 0,
      views: 1,
      isDemo: false,
    };

    setUsersList([newUser, ...usersList]);
    setNewCoupleName("");
    setNewSlug("");
    setNewEmail("");
    setShowAddModal(false);
    toast.success(`Onboarded new couple account: @${cleanSlug}!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111827] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-sm shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 rounded-full text-[10px] uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Executive Governance Control</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white">Super Admin Portal</h1>
            <p className="text-xs text-gray-400">Enter secure company credentials verified via .env file</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Username (.env SUPER_ADMIN_USERNAME)
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="e.g. superadmin"
                className="w-full bg-gray-950 border border-gray-800 px-3.5 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Password (.env SUPER_ADMIN_PASSWORD)
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-gray-950 border border-gray-800 px-3.5 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xs text-xs uppercase tracking-widest transition-all shadow-lg mt-2 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loadingAuth ? "Verifying .env..." : "Authenticate Command Hub"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      (activeDirectoryTab === "registered" ? !u.isDemo : !!u.isDemo) &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#111827] text-white py-8 sm:py-12 px-4 sm:px-8 md:px-12 font-sans relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-widest font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin Command Hub</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white">VivahaLuxe Platform Governance</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-widest rounded-xs transition-all font-bold flex items-center gap-1.5 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User / Couple</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/80 hover:bg-red-900 text-red-400 text-xs uppercase tracking-widest rounded-xs transition-all font-bold flex items-center gap-1.5 border border-red-900/50"
            >
              <Power className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Maintenance Window Banner Display */}
        {maintenanceMode && (
          <div className="bg-red-950/80 border border-red-900/50 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-900/50 p-2 rounded-full shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider">Maintenance Window Active</h3>
                <p className="text-red-200/80 text-xs mt-0.5">
                  {maintenanceText}
                  {maintenanceDate && ` on ${new Date(maintenanceDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMaintenanceMode(false)}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-100 text-xs uppercase tracking-widest rounded-xs transition-all font-bold whitespace-nowrap self-end sm:self-auto"
            >
              Disable Mode
            </button>
          </div>
        )}

        {/* Global Banner Broadcast Control */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-sm shadow-md">
          <form onSubmit={handleToggleAlert} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Bell className="w-4 h-4" />
                <span>Platform Banner Broadcast Control</span>
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 px-4 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className={`${alertEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-600 hover:bg-amber-500'} text-white font-bold px-6 py-2.5 rounded-xs text-xs uppercase tracking-widest shrink-0 transition-all shadow-md self-end sm:self-auto`}
            >
              {alertEnabled ? 'Disable Alert' : 'Broadcast Alert'}
            </button>
          </form>
        </div>

        {/* Maintenance Window Control */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-sm shadow-md">
          <form onSubmit={handleToggleMaintenance} className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Maintenance Window Control</span>
                </label>
                <input
                  type="text"
                  value={maintenanceText}
                  onChange={(e) => setMaintenanceText(e.target.value)}
                  placeholder="Enter maintenance reason/message..."
                  className="w-full bg-gray-950 border border-gray-800 px-4 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-red-500"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Date</label>
                <div className="pt-1">
                  <WeddingDatePicker 
                    value={maintenanceDate} 
                    onChange={(dateStr) => setMaintenanceDate(dateStr)} 
                    placeholder="Select maintenance date"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`${maintenanceMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'} text-white font-bold px-6 py-2.5 rounded-xs text-xs uppercase tracking-widest shrink-0 transition-all shadow-md self-end sm:self-auto h-fit`}
            >
              {maintenanceMode ? 'Disable Maintenance' : 'Activate Maintenance'}
            </button>
          </form>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Total Registered</span>
            <p className="text-2xl font-serif mt-1 text-emerald-400">{usersList.filter((u) => !u.isDemo).length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Free Accounts</span>
            <p className="text-2xl font-serif mt-1 text-gray-300">{usersList.filter((u) => !u.isDemo && u.plan !== "PRO").length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">💎 Pro Subscribers</span>
            <p className="text-2xl font-serif mt-1 text-purple-400">{usersList.filter((u) => !u.isDemo && u.plan === "PRO").length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Pro Revenue</span>
            <p className="text-2xl font-serif mt-1 text-amber-400">₹{(usersList.filter((u) => !u.isDemo && u.plan === "PRO").length * 499).toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Showcase Demo</span>
            <p className="text-2xl font-serif mt-1 text-blue-400">{usersList.filter((u) => u.isDemo).length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Platform RSVPs</span>
            <p className="text-2xl font-serif mt-1 text-rose-400">116</p>
          </div>
        </div>

        {/* Review Table & Governance Actions Section */}
        <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-white">Platform User Governance Directory</h2>
              <p className="text-xs text-gray-400 mt-1">Separate directory views for real registered users vs built-in evaluation dummy accounts.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search couples or slugs..."
                className="w-full bg-gray-950 border border-gray-800 pl-9 pr-4 py-2 text-xs rounded-xs text-white focus:outline-hidden focus:border-gray-700"
              />
            </div>
          </div>

          {/* Directory Tabs */}
          <div className="flex border-b border-gray-800 gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveDirectoryTab("overview")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "overview"
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveDirectoryTab("registered")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "registered"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Users ({usersList.filter((u) => !u.isDemo).length})</span>
            </button>
            <button
              onClick={() => setActiveDirectoryTab("demo")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "demo"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Dummy Showcase / Demo Users ({usersList.filter((u) => u.isDemo).length})</span>
            </button>
            <button
              onClick={() => setActiveDirectoryTab("print-orders")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "print-orders"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Physical Print Orders Hub ({printOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveDirectoryTab("pro-subscriptions")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "pro-subscriptions"
                  ? "border-rose-400 text-rose-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <span>💎 Pro Subscriptions &amp; Ad Management</span>
            </button>
            <button
              onClick={() => setActiveDirectoryTab("email-logs")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "email-logs"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>📧 Email Logs ({emailLogs.length})</span>
            </button>
            <button
              onClick={() => setActiveDirectoryTab("system-errors")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "system-errors"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>🚨 System Errors ({systemErrors.filter(e => e.status === "OPEN").length})</span>
            </button>
            <button
              onClick={() => { setActiveDirectoryTab("testimonials"); refreshTestimonials(); }}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDirectoryTab === "testimonials"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <span>⭐ Testimonials ({testimonialsList.length})</span>
            </button>
          </div>

          {activeDirectoryTab === "overview" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif text-white">System Overview</h3>
                  <p className="text-xs text-gray-400 mt-0.5">High-level metrics and system performance dashboard.</p>
                </div>
                <button
                  onClick={refreshSystemStats}
                  disabled={systemStatsLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs uppercase tracking-widest rounded-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${systemStatsLoading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-950 border border-gray-800 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Total Real Users</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-serif text-white">{usersList.filter((u) => !u.isDemo).length}</p>
                </div>

                <div className="bg-gray-950 border border-gray-800 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Total Profit (Pro)</span>
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-serif text-white">₹{(usersList.filter((u) => !u.isDemo && u.plan === "PRO").length * 499).toLocaleString("en-IN")}</p>
                </div>

                <div className="bg-gray-950 border border-gray-800 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Unresolved Errors</span>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-2xl font-serif text-white">{systemErrors.filter(e => e.status === "OPEN").length}</p>
                </div>
                
                <div className="bg-gray-950 border border-gray-800 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Uptime</span>
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-serif text-white">
                    {systemStats?.uptime ? `${Math.floor(systemStats.uptime / 3600)}h ${Math.floor((systemStats.uptime % 3600) / 60)}m` : "—"}
                  </p>
                </div>
              </div>

              {systemStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-950 border border-gray-800 p-5 rounded-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-4">CPU Utilization</h4>
                    <div className="flex items-end gap-4">
                      <div className="text-3xl font-serif text-white">{systemStats.cpu.percent}%</div>
                      <div className="text-xs text-gray-500 pb-1">{systemStats.cpu.cores} Cores</div>
                    </div>
                    <div className="w-full bg-gray-800 h-2 mt-4 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full transition-all" style={{ width: `${systemStats.cpu.percent}%` }} />
                    </div>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 p-5 rounded-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-4">Memory (RAM) Usage</h4>
                    <div className="flex items-end gap-4">
                      <div className="text-3xl font-serif text-white">{systemStats.memory.percent}%</div>
                      <div className="text-xs text-gray-500 pb-1">{systemStats.memory.usedGB} GB / {systemStats.memory.totalGB} GB</div>
                    </div>
                    <div className="w-full bg-gray-800 h-2 mt-4 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${systemStats.memory.percent > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${systemStats.memory.percent}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeDirectoryTab === "email-logs" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif text-white">Outbound Email Delivery Logs</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time tracking of every email sent from the platform — OTP, Welcome, Invitation, Order, and Payment notifications.</p>
                </div>
                <button
                  onClick={refreshEmailLogs}
                  disabled={emailLogsLoading}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs uppercase tracking-widest rounded-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${emailLogsLoading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* KPI Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-950 border border-gray-800 p-4 rounded-xs">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Total Sent</span>
                  <p className="text-xl font-serif mt-1 text-cyan-400">{emailLogs.length}</p>
                </div>
                <div className="bg-gray-950 border border-gray-800 p-4 rounded-xs">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">✅ Success</span>
                  <p className="text-xl font-serif mt-1 text-emerald-400">{emailLogs.filter((l: any) => l.status === "SUCCESS").length}</p>
                </div>
                <div className="bg-gray-950 border border-gray-800 p-4 rounded-xs">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">❌ Failed</span>
                  <p className="text-xl font-serif mt-1 text-red-400">{emailLogs.filter((l: any) => l.status === "FAILED").length}</p>
                </div>
                <div className="bg-gray-950 border border-gray-800 p-4 rounded-xs">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Sources</span>
                  <p className="text-xl font-serif mt-1 text-amber-400">{new Set(emailLogs.map((l: any) => l.source)).size}</p>
                </div>
              </div>

              {emailLogsLoading ? (
                <div className="text-center py-12 text-gray-500 text-sm">Loading email logs...</div>
              ) : emailLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">No email logs recorded yet. Logs will appear here once emails are sent from the platform.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Source</th>
                        <th className="py-3 px-3">Recipient</th>
                        <th className="py-3 px-3">Subject</th>
                        <th className="py-3 px-3">Error</th>
                        <th className="py-3 px-3">Timestamp (IST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {emailLogs.map((log: any, idx: number) => (
                        <tr key={log.id || idx} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-3 px-3">
                            {log.status === "SUCCESS" ? (
                              <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">✅ Sent</span>
                            ) : (
                              <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">❌ Failed</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider border ${
                              log.source === "register" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                              log.source === "welcome" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" :
                              log.source === "invitation" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                              log.source === "order" ? "bg-orange-500/10 text-orange-400 border-orange-500/30" :
                              log.source === "payment" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                              "bg-gray-500/10 text-gray-400 border-gray-500/30"
                            }`}>{log.source}</span>
                          </td>
                          <td className="py-3 px-3 text-gray-300 font-mono text-[11px] max-w-[180px] truncate" title={log.to}>{log.to}</td>
                          <td className="py-3 px-3 text-gray-300 max-w-[250px] truncate" title={log.subject}>{log.subject}</td>
                          <td className="py-3 px-3 text-red-400 max-w-[200px] truncate text-[10px]" title={log.error || ""}>{log.error || "—"}</td>
                          <td className="py-3 px-3 text-gray-500 text-[11px] whitespace-nowrap">{log.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeDirectoryTab === "system-errors" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif text-white">Application Global Errors</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time error boundary captures across the entire application.</p>
                </div>
                <button
                  onClick={refreshSystemErrors}
                  disabled={systemErrorsLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs uppercase tracking-widest rounded-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${systemErrorsLoading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {systemErrorsLoading ? (
                <div className="text-center py-12 text-gray-500 text-sm">Loading system errors...</div>
              ) : systemErrors.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">No errors found. Everything is running smoothly! 🎉</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {systemErrors.map((err) => (
                    <div key={err.id} className="bg-gray-950 border border-gray-800 rounded-sm p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              err.status === "OPEN" ? "bg-red-500/20 text-red-400" :
                              err.status === "RESOLVED" ? "bg-emerald-500/20 text-emerald-400" :
                              "bg-gray-500/20 text-gray-400"
                            }`}>
                              {err.status}
                            </span>
                            <span className="text-gray-400 text-xs">Path: <span className="text-white font-mono">{err.path || "Global"}</span></span>
                            <span className="text-gray-500 text-xs">{new Date(err.createdAt).toLocaleString()}</span>
                          </div>
                          <h4 className="text-red-400 font-bold text-sm">{err.message}</h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {err.status === "OPEN" && (
                            <>
                              <button onClick={() => updateSystemErrorStatus(err.id, "RESOLVED")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-widest rounded-xs transition-colors">
                                Resolve
                              </button>
                              <button onClick={() => updateSystemErrorStatus(err.id, "DISMISSED")} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-[10px] uppercase font-bold tracking-widest rounded-xs transition-colors">
                                Dismiss
                              </button>
                            </>
                          )}
                          <button onClick={async () => {
                            if (!confirm("Delete this error log completely?")) return;
                            try {
                              const res = await fetch(`/api/super-admin/system-errors/${err.id}`, { method: "DELETE" });
                              if (res.ok) {
                                toast.success("Error deleted");
                                refreshSystemErrors();
                              }
                            } catch (e) {
                              toast.error("Failed to delete");
                            }
                          }} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {err.stack && (
                        <div className="bg-[#1a1a1a] p-3 rounded text-[11px] font-mono text-gray-400 overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap border border-gray-800">
                          {err.stack}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeDirectoryTab === "testimonials" ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif text-white">⭐ Homepage Testimonials Manager</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add, edit, hide, or delete couple testimonials shown on the public homepage carousel.</p>
                </div>
                <button
                  onClick={refreshTestimonials}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-xs border border-gray-700 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>

              {/* ── Add New Testimonial Form ── */}
              <div className="bg-gray-900 border border-gray-800 rounded-sm p-6 space-y-5">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  {editingTestimonial ? "✏️ Edit Testimonial" : "➕ Add New Testimonial"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Couple Name *</label>
                    <input
                      type="text"
                      value={editingTestimonial ? editingTestimonial.name : newTestimonial.name}
                      onChange={(e) => editingTestimonial
                        ? setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                        : setNewTestimonial({ ...newTestimonial, name: e.target.value })
                      }
                      placeholder="e.g. Ananya & Karthik Iyer"
                      className="w-full bg-gray-950 border border-gray-800 px-3 py-2 text-xs text-white rounded-xs focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Wedding Venue</label>
                    <input
                      type="text"
                      value={editingTestimonial ? editingTestimonial.venue : newTestimonial.venue}
                      onChange={(e) => editingTestimonial
                        ? setEditingTestimonial({ ...editingTestimonial, venue: e.target.value })
                        : setNewTestimonial({ ...newTestimonial, venue: e.target.value })
                      }
                      placeholder="e.g. Taj Coromandel, Chennai"
                      className="w-full bg-gray-950 border border-gray-800 px-3 py-2 text-xs text-white rounded-xs focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Display Date</label>
                    <input
                      type="text"
                      value={editingTestimonial ? editingTestimonial.date : newTestimonial.date}
                      onChange={(e) => editingTestimonial
                        ? setEditingTestimonial({ ...editingTestimonial, date: e.target.value })
                        : setNewTestimonial({ ...newTestimonial, date: e.target.value })
                      }
                      placeholder="e.g. March 2026"
                      className="w-full bg-gray-950 border border-gray-800 px-3 py-2 text-xs text-white rounded-xs focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Star Rating (1–5)</label>
                    <select
                      value={editingTestimonial ? editingTestimonial.rating : newTestimonial.rating}
                      onChange={(e) => editingTestimonial
                        ? setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })
                        : setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })
                      }
                      className="w-full bg-gray-950 border border-gray-800 px-3 py-2 text-xs text-white rounded-xs focus:outline-hidden focus:border-amber-400"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Testimonial Quote *</label>
                    <textarea
                      rows={3}
                      value={editingTestimonial ? editingTestimonial.quote : newTestimonial.quote}
                      onChange={(e) => editingTestimonial
                        ? setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                        : setNewTestimonial({ ...newTestimonial, quote: e.target.value })
                      }
                      placeholder="What did this couple say about VivahaLuxe?"
                      className="w-full bg-gray-950 border border-gray-800 px-3 py-2 text-xs text-white rounded-xs focus:outline-hidden focus:border-amber-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Theme Badge Label</label>
                    <input
                      type="text"
                      value={editingTestimonial ? editingTestimonial.theme : newTestimonial.theme}
                      onChange={(e) => editingTestimonial
                        ? setEditingTestimonial({ ...editingTestimonial, theme: e.target.value })
                        : setNewTestimonial({ ...newTestimonial, theme: e.target.value })
                      }
                      placeholder="e.g. Heritage Emerald (optional)"
                      className="w-full bg-gray-950 border border-gray-800 px-3 py-2 text-xs text-white rounded-xs focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Badge BG Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editingTestimonial ? editingTestimonial.themeColor : newTestimonial.themeColor}
                          onChange={(e) => editingTestimonial
                            ? setEditingTestimonial({ ...editingTestimonial, themeColor: e.target.value })
                            : setNewTestimonial({ ...newTestimonial, themeColor: e.target.value })
                          }
                          className="w-9 h-9 rounded cursor-pointer border border-gray-700 bg-transparent"
                        />
                        <span className="text-xs text-gray-400 font-mono">
                          {editingTestimonial ? editingTestimonial.themeColor : newTestimonial.themeColor}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Badge Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editingTestimonial ? editingTestimonial.textColor : newTestimonial.textColor}
                          onChange={(e) => editingTestimonial
                            ? setEditingTestimonial({ ...editingTestimonial, textColor: e.target.value })
                            : setNewTestimonial({ ...newTestimonial, textColor: e.target.value })
                          }
                          className="w-9 h-9 rounded cursor-pointer border border-gray-700 bg-transparent"
                        />
                        <span className="text-xs text-gray-400 font-mono">
                          {editingTestimonial ? editingTestimonial.textColor : newTestimonial.textColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview badge */}
                {(editingTestimonial?.theme || newTestimonial.theme) && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Badge Preview:</span>
                    <span
                      className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border"
                      style={{
                        background: editingTestimonial ? editingTestimonial.themeColor : newTestimonial.themeColor,
                        color: editingTestimonial ? editingTestimonial.textColor : newTestimonial.textColor,
                        borderColor: (editingTestimonial ? editingTestimonial.textColor : newTestimonial.textColor) + "40",
                      }}
                    >
                      {editingTestimonial ? editingTestimonial.theme : newTestimonial.theme}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  {editingTestimonial ? (
                    <>
                      <button
                        onClick={handleSaveEditTestimonial}
                        disabled={savingTestimonial}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-xs transition-all disabled:opacity-50"
                      >
                        {savingTestimonial ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setEditingTestimonial(null)}
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddTestimonial}
                      disabled={savingTestimonial}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-xs transition-all disabled:opacity-50"
                    >
                      {savingTestimonial ? "Adding..." : "➕ Add Testimonial"}
                    </button>
                  )}
                </div>
              </div>

              {/* ── Existing Testimonials List ── */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Saved Testimonials ({testimonialsList.length})
                </h4>
                {testimonialsAdminLoading ? (
                  <div className="text-xs text-gray-400 py-6 text-center animate-pulse">Loading testimonials...</div>
                ) : testimonialsList.length === 0 ? (
                  <div className="text-xs text-gray-500 py-8 text-center border border-dashed border-gray-800 rounded-sm">
                    No testimonials yet. Add your first one above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testimonialsList.map((t, idx) => (
                      <div
                        key={t.id}
                        className={`bg-gray-900 border rounded-sm p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all ${
                          t.isVisible ? "border-gray-700" : "border-gray-800 opacity-60"
                        }`}
                      >
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{t.name}</span>
                            {!t.isVisible && (
                              <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-gray-700">
                                Hidden
                              </span>
                            )}
                            {t.theme && (
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border"
                                style={{ background: t.themeColor, color: t.textColor, borderColor: t.textColor + "40" }}
                              >
                                {t.theme}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-300">
                            {"★".repeat(Math.min(5, t.rating))}{"☆".repeat(Math.max(0, 5 - t.rating))}
                          </p>
                          <p className="text-xs text-gray-300 italic leading-relaxed line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                          <p className="text-[10px] text-gray-500">{t.venue} {t.date && `• ${t.date}`}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Visibility toggle */}
                          <button
                            onClick={() => handleToggleVisibility(t)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border transition-all ${
                              t.isVisible
                                ? "border-emerald-600 text-emerald-400 hover:bg-emerald-900/30"
                                : "border-gray-700 text-gray-500 hover:border-emerald-600 hover:text-emerald-400"
                            }`}
                            title={t.isVisible ? "Click to hide from homepage" : "Click to show on homepage"}
                          >
                            {t.isVisible ? "👁 Visible" : "🚫 Hidden"}
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => setEditingTestimonial({ ...t })}
                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border border-blue-700 text-blue-400 hover:bg-blue-900/30 transition-all"
                          >
                            Edit
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border border-red-800 text-red-400 hover:bg-red-900/30 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeDirectoryTab !== "print-orders" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Couple Name</th>
                    <th className="py-3 px-4">Custom Slug URL</th>
                    <th className="py-3 px-4">Contact Email</th>
                    <th className="py-3 px-4">Auth Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Unique Views</th>
                    <th className="py-3 px-4 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                      <td className="py-4 px-4 font-mono text-emerald-400">
                        <Link href={`/invite/${u.invitationSlug || u.username}`} target="_blank" className="hover:underline flex items-center gap-1">
                          <span>/invite/{u.invitationSlug || u.username}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{u.email}</td>
                      <td className="py-4 px-4 uppercase text-[10px] tracking-wider font-semibold text-amber-300">{u.provider}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase border ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                              : "bg-amber-950 text-amber-400 border-amber-800"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-emerald-400 font-bold">
                        <span className="bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60 inline-flex items-center gap-1.5 text-xs">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{u.views || 0}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Reset Views Button */}
                          <button
                            onClick={() => handleResetUserViews(u.id, u.username, u.name)}
                            title="Reset Unique Visitor View Count to 0"
                            className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xs text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors border border-gray-700"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400" />
                            <span>Reset Views</span>
                          </button>

                          {/* Suspend / Activate Toggle */}
                          <button
                            onClick={() => handleStatusToggle(u.id)}
                            title={u.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                            className={`px-3 py-1.5 rounded-xs text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              u.status === "ACTIVE"
                                ? "bg-amber-900/60 hover:bg-amber-800 text-amber-200"
                                : "bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200"
                            }`}
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Permanently Delete Account"
                            className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 hover:text-red-200 rounded-xs transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Manage order production lifecycle: In Review → In Progress → In Transit → Delivered.</p>
                <button
                  onClick={() => {
                    try {
                      const ordStr = localStorage.getItem("vivaha_print_orders") || "[]";
                      setPrintOrders(JSON.parse(ordStr));
                      toast.success("Refreshed print orders from storage!");
                    } catch (e) {}
                  }}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-white rounded font-semibold uppercase tracking-wider flex items-center gap-1"
                >
                  <span>Reload Orders</span>
                </button>
              </div>

              {printOrders.length === 0 ? (
                <div className="p-8 text-center bg-gray-950 border border-dashed border-gray-800 rounded-sm text-xs text-gray-500">
                  No bulk physical card print orders submitted yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Couple / Email</th>
                      <th className="py-3 px-3">Card Design</th>
                      <th className="py-3 px-3">Quantity</th>
                      <th className="py-3 px-3">Total Amount</th>
                      <th className="py-3 px-3">Delivery Address</th>
                      <th className="py-3 px-3 text-right">Update Lifecycle Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {printOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{ord.id}</td>
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white">{ord.coupleNames}</p>
                          <p className="text-[11px] text-gray-400">{ord.userEmail}</p>
                          <p className="text-[10px] text-emerald-400">{ord.contactMobile}</p>
                        </td>
                        <td className="py-3.5 px-3 text-white font-medium">{ord.design}</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-300">{ord.quantity} units</td>
                        <td className="py-3.5 px-3 font-serif font-bold text-purple-400">₹{ord.totalAmount?.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-3 text-gray-300 max-w-xs truncate" title={ord.deliveryAddress}>{ord.deliveryAddress}</td>
                        <td className="py-3.5 px-3 text-right">
                          <select
                            value={ord.status || "In Review"}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-gray-950 border border-gray-700 text-white px-3 py-1.5 rounded text-xs font-bold focus:outline-hidden focus:border-purple-400 cursor-pointer"
                          >
                            <option value="In Review">In Review</option>
                            <option value="In Progress">In Progress</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeDirectoryTab === "pro-subscriptions" && (
            <div className="space-y-8">
              {/* User Subscription Tier Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-lg font-serif text-white">Couple Subscription Tiers &amp; Approvals</h3>
                    <p className="text-xs text-gray-400">Toggle individual account statuses between Free (ad-supported) and Pro (₹499 ad-free).</p>
                  </div>
                  <span className="text-xs bg-purple-950 text-purple-300 px-3 py-1 rounded-full border border-purple-800 font-bold">
                    Pro Conversion Rate: {((usersList.filter((u) => !u.isDemo && u.plan === "PRO").length / Math.max(1, usersList.filter((u) => !u.isDemo).length)) * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                        <th className="py-3 px-3">Couple / User</th>
                        <th className="py-3 px-3">Contact Email</th>
                        <th className="py-3 px-3">Account Plan</th>
                        <th className="py-3 px-3">Subscription Status</th>
                        <th className="py-3 px-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {usersList.filter((u) => !u.isDemo).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-gray-500 text-xs italic">
                            No real registered users yet. Pro subscriptions will appear here once users sign up.
                          </td>
                        </tr>
                      ) : (
                        usersList.filter((u) => !u.isDemo).map((u) => (
                        <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-white">{u.name}</td>
                          <td className="py-3.5 px-3 text-gray-300">{u.email}</td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              u.plan === "PRO"
                                ? "bg-purple-950 text-purple-300 border border-purple-700"
                                : "bg-gray-800 text-gray-300"
                            }`}>
                              {u.plan === "PRO" ? "💎 PRO PLAN" : "FREE PLAN"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.subStatus === "ACTIVE"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-red-950 text-red-400 border border-red-800"
                            }`}>
                              {u.subStatus || "EXPIRED"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleToggleUserProPlan(u.id)}
                              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all shadow-xs ${
                                u.plan === "PRO"
                                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                  : "bg-purple-600 hover:bg-purple-500 text-white"
                              }`}
                            >
                              {u.plan === "PRO" ? "Revoke Pro Status" : "Activate Pro (₹499)"}
                            </button>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pro Transactions Log */}
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div>
                  <h3 className="text-lg font-serif text-white">Payment Management &amp; Revenue Transactions</h3>
                  <p className="text-xs text-gray-400">All verified ₹499 lifetime Pro subscription upgrade transactions.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                        <th className="py-3 px-3">Transaction ID</th>
                        <th className="py-3 px-3">User Email</th>
                        <th className="py-3 px-3">Couple Name</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Method / VPA</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Governance Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {proTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-gray-500 text-xs italic">
                            No real payment transactions yet. Razorpay payments will appear here automatically.
                          </td>
                        </tr>
                      ) : (
                        proTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{tx.txId}</td>
                          <td className="py-3.5 px-3 text-gray-300">{tx.userEmail}</td>
                          <td className="py-3.5 px-3 font-bold text-white">{tx.coupleNames}</td>
                          <td className="py-3.5 px-3 font-serif font-bold text-purple-400">
                            {tx.amount === 0 ? (
                              <span className="text-blue-400">Free (Admin)</span>
                            ) : (
                              <>₹{tx.amount}</>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-gray-400">
                            {tx.grantedByAdmin ? (
                              <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[10px] font-bold uppercase tracking-wider">Admin Grant</span>
                            ) : (
                              <>{tx.paymentMethod} ({tx.upiId})</>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-gray-400">{tx.date}</td>
                          <td className="py-3.5 px-3">
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${
                              tx.status === "Active" || tx.status === "Approved & Active"
                                ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                : tx.status === "Revoked"
                                ? "bg-red-950 text-red-400 border-red-800"
                                : "bg-amber-950 text-amber-400 border-amber-800 animate-pulse"
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {(tx.status === "Pending Approval" || tx.status === "Revoked") && (
                                <button
                                  onClick={() => handleApproveTransaction(tx.txId, "Approve")}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] uppercase tracking-wider transition-all shadow-sm"
                                >
                                  Approve &amp; Activate Pro
                                </button>
                              )}
                              {(tx.status === "Active" || tx.status === "Approved & Active") && (
                                <button
                                  onClick={() => handleApproveTransaction(tx.txId, "Revoke")}
                                  className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 font-bold rounded text-[10px] uppercase tracking-wider transition-all"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Global Advertisement Banner Configuration */}
              <div className="bg-gray-950 p-6 rounded border border-gray-800 space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-lg font-serif text-white">Partner Advertisement Broadcast Configuration</h3>
                    <p className="text-xs text-gray-400">Configure sponsored banner content broadcast across all Free tier landing pages.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={globalAdConfig.enabled}
                      onChange={(e) => setGlobalAdConfig({ ...globalAdConfig, enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ads Enabled</span>
                  </label>
                </div>

                <form onSubmit={handleSaveGlobalAdConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Sponsor Name / Brand</label>
                    <input
                      type="text"
                      value={globalAdConfig.sponsorName}
                      onChange={(e) => setGlobalAdConfig({ ...globalAdConfig, sponsorName: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 px-3 py-2 text-xs rounded text-white focus:outline-hidden focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Call to Action Text</label>
                    <input
                      type="text"
                      value={globalAdConfig.ctaText}
                      onChange={(e) => setGlobalAdConfig({ ...globalAdConfig, ctaText: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 px-3 py-2 text-xs rounded text-white focus:outline-hidden focus:border-purple-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Advertisement Headline / Tagline</label>
                    <input
                      type="text"
                      value={globalAdConfig.tagline}
                      onChange={(e) => setGlobalAdConfig({ ...globalAdConfig, tagline: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 px-3 py-2 text-xs rounded text-white focus:outline-hidden focus:border-purple-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Target Destination Link URL</label>
                    <input
                      type="text"
                      value={globalAdConfig.linkUrl}
                      onChange={(e) => setGlobalAdConfig({ ...globalAdConfig, linkUrl: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 px-3 py-2 text-xs rounded text-white focus:outline-hidden focus:border-purple-400 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded text-xs uppercase tracking-widest shadow-md transition-all"
                    >
                      Save &amp; Broadcast Global Ad Config
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-sm max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-serif text-xl">
                <UserPlus className="w-5 h-5" />
                <span>Onboard New Couple</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">Couple Display Names</label>
                <input
                  type="text"
                  required
                  value={newCoupleName}
                  onChange={(e) => setNewCoupleName(e.target.value)}
                  placeholder="e.g. Arjun & Priya"
                  className="w-full bg-gray-950 border border-gray-800 px-3.5 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">Unique URL Slug (/invite/slug)</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. arjun-priya"
                  className="w-full bg-gray-950 border border-gray-800 px-3.5 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">Contact Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="arjun@domain.com"
                  className="w-full bg-gray-950 border border-gray-800 px-3.5 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xs text-xs uppercase tracking-widest font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xs text-xs uppercase tracking-widest font-bold shadow-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
