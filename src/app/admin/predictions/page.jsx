"use client";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Predictions() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [days, setDays] = useState(7);
  const [dataChart, setDataChart] = useState([]);

  // ================= FORMAT =================
  const formatToJt = (value) => {
    if (!value) return "0";
    return (value / 1_000_000).toFixed(1) + " jt";
  };

  const formatCurrency = (value) => {
    return "Rp " + Math.round(value).toLocaleString();
  };

  // ================= LOAD =================
  useEffect(() => {
    const load = () => {
      const s = JSON.parse(localStorage.getItem("salesData")) || [];
      const p = JSON.parse(localStorage.getItem("productsMaster")) || [];

      setSales(s);
      setProducts(p);
    };

    load();
    window.addEventListener("salesUpdated", load);
    window.addEventListener("productsUpdated", load);

    return () => {
      window.removeEventListener("salesUpdated", load);
      window.removeEventListener("productsUpdated", load);
    };
  }, []);

  // ================= PROCESS =================
  useEffect(() => {
    if (!sales.length) return;

    let filtered =
      selectedProduct === "All"
        ? sales
        : sales.filter((s) => s.name === selectedProduct);

    const grouped = {};
    filtered.forEach((s) => {
      const d = s.date?.split("T")[0];
      if (!d) return;

      if (!grouped[d]) grouped[d] = 0;
      grouped[d] += Number(s.qty) * Number(s.price);
    });

    const base = Object.keys(grouped)
      .map((d) => ({ date: d, value: grouped[d] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (!base.length) return;

    const avg =
      base.slice(-3).reduce((sum, d) => sum + d.value, 0) /
      Math.min(3, base.length);

    let last = new Date(base[base.length - 1].date);

    const result = [];

    // ACTUAL
    // ACTUAL + PREDICTION REAL
    base.forEach((d, i) => {
      const prev = base[i - 1]?.value || d.value;

      result.push({
        name: `Day ${i + 1}`,
        actual: d.value,
        predicted: prev, // 🔥 pakai hari sebelumnya
        upper: prev * 1.1,
        lower: prev * 0.9,
      });
    });

    // FORECAST
    for (let i = 1; i <= days; i++) {
      last.setDate(last.getDate() + 1);

      const pred = avg * (1 + i * 0.05);

      result.push({
        name: `Day ${base.length + i}`,
        actual: null,
        predicted: pred,
        upper: pred * 1.1,
        lower: pred * 0.9,
      });
    }

    setDataChart(result);
  }, [sales, selectedProduct, days]);

  // ================= SUMMARY =================
  const sumForecast = (n) =>
    dataChart.slice(-n).reduce((sum, d) => sum + (d.predicted || 0), 0);

  const next7 = sumForecast(7);
  const next30 = sumForecast(30);

  // ================= METRICS =================
  const actualData = dataChart.filter((d) => d.actual !== null);

  const errors = actualData.map((d) => Math.abs(d.actual - d.predicted));

  const mae = errors.reduce((sum, e) => sum + e, 0) / (errors.length || 1);

  const mape =
    actualData.reduce((sum, d) => {
      if (d.actual === 0) return sum;
      return sum + Math.abs((d.actual - d.predicted) / d.actual);
    }, 0) / (actualData.length || 1);

  const rmse = Math.sqrt(
    actualData.reduce((sum, d) => {
      return sum + Math.pow(d.actual - d.predicted, 2);
    }, 0) / (actualData.length || 1),
  );

  const accuracy = 100 - mape * 100;

  // ================= INSIGHTS =================
  // ================= ADVANCED INSIGHTS =================

  // 🔹 GROWTH
  const lastActual = actualData[actualData.length - 1]?.actual || 0;
  const nextPred = dataChart.find((d) => d.actual === null)?.predicted || 0;

  const growth = ((nextPred - lastActual) / (lastActual || 1)) * 100;

  // 🔹 STOCK ALERT (produk laris)
  const productSales = {};
  sales.forEach((s) => {
    if (!productSales[s.name]) productSales[s.name] = 0;
    productSales[s.name] += Number(s.qty);
  });

  const topProduct = Object.entries(productSales).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  // 🔹 SEASONAL (simple trend)
  const trendUp = growth > 0;

  let insightText = "";
  let insightType = "neutral";

  if (growth > 5) {
    insightText = "Strong growth expected in next period";
    insightType = "up";
  } else if (growth < -5) {
    insightText = "Sales may decline, consider strategy";
    insightType = "down";
  } else {
    insightText = "Stable trend detected";
  }

  // ================= UI =================
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 py-6 mt-20 space-y-6">
        {/* SUMMARY */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl">
            <p className="text-gray-400 text-sm">Next 7 Days</p>
            <h2 className="text-2xl font-bold">{formatCurrency(next7)}</h2>
            <p className="text-green-400 text-sm">+12% vs previous period</p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl">
            <p className="text-gray-400 text-sm">Next 30 Days</p>
            <h2 className="text-2xl font-bold">{formatCurrency(next30)}</h2>
            <p className="text-green-400 text-sm">+18% vs previous period</p>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Forecast Visualization</h2>

            <div className="flex gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="bg-[#111] px-3 py-2 rounded-lg"
              >
                <option value="All">All Products</option>
                {products.map((p, i) => (
                  <option key={i}>{p.name}</option>
                ))}
              </select>

              <button
                onClick={() => setDays(7)}
                className={`px-4 py-2 rounded-xl ${
                  days === 7 ? "bg-red-500" : "bg-[#111]"
                }`}
              >
                7 Days
              </button>

              <button
                onClick={() => setDays(30)}
                className={`px-4 py-2 rounded-xl ${
                  days === 30 ? "bg-red-500" : "bg-[#111]"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* 🔥 FIX OVERFLOW */}
          <div className="h-[400px] overflow-hidden">
            <ResponsiveContainer>
              <LineChart
                data={dataChart}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />

                {/* 🔥 FIX TITIK KANAN */}
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  padding={{ right: 30 }}
                  tickFormatter={(value) => `Day ${value.split(" ")[1]}`}
                />

                {/* 🔥 FIX ANGKA */}
                <YAxis stroke="#888" tickFormatter={formatToJt} width={80} />

                {/* 🔥 FIX TOOLTIP */}
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                  }}
                  wrapperStyle={{ zIndex: 1000 }}
                  cursor={{ stroke: "#555", strokeWidth: 1 }}
                />

                <Legend />

                <Line
                  dataKey="actual"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  dataKey="predicted"
                  stroke="#8884d8"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />

                <Line dataKey="upper" stroke="#22c55e" strokeDasharray="3 3" />

                <Line dataKey="lower" stroke="#3b82f6" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔥 MODEL INFO + INSIGHT */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* MODEL INFO */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl space-y-4">
            <h2 className="font-semibold">Model Information</h2>

            <div className="bg-black p-4 rounded-xl flex justify-between">
              <span>Model Accuracy</span>
              <span className="text-green-400">{accuracy.toFixed(1)}%</span>
            </div>

            <div className="bg-black p-4 rounded-xl flex justify-between">
              <span>MAE</span>
              <span>{formatCurrency(mae)}</span>
            </div>

            <div className="bg-black p-4 rounded-xl flex justify-between">
              <span>MAPE</span>
              <span>{(mape * 100).toFixed(1)}%</span>
            </div>

            <div className="bg-black p-4 rounded-xl flex justify-between">
              <span>RMSE</span>
              <span>{formatCurrency(rmse)}</span>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl space-y-4">
            <h2 className="font-semibold">Forecast Insights</h2>

            {/* 🔥 GROWTH */}
            <div className="p-4 rounded-xl bg-green-900/20 border-l-4 border-green-500">
              <p className="font-semibold">
                {growth > 0 ? "Strong Growth Expected" : "Sales May Decline"}
              </p>
              <p className="text-sm text-gray-400">
                Sales projected to {growth > 0 ? "increase" : "decrease"} by{" "}
                {Math.abs(growth).toFixed(1)}% next period
              </p>
            </div>

            {/* 🔥 STOCK ALERT */}
            <div className="p-4 rounded-xl bg-red-900/20 border-l-4 border-red-500">
              <p className="font-semibold">Stock Alert</p>
              <p className="text-sm text-gray-400">
                {topProduct
                  ? `Consider restocking ${topProduct}, high demand detected`
                  : "No stock alert"}
              </p>
            </div>

            {/* 🔥 SEASONAL TREND */}
            <div className="p-4 rounded-xl bg-blue-900/20 border-l-4 border-blue-500">
              <p className="font-semibold">Trend Analysis</p>
              <p className="text-sm text-gray-400">
                Data shows {trendUp ? "increasing" : "decreasing"} sales pattern
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
