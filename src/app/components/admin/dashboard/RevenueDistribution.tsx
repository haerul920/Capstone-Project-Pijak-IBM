"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { PieChart as PieIcon } from "lucide-react";
import { useLanguageStore, translations } from "../../../../store/languageStore";
import { useFormatCurrency } from "../../../../hooks/useFormatCurrency";

const REVENUE_BY_CATEGORY = [
  { name: "Pakaian Pria", value: 45, color: "#06b6d4", amount: 622497825 },
  { name: "Pakaian Wanita", value: 30, color: "#f472b6", amount: 414998550 },
  { name: "Aksesoris", value: 15, color: "#a78bfa", amount: 207499275 },
  { name: "Unisex", value: 10, color: "#34d399", amount: 138332850 },
];

export default function RevenueDistribution({ isLoading }: { isLoading?: boolean }) {
  const { language } = useLanguageStore();
  const { format } = useFormatCurrency();
  const t = translations[language];

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 animate-pulse">
        <div className="h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
          <PieIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          {t.revenueDistribution}
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">{t.categoryBreakdown}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center h-[180px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={REVENUE_BY_CATEGORY} 
                cx="50%" 
                cy="50%" 
                innerRadius={50} 
                outerRadius={80} 
                paddingAngle={3} 
                dataKey="value"
              >
                {REVENUE_BY_CATEGORY.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => `${value}%`} 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderColor: "var(--border)", 
                  borderRadius: "12px", 
                  fontSize: "12px",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3 mt-4">
          {REVENUE_BY_CATEGORY.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-400">
                  {item.name === "Pakaian Pria" ? (language === "ID" ? "Pakaian Pria" : "Men's Apparel") : 
                   item.name === "Pakaian Wanita" ? (language === "ID" ? "Pakaian Wanita" : "Women's Apparel") : 
                   item.name === "Aksesoris" ? (language === "ID" ? "Aksesoris" : "Accessories") : item.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.value}%`, background: item.color }} 
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white w-8 text-right">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">{t.totalPeriodRevenue}</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{format(1383328500)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
