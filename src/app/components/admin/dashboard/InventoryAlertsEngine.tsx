"use client";
import { useState } from "react";
import { AlertCircle, ArrowRight, Package, TrendingUp, ShieldAlert, Boxes, ChevronRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { useLanguageStore, translations } from "../../../../store/languageStore";

interface AlertItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  velocity: string;
  status: "CRITICAL" | "ELEVATED" | "NOMINAL";
}

const MOCK_ALERTS: AlertItem[] = [
  {
    id: "1",
    name: "Kemeja Oxford Slim Fit",
    category: "Pakaian Pria",
    stock: 6,
    threshold: 10,
    velocity: "+12 units/day",
    status: "CRITICAL",
  },
  {
    id: "2",
    name: "Celana Jeans Selvedge",
    category: "Pakaian Pria",
    stock: 12,
    threshold: 18,
    velocity: "+8 units/day",
    status: "ELEVATED",
  },
  {
    id: "3",
    name: "Oversized Hoodie Grey",
    category: "Pakaian Pria",
    stock: 4,
    threshold: 15,
    velocity: "+15 units/day",
    status: "CRITICAL",
  },
];

interface Props {
  isLoading: boolean;
}

export default function InventoryAlertsEngine({ isLoading }: Props) {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockedIds, setRestockedIds] = useState<string[]>([]);

  const activeAlerts = MOCK_ALERTS.filter(alert => !restockedIds.includes(alert.id));

  const handleRestock = (id: string) => {
    setRestockingId(id);
    // Simulate API call to restock
    setTimeout(() => {
      setRestockingId(null);
      setRestockedIds(prev => [...prev, id]);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 animate-pulse transition-colors">
        <div className="h-6 w-1/4 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
          <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group transition-colors">
      {/* Header Area - Compact */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-100 dark:bg-rose-500/10 rounded-lg flex items-center justify-center">
            <Boxes className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {t.inventoryAlerts}
              <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full animate-pulse">
                {activeAlerts.length}
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {t.aiReplenishmentMonitoring}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.criticalResponse}</span>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            {t.viewAnalytics} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Horizontal Alerts Container */}
      <div className="p-2 overflow-x-auto custom-scrollbar">
        <div className="flex flex-col gap-2 min-w-[1000px] lg:min-w-0">
          {activeAlerts.length > 0 ? activeAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 hover:border-rose-200 dark:hover:border-rose-500/50 hover:bg-rose-50/10 dark:hover:bg-rose-500/5 transition-all group/item shadow-sm hover:shadow-md"
            >
              {/* LEFT: Severity & Product */}
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  alert.status === "CRITICAL" ? "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-amber-500"
                }`} />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {alert.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {language === "ID" ? "Kategori" : "Category"}: {alert.category}
                  </span>
                </div>
              </div>

              {/* CENTER: Stock & Threshold */}
              <div className="flex items-center gap-12 flex-1 justify-center border-x border-slate-100 dark:border-slate-800 mx-4 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t.currentStock}</span>
                  <div className="flex items-center gap-2">
                    <Package className={`w-3.5 h-3.5 ${alert.stock <= 5 ? "text-rose-500" : "text-slate-400 dark:text-slate-500"}`} />
                    <span className={`text-sm font-black ${alert.stock <= 5 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                      {alert.stock}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t.aiThreshold}</span>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {alert.threshold}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Status & Action */}
              <div className="flex items-center gap-4 flex-1 justify-end">
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                  alert.status === "CRITICAL" 
                    ? "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20" 
                    : "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                }`}>
                  {alert.status === "CRITICAL" ? t.depleting : (language === "ID" ? "Elevated Risk" : "Elevated Risk")}
                </span>
                <button 
                  onClick={() => handleRestock(alert.id)}
                  disabled={restockingId === alert.id}
                  className={`px-4 py-2 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                    restockingId === alert.id 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500" 
                      : "bg-slate-900 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 shadow-slate-900/10 dark:shadow-indigo-600/20"
                  }`}
                >
                  {restockingId === alert.id ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" /> {language === "ID" ? "Memesan..." : "Restocking..."}
                    </>
                  ) : (
                    t.reorder
                  )}
                </button>
              </div>
            </div>
          )) : (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-xs font-black uppercase tracking-widest">{language === "ID" ? "Semua Stok Aman Terkendali" : "All Inventory Safe"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-rose-500 dark:text-rose-400" />
          AI Prediction Confidence: 94.8% for next replenishment cycle
        </p>
        <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          {t.lastSync}: {language === "ID" ? "Baru Saja" : "Just Now"}
        </p>
      </div>
    </div>
  );
}
