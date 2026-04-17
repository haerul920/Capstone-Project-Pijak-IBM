"use client";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Calendar, Filter } from "lucide-react";
import { useEffect, useState } from "react";

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

export default function Analytics() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");

  useEffect(() => {
    const storedSales = JSON.parse(localStorage.getItem("salesData")) || [];
    const storedProducts =
      JSON.parse(localStorage.getItem("productsMaster")) || [];

    setSales(storedSales);
    setProducts(storedProducts);
  }, []);

  // 🔥 FILTER DATA BERDASARKAN PRODUCT
  const filteredSales =
    selectedProduct === "All"
      ? sales
      : sales.filter((s) => s.name === selectedProduct);

  // 🔥 LINE CHART (BY DATE)
  const groupDaily = () => {
    const map = {};

    filteredSales.forEach((s) => {
      if (!s.date) return;

      const date = new Date(s.date);
      if (isNaN(date)) return;

      const key = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      const value = Number(s.qty) * Number(s.price);

      if (!map[key]) map[key] = 0;
      map[key] += value;
    });

    return Object.keys(map).map((k) => ({
      name: k,
      sales: map[k],
    }));
  };

  const lineData = groupDaily();

  // 🔥 BAR CHART (PRODUCT COMPARISON)
  const productMap = {};

  sales.forEach((s) => {
    const revenue = Number(s.qty) * Number(s.price);

    if (!productMap[s.name]) {
      productMap[s.name] = { sales: 0, profit: 0 };
    }

    productMap[s.name].sales += revenue;
    productMap[s.name].profit += revenue * 0.4;
  });

  const barData = Object.keys(productMap).map((name) => ({
    name,
    sales: Math.round(productMap[name].sales),
    profit: Math.round(productMap[name].profit),
  }));

  // 🔥 METRICS
  const totalRevenue = filteredSales.reduce(
    (sum, s) => sum + Number(s.qty) * Number(s.price),
    0,
  );

  const totalTransactions = filteredSales.length;
  const avgOrder = totalRevenue / (totalTransactions || 1);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 pt-24 pb-6">
        {/* TITLE */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Analytics</h1>
            <p className="text-gray-400">
              Comprehensive sales performance analysis
            </p>
          </div>

          {/* 🔥 FILTER */}
          <div className="flex gap-3">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-xl"
            >
              <option value="All">All Products</option>
              {products.map((p, i) => (
                <option key={i} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔥 LINE CHART */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Sales Trend ({selectedProduct})
          </h2>

          <div className="h-80">
            <ResponsiveContainer>
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
              >
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={formatRupiah} width={80} />

                <Tooltip formatter={(val) => formatRupiah(val)} />

                <Line dataKey="sales" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔥 BAR CHART */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Product Comparison</h2>

          <div className="h-80">
            <ResponsiveContainer>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
              >
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={formatRupiah} width={80} />

                <Tooltip formatter={(val) => formatRupiah(val)} />

                <Bar dataKey="sales" fill="#ef4444" />
                <Bar dataKey="profit" fill="#888" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔥 METRICS */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6">Key Metrics</h2>

          <Metric label="Total Revenue" value={formatRupiah(totalRevenue)} />
          <Metric label="Total Transactions" value={totalTransactions} />
          <Metric label="Average Order Value" value={formatRupiah(avgOrder)} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-[#111] px-4 py-4 rounded-xl mb-4 flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}
