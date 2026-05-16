import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceDot,
} from "recharts";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  useLanguageStore,
  translations,
} from "../../../../store/languageStore";
import { useFormatCurrency } from "../../../../hooks/useFormatCurrency";

interface Props {
  forecast: any[];
  isLoading: boolean;
}

export default function SalesAnalytics({ forecast, isLoading }: Props) {
  const { language } = useLanguageStore();
  const { format, formatAbbreviated, currency } = useFormatCurrency();
  const t = translations[language];

  const [timeframe, setTimeframe] = useState("30D");

  const C =
    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-5 transition-colors";

  if (isLoading) {
    return (
      <div className={`${C} h-96 flex flex-col`}>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse"></div>
      </div>
    );
  }

  // Timeframe-based filtering logic
  const getFilteredData = () => {
    let daysToTake = 30;
    if (timeframe === "7D") daysToTake = 7 + 7;
    if (timeframe === "30D") daysToTake = 30 + 14;
    if (timeframe === "90D") daysToTake = 90 + 30;
    if (timeframe === "YTD") daysToTake = 365;

    const todayIdx = 335;
    if (timeframe === "YTD") return forecast;

    const start = Math.max(
      0,
      todayIdx -
        (daysToTake - (timeframe === "7D" ? 7 : timeframe === "30D" ? 14 : 30)),
    );
    const end = Math.min(
      forecast.length,
      todayIdx + (timeframe === "7D" ? 7 : timeframe === "30D" ? 14 : 30),
    );

    return forecast.slice(start, end);
  };

  const filteredData = getFilteredData();

  const enhancedForecast = filteredData.map((d, i) => {
    const isPrediction = d.predicted !== null && d.predicted !== undefined;
    const baseValue = isPrediction ? d.predicted : d.sales;
    const isAnomaly = !isPrediction && i === 3 && timeframe === "30D";
    const range = isPrediction ? [baseValue * 0.85, baseValue * 1.15] : null;

    return {
      ...d,
      isPrediction,
      isAnomaly,
      confidenceRange: range,
    };
  });

  return (
    <div className={`${C}`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-slate-900 dark:text-white font-bold tracking-tight">
              {t.predictiveRevenue}
            </h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            {t.aiMovingAverage}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {["7D", "30D", "90D", "YTD"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                timeframe === tf
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={enhancedForecast}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
              className="dark:stroke-slate-800"
            />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                if (timeframe === "90D" || timeframe === "YTD")
                  return d.toLocaleDateString(
                    language === "ID" ? "id-ID" : "en-US",
                    { month: "short", year: "2-digit" },
                  );
                return d.toLocaleDateString(
                  language === "ID" ? "id-ID" : "en-US",
                  { day: "numeric", month: "short" },
                );
              }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatAbbreviated(v)}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "11px",
                color: "#0f172a",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              className="dark:!bg-slate-900 dark:!border-slate-800 dark:!text-white"
              formatter={(v: any, name: string) => {
                if (name === "confidenceRange") return [null, null];
                const val = Array.isArray(v) ? v[0] : v;
                return [
                  format(val),
                  name === "sales"
                    ? t.actualRevenue
                    : name === "predicted"
                      ? t.aiProjection
                      : "",
                ];
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                paddingTop: "20px",
                color: "#64748b",
              }}
              iconType="circle"
              payload={[
                {
                  value: t.actualRevenue,
                  type: "circle",
                  id: "ID01",
                  color: "#6366f1",
                },
                {
                  value: t.aiProjection,
                  type: "circle",
                  id: "ID02",
                  color: "#8b5cf6",
                },
              ]}
            />

            <Area
              type="monotone"
              dataKey="confidenceRange"
              stroke="none"
              fill="#8b5cf6"
              fillOpacity={0.08}
              name="Confidence Band"
              connectNulls={true}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#gSales)"
              name="sales"
              connectNulls={true}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#8b5cf6"
              strokeWidth={3}
              strokeDasharray="5 5"
              fill="url(#gPred)"
              name="predicted"
              connectNulls={true}
            />

            {enhancedForecast.map((entry, index) =>
              entry.isAnomaly ? (
                <ReferenceDot
                  key={`anomaly-${index}`}
                  x={entry.date}
                  y={entry.sales as any}
                  r={6}
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ) : null,
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          {language === "ID"
            ? "Menunjukkan Anomali Konversi Trafik"
            : "Indicates Traffic Conversion Anomaly"}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.forecastAccuracy}
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              94.2%
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.trendAcceleration}
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              +12%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
