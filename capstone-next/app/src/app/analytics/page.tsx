import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar, Filter } from "lucide-react";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30");
  const [selectedProduct, setSelectedProduct] = useState("all");

  const salesTrendData = useMemo(() => {
    const days = parseInt(dateRange);
    return Array.from({ length: days }, (_, i) => ({
      date: `Day ${i + 1}`,
      sales: 5000 + Math.random() * 3000,
    }));
  }, [dateRange]);

  const productPerformanceData = [
    { product: "Laptop Pro", sales: 45000, profit: 18000 },
    { product: "Wireless Mouse", sales: 12000, profit: 6000 },
    { product: "Keyboard", sales: 18000, profit: 7200 },
    { product: "Monitor", sales: 35000, profit: 14000 },
    { product: "Headphones", sales: 22000, profit: 8800 },
  ];

  const categoryData = [
    { category: "Electronics", value: 45 },
    { category: "Accessories", value: 30 },
    { category: "Furniture", value: 15 },
    { category: "Other", value: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">Analytics</h1>
          <p className="text-gray-400">
            Comprehensive sales performance analysis
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            >
              <option value="all">All Products</option>
              <option value="laptop">Laptop Pro</option>
              <option value="mouse">Wireless Mouse</option>
              <option value="keyboard">Keyboard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <h2 className="text-white mb-6">Sales Trend Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#FF3B3B"
              strokeWidth={2}
              dot={{ fill: "#FF3B3B", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Product Performance */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <h2 className="text-white mb-6">Product Performance Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="product" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#FF3B3B" radius={[8, 8, 0, 0]} />
            <Bar dataKey="profit" fill="#666" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <h2 className="text-white mb-4">Category Distribution</h2>
          <div className="space-y-4">
            {categoryData.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{cat.category}</span>
                  <span className="text-sm text-gray-400">{cat.value}%</span>
                </div>
                <div className="w-full bg-[#0B0B0B] rounded-full h-2">
                  <div
                    className="bg-[#FF3B3B] h-2 rounded-full transition-all"
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <h2 className="text-white mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-400">Average Order Value</span>
              <span className="text-white">$248.50</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-400">Total Transactions</span>
              <span className="text-white">2,456</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-400">Conversion Rate</span>
              <span className="text-white">3.2%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-400">Customer Retention</span>
              <span className="text-white">68%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
