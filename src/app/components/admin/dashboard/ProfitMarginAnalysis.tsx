"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Target } from "lucide-react";
import { useLanguageStore, translations } from "../../../../store/languageStore";
import { useFormatCurrency } from "../../../../hooks/useFormatCurrency";

const PROFIT_DATA = [
  { name: "Hoodie", margin: 68, revenue: 51300000, profit: 34884000 },
  { name: "Kemeja", margin: 54, revenue: 37570000, profit: 20287800 },
  { name: "Dress", margin: 61, revenue: 36150000, profit: 22051500 },
  { name: "Sneakers", margin: 43, revenue: 49500000, profit: 21285000 },
  { name: "Tote Bag", margin: 72, revenue: 14025000, profit: 10098000 },
  { name: "Polo", margin: 38, revenue: 22100000, profit: 8398000 },
];

export default function ProfitMarginAnalysis({ isLoading }: { isLoading?: boolean }) {
  const { language } = useLanguageStore();
  const { format } = useFormatCurrency();
  const t = translations[language];

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 animate-pulse transition-colors">
        <div className="h-[350px] bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
          <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {t.profitMargin}
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">{t.grossMarginProduct}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PROFIT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={10} 
                tick={{ fill: "#94a3b8" }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                formatter={(value: number, name: string) => [
                  name === "margin" ? `${value}%` : format(value), 
                  name === "margin" ? "Margin" : "Profit"
                ]}
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderColor: "var(--border)", 
                  borderRadius: "12px", 
                  fontSize: "12px",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }} 
              />
              <Bar dataKey="margin" radius={[4, 4, 0, 0]} barSize={32}>
                {PROFIT_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.margin >= 60 ? "#10b981" : entry.margin >= 45 ? "#f59e0b" : "#ef4444"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center transition-colors">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{t.avgMargin}</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">58.4%</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-center transition-colors">
            <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">{t.bestItem}</p>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5 truncate">Tote Bag</p>
            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">72% Margin</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20 text-center transition-colors">
            <p className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-tight">{t.riskItem}</p>
            <p className="text-xs font-bold text-red-800 dark:text-red-300 mt-0.5 truncate">Polo Shirt</p>
            <p className="text-[10px] font-medium text-red-600 dark:text-red-400">38% Margin</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
