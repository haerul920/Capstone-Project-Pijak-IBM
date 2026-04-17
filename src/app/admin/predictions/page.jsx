"use client";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Predictions() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const storedSales = JSON.parse(localStorage.getItem("salesData")) || [];
    const storedProducts = JSON.parse(localStorage.getItem("productsMaster")) || [];
    setSales(storedSales);
    setProducts(storedProducts);
  }, []);

  useEffect(() => {
    if (selectedProduct === "All") {
      setPredictions([]);
      return;
    }

    const productSales = sales
      .filter((s) => s.name === selectedProduct)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const grouped = productSales.reduce((acc, s) => {
      const date = s.date;
      if (!acc[date]) acc[date] = 0;
      acc[date] += Number(s.qty);
      return acc;
    }, {});

    const data = Object.keys(grouped)
      .map((date) => ({ date, qty: grouped[date] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (data.length < 2) {
      setPredictions([]);
      return;
    }

    const lastQty = data[data.length - 1].qty;
    const lastDate = new Date(data[data.length - 1].date);

    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const nextDateStr = nextDate.toISOString().split("T")[0];

    const predictedQty = Math.round(lastQty * 1.1);

    setPredictions([
      ...data,
      { date: nextDateStr, qty: predictedQty, isPrediction: true },
    ]);
  }, [selectedProduct, sales]);

  const lineData = predictions.map((p) => ({
    name: p.date,
    qty: p.qty,
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 py-4 mt-20">
        <h1 className="text-3xl font-semibold mb-1">Demand Prediction</h1>
        <p className="text-gray-400 mb-6">Forecast future demand for each product</p>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Sales Trend & Prediction</h2>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-[#111] border border-[#333] px-4 py-2 rounded-xl"
            >
              <option value="All">All Products</option>
              {products.map((p, i) => (
                <option key={i} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="qty"
                  stroke="#ef4444"
                  strokeWidth={3}
                />
                {predictions.filter(p => p.isPrediction).map((p, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey="qty"
                    stroke="#8884d8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    data={predictions.filter(x => x.date === p.date)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {predictions.filter(p => p.isPrediction).length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Prediction for {predictions.filter(p => p.isPrediction)[0].date}:
                <span className="text-red-400 font-semibold ml-2">
                  {predictions.filter(p => p.isPrediction)[0].qty} units
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}