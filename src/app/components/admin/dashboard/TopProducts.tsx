"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Trophy, ArrowUpRight } from "lucide-react";
import { useFormatCurrency } from "../../../../hooks/useFormatCurrency";
import { useLanguageStore, translations } from "../../../../store/languageStore";

const TOP_PRODUCTS = [
  { name: "Oversize Hoodie Black", sales: 842, growth: 12.5, revenue: 210500000, color: "#3b82f6" },
  { name: "Denim Jacket Vintage", sales: 654, growth: 8.2, revenue: 196200000, color: "#6366f1" },
  { name: "Chino Pants Slim", sales: 521, growth: -2.4, revenue: 130250000, color: "#8b5cf6" },
  { name: "Basic T-Shirt White", sales: 489, growth: 15.1, revenue: 73350000, color: "#a855f7" },
  { name: "Floral Summer Dress", sales: 412, growth: 22.8, revenue: 123600000, color: "#d946ef" },
];

export default function TopProducts({ isLoading }: { isLoading?: boolean }) {
  const { language } = useLanguageStore();
  const { format } = useFormatCurrency();
  const t = translations[language];

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="h-[380px] bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
          <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          {t.topProducts}
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">{t.basedOnSalesVolume}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ left: -20, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                fontSize={10} 
                width={100} 
                tick={{ fill: "#94a3b8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderColor: "var(--border)", 
                  borderRadius: "12px", 
                  fontSize: "11px",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }}
                itemStyle={{ fontWeight: 700 }}
                labelStyle={{ fontWeight: 800, marginBottom: "4px" }}
                formatter={(value: number) => [`${value} ${language === "ID" ? "unit" : "units"}`, language === "ID" ? "Penjualan" : "Sales"]}
              />
              <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20}>
                {TOP_PRODUCTS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3 mt-4">
          {TOP_PRODUCTS.slice(0, 3).map((product, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  i === 0 ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" : 
                  i === 1 ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300" : 
                  "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                }`}>
                  #{i + 1}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{product.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{format(product.revenue)}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${product.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {product.growth >= 0 ? "+" : ""}{product.growth}%
                <ArrowUpRight className={`w-3 h-3 ${product.growth < 0 ? "rotate-90" : ""}`} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
