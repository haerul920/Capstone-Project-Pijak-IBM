"use client";

import { useState, useEffect } from "react";
import {
  Download,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Activity,
  Brain,
  BarChart3,
  AlertTriangle,
  Bell,
  Package,
  TrendingUp,
} from "lucide-react";

import OrdersHero from "@/app/components/admin/orders/OrdersHero";
import OrdersKpiStrip from "@/app/components/admin/orders/OrdersKpiStrip";
import OrdersTable from "@/app/components/admin/orders/OrdersTable";
import OrdersAnalytics from "@/app/components/admin/orders/OrdersAnalytics";
import AddSalesModal from "@/app/components/admin/orders/AddSalesModal";
import { useLanguageStore, translations } from "@/store/languageStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { toast } from "sonner";

/* ─── Section Header ──────────────────────────────────────────── */
function SectionHeader({
  icon: Icon,
  label,
  title,
  sub,
  accent = "text-blue-600",
  accentBg = "bg-blue-50 dark:bg-blue-500/10",
  accentBorder = "border-blue-100 dark:border-blue-500/20",
}: {
  icon: React.ElementType;
  label: string;
  title: string;
  sub: string;
  accent?: string;
  accentBg?: string;
  accentBorder?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-2xl ${accentBg} border ${accentBorder} flex items-center justify-center shrink-0 shadow-sm`}
      >
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function OrdersPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { addNotification } = useNotificationStore();
  const { format } = useFormatCurrency();

  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddSalesOpen, setIsAddSalesOpen] = useState(false);

  const TABS = [
    { id: "overview", label: t.overview || "Overview" },
    { id: "analytics", label: t.analytics || "Analytics" },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(language === "ID" ? "Data Diperbarui" : "Data Synchronized", {
        description: language === "ID" ? "Sistem logistik telah diperbarui secara real-time." : "Logistics registry has been updated in real-time."
      });
    }, 1200);
  };

  const handleNewOrder = () => {
    setIsAddSalesOpen(true);
  };

  // Simulate notification when a new order comes in (for demo purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: "Pesanan Baru",
        description: `Customer #9402 baru saja melakukan pembelian sebesar ${format(1250000)}.`,
        type: "SUCCESS",
        source: "Sales"
      });
    }, 15000); // 15 seconds after load
    return () => clearTimeout(timer);
  }, [addNotification, format]);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-[1600px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            {/* Title block */}
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                {t.ordersTitleHeader || "Order Management"}
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-2">
                Executive logistics command · <span className="font-black text-blue-600">94 {t.ordersToday || "orders today"}</span>
              </p>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-500" : "text-slate-400"}`}
                />
                {t.refresh || "Refresh"}
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
                <Download className="w-3.5 h-3.5 text-slate-400" />
                {t.export || "Export"}
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                {t.filters || "Filters"}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <button 
                onClick={handleNewOrder}
                className="flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.newOrder || "New Order"}
              </button>
            </div>
          </div>

          {/* Tab Strip */}
          <div className="flex items-center gap-8 mt-6 -mb-5 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 pb-3 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Area ──────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-12">

        {/* ── OVERVIEW TAB ────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Hero */}
            <OrdersHero />

            {/* KPI Strip */}
            <section className="space-y-6">
              <div>
                <SectionHeader 
                  icon={Activity}
                  label={t.dailyOperations || "Daily Operations"}
                  title={t.fulfillmentPipeline || "Fulfillment Pipeline"}
                  sub={t.fulfillmentDesc || "End-to-end logistics tracking and status monitoring."}
                />
              </div>
              <OrdersKpiStrip />
            </section>

            {/* Orders Table */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <SectionHeader 
                  icon={Package}
                  label={t.orderRegistry || "Order Registry"}
                  title={t.activeShipments || "Active Shipments & Exceptions"}
                  sub={t.registryDesc || "Real-time ledger of all customer transactions."}
                  accent="text-emerald-600"
                  accentBg="bg-emerald-50 dark:bg-emerald-500/10"
                  accentBorder="border-emerald-100 dark:border-emerald-500/20"
                />
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 tracking-widest uppercase">
                    {t.liveUpdates || "Live Updates"}
                  </span>
                </div>
              </div>
              <OrdersTable />
            </section>
          </div>
        )}

        {/* ── ANALYTICS TAB ───────────────────────────────────────── */}
        {activeTab === "analytics" && (
          <section className="animate-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
              <SectionHeader
                icon={BarChart3}
                label={t.visualization || "Visualization"}
                title={t.orderAnalyticsTitle || "Order Analytics & Heatmap"}
                sub={t.orderAnalyticsDesc || "Weekly performance trends and operational volume heatmap."}
                accent="text-blue-600"
                accentBg="bg-blue-50 dark:bg-blue-500/10"
                accentBorder="border-blue-100 dark:border-blue-500/20"
              />
            </div>
            <OrdersAnalytics />
          </section>
        )}

        {/* ── Footer spacer ─────────────────────────────────────── */}
        <div className="h-8" />
      </div>

      {/* Add Sales Modal */}
      <AddSalesModal 
        isOpen={isAddSalesOpen} 
        onClose={() => setIsAddSalesOpen(false)} 
      />
    </div>
  );
}
