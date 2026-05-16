"use client";

import { ShoppingBag, Truck, Clock, CheckCircle2, XCircle, TrendingUp, TrendingDown } from "lucide-react";

const KPI_DATA = [
  {
    label: "Processing",
    count: 34,
    delta: "+8",
    positive: true,
    icon: ShoppingBag,
    text: "text-blue-600",
    bg: "bg-blue-50/50",
    bar: "bg-blue-500",
    progress: 55,
    colSpan: "lg:col-span-2",
    primary: true,
  },
  {
    label: "Pending",
    count: 12,
    delta: "+3",
    positive: false,
    icon: Clock,
    text: "text-amber-600",
    bg: "bg-amber-50/50",
    bar: "bg-amber-500",
    progress: 20,
    colSpan: "lg:col-span-1",
  },
  {
    label: "Shipped",
    count: 67,
    delta: "+14",
    positive: true,
    icon: Truck,
    text: "text-violet-600",
    bg: "bg-violet-50/50",
    bar: "bg-violet-500",
    progress: 75,
    colSpan: "lg:col-span-1",
  },
  {
    label: "Delivered",
    count: 156,
    delta: "+32",
    positive: true,
    icon: CheckCircle2,
    text: "text-emerald-600",
    bg: "bg-emerald-50/50",
    bar: "bg-emerald-500",
    progress: 92,
    colSpan: "lg:col-span-1",
  },
  {
    label: "Cancelled",
    count: 3,
    delta: "-1",
    positive: true,
    icon: XCircle,
    text: "text-rose-600",
    bg: "bg-rose-50/50",
    bar: "bg-rose-400",
    progress: 5,
    colSpan: "lg:col-span-1",
  },
];

export default function OrdersKpiStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {KPI_DATA.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div
            key={i}
            className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 hover:shadow-sm transition-all duration-300 ${kpi.colSpan} flex flex-col justify-between group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} dark:bg-opacity-10 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${kpi.text}`} />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-medium ${kpi.positive ? "text-emerald-600" : "text-rose-600"}`}>
                {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.delta}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className={`${kpi.primary ? "text-3xl" : "text-2xl"} font-semibold text-slate-900 dark:text-white leading-none tracking-tight`}>
                {kpi.count}
              </p>
            </div>

            {/* Mini progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-slate-400 font-medium">Daily volume</span>
                <span className="text-[10px] text-slate-500 font-medium">{kpi.progress}%</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${kpi.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${kpi.progress}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
