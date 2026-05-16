"use client";
import { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BarChart3,
  Brain,
  RefreshCw,
  Star,
  Users,
  Zap,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useLanguageStore,
  translations,
} from "../../../../store/languageStore";

interface Props {
  isLoading: boolean;
}

export default function SmartRestockPrediction({ isLoading }: Props) {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisVersion, setAnalysisVersion] = useState(0);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(92.4);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic data generation based on analysisVersion
  const mockData = useMemo(() => {
    if (!mounted) return [];
    const data = [];
    const today = new Date();
    const seed = analysisVersion * 10;

    for (let i = 20; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const demand =
        80 +
        Math.floor(Math.sin((i + seed) * 0.5) * 20) +
        Math.floor(Math.random() * 50);
      data.push({
        date: d.toISOString().split("T")[0],
        demand: demand,
        predicted: demand * (0.98 + Math.random() * 0.04),
      });
    }

    for (let i = 1; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      // Prediction changes based on analysisVersion to simulate "New Analysis"
      const trend = analysisVersion % 2 === 0 ? 1.2 : 0.8;
      const predicted = 120 + i * 10 * trend + Math.floor(Math.random() * 30);
      data.push({
        date: d.toISOString().split("T")[0],
        demand: null,
        predicted: predicted,
      });
    }
    return data;
  }, [analysisVersion, mounted]);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setRecommendation(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisVersion((prev) => prev + 1);

      // Randomize confidence and recommendation
      const newConfidence = 90 + Math.random() * 8;
      setConfidence(Number(newConfidence.toFixed(1)));

      const recommendations =
        language === "ID"
          ? [
              "AI mendeteksi lonjakan permintaan 15% pada kategori 'Pakaian Pria' minggu depan. Segera restock 200 unit Kemeja Oxford.",
              "Trend penjualan stabil. Pertahankan stok saat ini dan fokus pada optimasi harga Flash Sale.",
              "Peringatan: Stok 'Hoodie Grey' akan habis dalam 3 hari berdasarkan kecepatan penjualan saat ini. Restock disarankan segera.",
              "Analisis selesai: Pola pembelian akhir pekan menunjukkan peningkatan minat pada produk premium. Siapkan inventaris tambahan.",
            ]
          : [
              "AI detected a 15% demand spike in 'Men's Apparel' next week. Restock 200 units of Oxford Shirts immediately.",
              "Stable sales trend. Maintain current stock levels and focus on Flash Sale price optimization.",
              "Warning: 'Grey Hoodie' stock will deplete in 3 days based on current velocity. Immediate restock recommended.",
              "Analysis complete: Weekend purchase patterns indicate increased interest in premium products. Prepare extra inventory.",
            ];
      setRecommendation(
        recommendations[Math.floor(Math.random() * recommendations.length)],
      );
    }, 2500);
  };

  if (isLoading || !mounted) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="h-6 w-1/3 bg-slate-100 dark:bg-slate-800 rounded mb-8"></div>
        <div className="h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded mb-6"></div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded"></div>
          <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded"></div>
          <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded"></div>
          <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-100/30 dark:group-hover:bg-indigo-500/10 transition-colors duration-500"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {t.replenishmentForecast}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t.demandForecasting}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {t.aiConfidence}
              </p>
              <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                {confidence}%
              </p>
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                isAnalyzing
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-600/20 active:scale-95"
              }`}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Brain className="w-3.5 h-3.5" />
              )}
              {isAnalyzing
                ? language === "ID"
                  ? "Menganalisis Pola..."
                  : "Analyzing Patterns..."
                : t.runAiAnalysis}
            </button>
          </div>
        </div>

        {/* AI Recommendation Message */}
        {recommendation && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">
                {language === "ID"
                  ? "Hasil Analisis Real-time:"
                  : "Real-time Analysis Result:"}
              </p>
              <p className="text-sm text-indigo-700 dark:text-indigo-200 font-bold leading-relaxed">
                {recommendation}
              </p>
            </div>
          </div>
        )}

        <div className="h-[350px] w-full mb-6 relative">
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest animate-pulse">
                  {language === "ID"
                    ? "Memproses Model Machine Learning..."
                    : "Processing Machine Learning Models..."}
                </p>
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
                className="dark:stroke-slate-800"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString(
                    language === "ID" ? "id-ID" : "en-US",
                    { day: "numeric", month: "short" },
                  );
                }}
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                tickFormatter={(val) => `${val} Pcs`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                  backgroundColor: "white",
                }}
                className="dark:!bg-slate-900 dark:!border-slate-800"
                itemStyle={{
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
                labelStyle={{
                  fontSize: "10px",
                  color: "#64748b",
                  marginBottom: "4px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
                formatter={(value: number) => [`${value} Unit/Pcs`]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                content={({ payload }) => (
                  <div className="flex gap-4 justify-end mb-6">
                    {payload?.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${entry.value.includes("Actual") || entry.value.includes("Aktual") ? "bg-indigo-500" : "bg-pink-500"}`}
                        />
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          {entry.value === "Actual Demand"
                            ? t.actualDemand
                            : entry.value === "AI Forecasted Demand"
                              ? t.aiForecastedDemand
                              : entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Area
                type="monotone"
                dataKey="demand"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorDemand)"
                name={t.actualDemand}
                connectNulls={true}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#ec4899"
                strokeWidth={3}
                strokeDasharray="6 6"
                fillOpacity={1}
                fill="url(#colorPredicted)"
                name={t.aiForecastedDemand}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Machine Learning Factors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500/50 group">
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {t.productRating}
              </span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.impact}: High (4.8+)
            </p>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500/50 group">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {t.generation}
              </span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Gen Z & Millennial
            </p>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500/50 group">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {t.flashSale}
              </span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.activeStrategy}
            </p>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500/50 group">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {t.holidayEvent}
              </span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.weekendForecast}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
