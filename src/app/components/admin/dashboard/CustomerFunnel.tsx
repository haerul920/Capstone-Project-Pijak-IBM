"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Filter } from "lucide-react";
import { useLanguageStore, translations } from "../../../../store/languageStore";

const FUNNEL_DATA = [
  { name: "Total Visitors", value: 15400, color: "bg-slate-200 dark:bg-slate-800", textColor: "text-slate-600 dark:text-slate-400" },
  { name: "Product Views", value: 8200, color: "bg-slate-300 dark:bg-slate-700", textColor: "text-slate-700 dark:text-slate-300" },
  { name: "Add to Cart", value: 3100, color: "bg-slate-400 dark:bg-slate-600", textColor: "text-slate-800 dark:text-slate-200" },
  { name: "Checkout", value: 1850, color: "bg-slate-500 dark:bg-slate-500", textColor: "text-slate-900 dark:text-white" },
  { name: "Successful Payment", value: 1429, color: "bg-slate-800 dark:bg-indigo-600", textColor: "text-white dark:text-white" },
];

export default function CustomerFunnel({ isLoading }: { isLoading?: boolean }) {
  const { language } = useLanguageStore();
  const t = translations[language];

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="h-[320px] bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
          <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          {t.conversionFunnel}
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">{t.customerJourneyAnalysis}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-1 relative">
          {FUNNEL_DATA.map((item, i) => {
            const nextItem = FUNNEL_DATA[i + 1];
            const dropoff = nextItem ? Math.round((1 - nextItem.value / item.value) * 100) : 0;
            const width = 100 - (i * 10);

            return (
              <div key={i} className="relative group">
                <div 
                  className={`h-12 rounded-lg flex items-center justify-between px-4 transition-all hover:scale-[1.02] ${item.color} ${item.textColor} shadow-sm`}
                  style={{ width: `${width}%`, margin: "0 auto" }}
                >
                  <span className="text-xs font-bold truncate max-w-[120px]">
                    {item.name === "Total Visitors" ? (language === "ID" ? "Total Pengunjung" : "Total Visitors") : 
                     item.name === "Product Views" ? (language === "ID" ? "Tampilan Produk" : "Product Views") : 
                     item.name === "Add to Cart" ? (language === "ID" ? "Tambah ke Keranjang" : "Add to Cart") : 
                     item.name === "Checkout" ? (language === "ID" ? "Checkout" : "Checkout") : 
                     item.name === "Successful Payment" ? (language === "ID" ? "Pembayaran Berhasil" : "Successful Payment") : item.name}
                  </span>
                  <span className="text-sm font-extrabold">{item.value.toLocaleString()}</span>
                </div>
                
                {nextItem && (
                  <div className="flex justify-center my-1">
                    <div className="flex items-center gap-1.5 py-0.5 px-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-full">
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400">-{dropoff}% {language === "ID" ? "Penurunan" : "Drop-off"}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 transition-colors">
            <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">{t.overallCr}</p>
            <p className="text-xl font-black text-indigo-900 dark:text-white">9.28%</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-500 mt-0.5">+1.4% {language === "ID" ? "dari rata-rata" : "from avg"}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cartAbandonment}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200">40.3%</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">{language === "ID" ? "Perhatian kritis diperlukan." : "Critical attention req."}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
