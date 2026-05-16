"use client";

import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ChevronDown, Calendar } from "lucide-react";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a", "4a"];

function getHeatColor(val: number): string {
  if (val >= 75) return "bg-indigo-700 dark:bg-indigo-600";
  if (val >= 55) return "bg-indigo-500 dark:bg-indigo-500";
  if (val >= 35) return "bg-indigo-300 dark:bg-indigo-400";
  if (val >= 15) return "bg-indigo-100 dark:bg-indigo-900/50";
  return "bg-slate-100 dark:bg-slate-800";
}

// Generate deterministic mock data based on month index to simulate data changes
function generateMonthData(monthIndex: number) {
  const baseMultiplier = 1 + (monthIndex * 0.1); // Data increases slightly each month
  
  const analyticsData = [
    { day: "Mon", orders: Math.floor(67 * baseMultiplier), revenue: Math.floor(18500000 * baseMultiplier) },
    { day: "Tue", orders: Math.floor(88 * baseMultiplier), revenue: Math.floor(24200000 * baseMultiplier) },
    { day: "Wed", orders: Math.floor(74 * baseMultiplier), revenue: Math.floor(20100000 * baseMultiplier) },
    { day: "Thu", orders: Math.floor(112 * baseMultiplier), revenue: Math.floor(32800000 * baseMultiplier) },
    { day: "Fri", orders: Math.floor(94 * baseMultiplier), revenue: Math.floor(27600000 * baseMultiplier) },
    { day: "Sat", orders: Math.floor(58 * baseMultiplier), revenue: Math.floor(16400000 * baseMultiplier) },
    { day: "Sun", orders: Math.floor(43 * baseMultiplier), revenue: Math.floor(12100000 * baseMultiplier) },
  ];

  const heatmapData = [
    [2, 4, 8, 12, 18, 24, 32, 44, 56, 68, 72, 74].map(v => Math.min(100, Math.floor(v * baseMultiplier))),
    [4, 6, 10, 14, 20, 28, 36, 48, 60, 70, 76, 80].map(v => Math.min(100, Math.floor(v * baseMultiplier))),
    [3, 5, 9, 13, 17, 22, 31, 40, 52, 66, 71, 73].map(v => Math.min(100, Math.floor(v * baseMultiplier))),
    [6, 8, 12, 18, 24, 32, 42, 55, 64, 72, 78, 82].map(v => Math.min(100, Math.floor(v * baseMultiplier))),
    [5, 7, 11, 16, 22, 30, 38, 50, 60, 68, 74, 78].map(v => Math.min(100, Math.floor(v * baseMultiplier))),
    [8, 11, 15, 20, 28, 36, 46, 58, 68, 76, 80, 84].map(v => Math.min(100, Math.floor(v * baseMultiplier))),
    [1, 3, 6, 9, 13, 18, 24, 32, 44, 56, 64, 70].map(v => Math.min(100, Math.floor(v * baseMultiplier))),
  ];

  return { analyticsData, heatmapData };
}

export default function OrdersAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { format } = useFormatCurrency();

  const monthIndex = MONTHS.indexOf(selectedMonth);
  const { analyticsData, heatmapData } = generateMonthData(monthIndex);

  const totalRevenue = analyticsData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = analyticsData.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="space-y-5">
      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              {selectedMonth} 2026
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>
            
            {isSelectorOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSelectorOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-200/40 z-20 overflow-hidden py-1">
                  <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {MONTHS.map((month) => (
                      <button
                        key={month}
                        onClick={() => {
                          setSelectedMonth(month);
                          setIsSelectorOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                          selectedMonth === month 
                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue + Orders Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm transition-colors">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{selectedMonth} Performance</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{format(totalRevenue)}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{totalOrders} total orders in {selectedMonth}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-300 dark:bg-violet-500" />
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Revenue</span>
              </div>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 500, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--tooltip-bg, white)",
                    border: "1px solid var(--tooltip-border, #f1f5f9)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    padding: "10px 14px",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "var(--tooltip-text, #0f172a)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#ordersGrad)"
                  dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#6366f1" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Day breakdown */}
          <div className="grid grid-cols-7 gap-1 mt-4">
            {analyticsData.map((d, i) => (
              <div key={i} className="text-center">
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full"
                    style={{ width: `${Math.round((d.orders / 200) * 100)}%` }}
                  />
                </div>
                <p className="text-[9px] font-medium text-slate-400">{d.orders}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Heatmap */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 shadow-sm transition-colors">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Order Volume Heatmap</p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-4">Peak hours by day ({selectedMonth})</p>

          <div className="space-y-1">
            {heatmapData.map((row, ri) => (
              <div key={ri} className="flex items-center gap-1">
                <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 w-6 shrink-0 text-right">{DAYS[ri]}</span>
                <div className="flex gap-0.5 flex-1">
                  {row.map((val, ci) => (
                    <div
                      key={ci}
                      className={`flex-1 h-4 rounded-sm ${getHeatColor(val)} transition-all hover:scale-110 cursor-pointer opacity-90`}
                      title={`${DAYS[ri]} ${HOURS[ci]}: ${val} orders`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] font-medium text-slate-500 w-6 shrink-0" />
              <div className="flex flex-1 justify-between">
                {HOURS.filter((_, i) => i % 3 === 0).map((h, i) => (
                  <span key={i} className="text-[8px] font-medium text-slate-400">{h}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Low</span>
            <div className="flex gap-0.5 flex-1 opacity-90">
              {["bg-slate-100 dark:bg-slate-800", "bg-indigo-100 dark:bg-indigo-900/40", "bg-indigo-300 dark:bg-indigo-500/60", "bg-indigo-500 dark:bg-indigo-500", "bg-indigo-700 dark:bg-indigo-600"].map((cls, i) => (
                <div key={i} className={`flex-1 h-2 rounded-sm ${cls}`} />
              ))}
            </div>
            <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">High</span>
          </div>

          {/* Warehouse Activity */}
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Warehouse Activity</p>
            <div className="space-y-2.5">
              {[
                { label: "Pick & Pack", value: 78, color: "bg-indigo-400" },
                { label: "QC Check", value: 65, color: "bg-violet-400" },
                { label: "Dispatch", value: 82, color: "bg-emerald-400" },
                { label: "Returns", value: 18, color: "bg-rose-400" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
