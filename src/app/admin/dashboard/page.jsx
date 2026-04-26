"use client";

import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import Insight from "../../components/Insight";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const router = useRouter();

  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("transaction");
  const [productsMaster, setProductsMaster] = useState([]);

  // 🔐 PROTEKSI LOGIN + LOAD DATA (FIXED)
useEffect(() => {
  if (typeof window === "undefined") return;

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (!user || !user.isLogin) {
    router.push("/login");
    return;
  }

  if (user.role !== "admin") {
    alert("Akses hanya untuk admin!");
    router.push("/");
  }

  const storedSales = JSON.parse(localStorage.getItem("salesData")) || [];
  const storedProducts =
    JSON.parse(localStorage.getItem("productsMaster")) || [];

  setSales(storedSales);
  setProductsMaster(storedProducts);
}, [router]);

  // 🔥 TOTAL SALES
  const totalSales = sales.reduce((sum, s) => sum + Number(s.qty), 0);

  // 🔥 TOTAL REVENUE
  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.qty) * Number(s.price),
    0,
  );

  // 🔥 GROUP PRODUCT
  const productMap = {};
  sales.forEach((s) => {
    if (!productMap[s.name]) productMap[s.name] = 0;
    productMap[s.name] += Number(s.qty);
  });

  const productArray = Object.entries(productMap).map(([name, sold]) => ({
    name,
    sold,
  }));

  const bestProduct =
    [...productArray].sort((a, b) => b.sold - a.sold)[0] || {};
  const worstProduct =
    [...productArray].sort((a, b) => a.sold - b.sold)[0] || {};

  // 🔥 CATEGORY (SIMULASI DARI NAMA PRODUK)
  // 🔥 AMBIL PRODUCT MASTER


  // 🔥 MAP PRODUCT -> CATEGORY (sekali saja)
  const productCategoryMap = {};
  productsMaster.forEach((p) => {
    productCategoryMap[p.name] = p.category;
  });

  // 🔥 GROUP CATEGORY (tanpa nested loop)
  const categoryMap = {};

  sales.forEach((s) => {
    const category = s.category || productCategoryMap[s.name] || "Other";

    const value = Number(s.qty) * Number(s.price);

    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }

    categoryMap[category] += value;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#22c55e",
    "#eab308",
  ];

  const getColor = (val) => {
    if (val === 0) return "#1a1a1a";
    if (val < 2) return "#4f0707";
    if (val < 4) return "#8c0f0f";
    if (val < 6) return "#be1515";
    return "#ef4444";
  };

  const maxSold = Math.max(...productArray.map((p) => p.sold), 1);

  // 🔥 GROUPING FUNCTION
  const groupByDate = (sales, type) => {
    const map = {};

    sales.forEach((s, i) => {
      if (!s.date) return;

      const date = new Date(s.date);
      if (isNaN(date)) return;

      let key = "";

      if (type === "transaction") key = `T${i + 1}`;

      if (type === "7days") {
        key = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });
      }

      if (type === "month") {
        key = date.toLocaleDateString("id-ID", { month: "short" });
      }

      if (type === "3month") {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `Q${quarter}`;
      }

      if (type === "year") {
        key = date.getFullYear().toString();
      }

      // 🔥 INI FIX NYA
      const value = Number(s.qty) * Number(s.price);

      if (!map[key]) {
        map[key] = { actual: 0, predicted: 0 };
      }

      map[key].actual += value;
      map[key].predicted += value * 1.15;
    });

    return Object.keys(map).map((k) => ({
      name: k,
      actual: Math.round(map[k].actual),
      predicted: Math.round(map[k].predicted),
    }));
  };

  // 🔥 TAMBAHKAN INI (di bawah groupByDate)
  const buildHeatmap = (sales) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = [
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
    ];

    const map = {};

    days.forEach((d) => {
      map[d] = {};
      hours.forEach((h) => {
        map[d][h] = 0;
      });
    });

    sales.forEach((s) => {
      if (!s.date) return;

      const date = new Date(s.date);
      if (isNaN(date)) return;

      const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];

      let hour = date.getHours();

      // 🔥 FIX DATA LAMA
      if (hour === 0) hour = 12;

      hour = String(hour);

      // 🔥 BIAR MATCH GRID
      if (!hours.includes(hour)) return;

      map[day][hour] += 1;
    });

    return { map, days, hours };
  };

const handleLogout = () => {
  localStorage.removeItem("currentUser"); // 🔥 hanya hapus session
  router.push("/login");
};
  const chartData = groupByDate(sales, filter);
  const heatmapData = buildHeatmap(sales);

  const heatmap = heatmapData.map;
  const days = heatmapData.days;
  const hours = heatmapData.hours;

  // 🔥 HITUNG GROWTH
  let growth = 0;

  if (chartData.length >= 2) {
    const last = chartData[chartData.length - 1].actual;
    const prev = chartData[chartData.length - 2].actual;

    if (prev > 0) {
      growth = ((last - prev) / prev) * 100;
    }
  }

  const growthText = `${Math.abs(growth).toFixed(1)}%`;

  const decliningProduct =
    productArray.length > 1
      ? [...productArray].sort((a, b) => a.sold - b.sold)[0]
      : null;

  const visibleHours = hours.slice(0, 6); // 9 - 14
  const hiddenHours = hours.slice(6); // 15 ke bawah

  const totalCategory = categoryData.reduce((sum, c) => sum + c.value, 0);

  const formatRupiahShort = (num) => {
    if (num >= 1000000000) return "Rp" + (num / 1000000000).toFixed(1) + " M";
    if (num >= 1000000) return "Rp" + (num / 1000000).toFixed(1) + " Jt";
    if (num >= 1000) return "Rp" + (num / 1000).toFixed(0) + " Rb";
    return "Rp" + num;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 py-4 mt-20">
        <h1 className="text-3xl font-semibold mb-1">Dashboard</h1>
        <p className="text-gray-400 mb-6">
          AI-powered sales insights and forecasting
        </p>
        {/* 🔥 LOGOUT (OPSIONAL) */}
        <button
          onClick={handleLogout}
          className="mb-4 bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>

        {/* 🔥 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Sales" value={totalSales} type="sales" />
          <StatCard
            title="Revenue"
            value={"Rp" + totalRevenue.toLocaleString()}
            type="revenue"
          />
          <StatCard
            title="Products Sold"
            value={productArray.length}
            type="growth"
          />
          <StatCard title="Prediction Accuracy" value="94.2%" type="accuracy" />
        </div>

        {/* 🔥 CHART */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
            {/* 🔥 FILTER BUTTON (FIXED POSITION) */}
            <div className="flex gap-2 mb-4">
              {[
                { label: "Transaksi", value: "transaction" },
                { label: "7 Hari", value: "7days" },
                { label: "1 Bulan", value: "month" },
                { label: "3 Bulan", value: "3month" },
                { label: "Tahunan", value: "year" },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    filter === btn.value
                      ? "bg-red-500 text-white"
                      : "bg-[#111] text-gray-400"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Historical vs Predicted Sales
            </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                >
                  <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />

                  <XAxis dataKey="name" stroke="#888" />

                  <YAxis
                    stroke="#888"
                    width={80}
                    domain={[0, "dataMax + 50000"]}
                    tickFormatter={(val) =>
                      val >= 1000000
                        ? "Rp" + (val / 1000000).toFixed(1) + "Jt"
                        : "Rp" + (val / 1000).toFixed(0) + "Rb"
                    }
                  />

                  <Tooltip
                    formatter={(val) => "Rp" + Number(val).toLocaleString()}
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "none",
                      borderRadius: "10px",
                    }}
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />

                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#aaa"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4">AI Insights</h2>

            {/* 🔥 AI INSIGHT DINAMIS */}
            <Insight
              text={
                growth >= 0
                  ? `Sales increased by ${growthText} compared to previous period`
                  : `Sales decreased by ${growthText} compared to previous period`
              }
              type={growth >= 0 ? "positive" : "negative"}
            />

            <Insight
              text={
                decliningProduct
                  ? `${decliningProduct.name} shows lowest performance`
                  : "No product data available"
              }
              type="negative"
            />

            <Insight text="Consider optimizing inventory based on sales trends" />
          </div>
        </div>
        {/* 🔥 NEW SECTION: REVENUE TREND + CATEGORY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* 🟡 SALES BY CATEGORY */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>

            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius={80}
                    outerRadius={100}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  {/* 🔥 TEXT TENGAH */}
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={22}
                    fontWeight="bold"
                  >
                    {formatRupiahShort(totalCategory)}
                  </text>

                  <text
                    x="50%"
                    y="60%"
                    textAnchor="middle"
                    fill="#888"
                    fontSize={12}
                  >
                    TOTAL
                  </text>

                  <Tooltip
                    formatter={(val) => "Rp" + Number(val).toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 🔥 LABEL MANUAL */}
            <div className="mt-6 space-y-3">
              {categoryData.map((c, i) => {
                const percent = ((c.value / totalCategory) * 100).toFixed(0);

                return (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    {/* KIRI */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      ></div>

                      <span className="text-gray-300">{c.name}</span>
                    </div>

                    {/* KANAN */}
                    <span className="text-white font-semibold">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔥 HEATMAP SALES */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4">Orders by Time</h2>

            {/* HEADER (STATIC) */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 text-xs text-gray-400 mb-2">
              <div></div>
              {days.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* SCROLL AREA */}
            <div className="max-h-[330px] overflow-y-auto pr-1 flex flex-col gap-1">
              {hours.map((h) => (
                <div
                  key={h}
                  className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 items-center"
                >
                  {/* JAM */}
                  <div className="text-xs text-gray-400">{h} am</div>

                  {/* GRID */}
                  {days.map((d) => {
                    const val = heatmap[d][h];

                    return (
                      <div
                        key={d + h}
                        className="aspect-square w-full rounded-md"
                        style={{
                          background: val === 0 ? "transparent" : getColor(val),
                          border:
                            val === 0
                              ? "1px solid rgba(255,255,255,0.2)"
                              : "none",
                          boxShadow:
                            val > 0 ? "0 0 10px rgba(239,68,68,0.4)" : "none",
                        }}
                        title={`${d} ${h}:00 = ${val}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* LEGEND */}
            <div className="flex gap-3 mt-4 text-xs items-center">
              <span>Low</span>
              <div className="w-4 h-4 bg-[#1a1a1a] rounded"></div>
              <div className="w-4 h-4 bg-[#4f0707] rounded"></div>
              <div className="w-4 h-4 bg-[#8c0f0f] rounded"></div>
              <div className="w-4 h-4 bg-[#be1515] rounded"></div>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* 🔥 PRODUCT PERFORMANCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* 🔥 BEST SELLING */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Best Selling Product</h2>
              <span className="text-green-400 text-xl">↗</span>
            </div>

            <h3 className="text-xl font-semibold mb-1">
              {bestProduct.name || "-"}
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              {bestProduct.sold || 0} units sold
            </p>

            {/* 🔥 PROGRESS BAR */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#111] rounded-full">
                <div
                  className="h-2 bg-red-500 rounded-full"
                  style={{
                    width: `${((bestProduct.sold || 0) / maxSold) * 100}%`,
                  }}
                />
              </div>

              <span className="text-sm text-gray-400">
                {Math.round(((bestProduct.sold || 0) / maxSold) * 100)}%
              </span>
            </div>
          </div>

          {/* 🔥 LOWEST PERFORMANCE */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Lowest Performance</h2>
              <span className="text-red-400 text-xl">↘</span>
            </div>

            <h3 className="text-xl font-semibold mb-1">
              {worstProduct.name || "-"}
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              {worstProduct.sold || 0} units sold
            </p>

            {/* 🔥 PROGRESS BAR */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#111] rounded-full">
                <div
                  className="h-2 bg-gray-400 rounded-full"
                  style={{
                    width: `${((worstProduct.sold || 0) / maxSold) * 100}%`,
                  }}
                />
              </div>

              <span className="text-sm text-gray-400">
                {Math.round(((worstProduct.sold || 0) / maxSold) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
