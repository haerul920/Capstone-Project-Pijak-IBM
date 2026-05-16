"use client";
import { useState, useEffect } from "react";
import { useLanguageStore, translations } from "../../../store/languageStore";
import { useDashboardData } from "../../../hooks/useDashboardData";
import TopMetrics from "../../components/admin/dashboard/TopMetrics";
import SalesAnalytics from "../../components/admin/dashboard/SalesAnalytics";
import InventoryHealth from "../../components/admin/dashboard/InventoryHealth";
import AiActionCenter from "../../components/admin/dashboard/AiActionCenter";
import LiveActivityFeed from "../../components/admin/dashboard/LiveActivityFeed";
import ExecutiveCommandLayer from "../../components/admin/dashboard/ExecutiveCommandLayer";
import CustomerType from "../../components/admin/dashboard/CustomerType";
import TopRegions from "../../components/admin/dashboard/TopRegions";
import RevenueDistribution from "../../components/admin/dashboard/RevenueDistribution";
import ProfitMarginAnalysis from "../../components/admin/dashboard/ProfitMarginAnalysis";
import SalesHeatmap from "../../components/admin/dashboard/SalesHeatmap";
import CustomerFunnel from "../../components/admin/dashboard/CustomerFunnel";
import TopProducts from "../../components/admin/dashboard/TopProducts";
import AdminProductivityPanel from "../../components/admin/dashboard/AdminProductivityPanel";
import SmartRestockPrediction from "../../components/admin/dashboard/SmartRestockPrediction";
import InventoryAlertsEngine from "../../components/admin/dashboard/InventoryAlertsEngine";
import { useNotificationStore } from "@/store/notificationStore";
import { useUser } from "@clerk/nextjs";

export default function AdminDashboardPage() {
  const {
    isInitializing,
    metrics,
    risks,
    healthScore,
    forecast,
    aiRecommendations,
    isAiLoading,
    aiLastRefreshed,
    fetchAiData,
    events,
  } = useDashboardData();

  const { language } = useLanguageStore();
  const t = translations[language];
  const { addNotification } = useNotificationStore();
  const { user } = useUser();

  // Deterministic rendering strategy to prevent hydration mismatch.
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Trigger Login Success Notification once
    if (user) {
      addNotification({
        title: "Login Berhasil",
        description: `Selamat datang kembali, ${user.fullName || "Admin"}. Sesi Anda telah diverifikasi secara aman.`,
        type: "SUCCESS",
        source: "Auth"
      });
    }
  }, [user, addNotification]);

  if (!mounted) {
    return (
      <div className="p-8 bg-white dark:bg-slate-950 min-h-screen text-slate-500 font-medium flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          {language === "ID" ? "Menginisialisasi Platform Analisis Perusahaan..." : "Initializing Enterprise Analytics Platform..."}
        </div>
      </div>
    );
  }

  const criticalRisksCount = risks.filter(
    (r) => r.status === "CRITICAL",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Layer 0: Executive Command Summary (AI Insights) */}
        <ExecutiveCommandLayer
          metrics={metrics}
          aiRecommendationsCount={aiRecommendations.length}
          criticalStockCount={criticalRisksCount}
          isLoading={isInitializing}
        />

        {/* Layer 1: Critical Operational KPIs */}
        <TopMetrics
          metrics={metrics}
          isLoading={isInitializing}
          stockAlertsCount={criticalRisksCount}
        />

        {/* Layer 2: Core Predictive Engine */}
        <SalesAnalytics forecast={forecast} isLoading={isInitializing} />

        {/* Layer 2.25: Smart Inventory Restock Prediction (NEW) */}
        <SmartRestockPrediction isLoading={isInitializing} />

        {/* Layer 2.3: Inventory Alerts Engine (REPOSITIONED) */}
        <InventoryAlertsEngine isLoading={isInitializing} />

        {/* Layer 2.5: Financial Intelligence & Unit Economics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfitMarginAnalysis isLoading={isInitializing} />
          </div>
          <div className="lg:col-span-1">
            <RevenueDistribution isLoading={isInitializing} />
          </div>
        </div>

        {/* Layer 3: Action Intelligence & Inventory Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <InventoryHealth
              risks={risks}
              healthScore={healthScore}
              isLoading={isInitializing}
            />
          </div>
          <div className="xl:col-span-2">
            <AiActionCenter
              recommendations={aiRecommendations}
              isLoading={isAiLoading || isInitializing}
              onRefresh={fetchAiData}
              lastRefreshed={aiLastRefreshed}
            />
          </div>
        </div>

        {/* Layer 4: Realtime Event Stream (Full Width) */}
        <div className="w-full">
          <LiveActivityFeed events={events} isLoading={isInitializing} />
        </div>

        {/* Layer 5: Conversion & Customer Type Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomerType isLoading={isInitializing} />
          <CustomerFunnel isLoading={isInitializing} />
        </div>

        {/* Layer 6: Geographic & Product Performance Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopRegions isLoading={isInitializing} />
          <TopProducts isLoading={isInitializing} />
        </div>

        {/* Layer 7: Administrative Workspace */}
        <div className="w-full">
          <AdminProductivityPanel isLoading={isInitializing} />
        </div>
      </div>
    </div>
  );
}
