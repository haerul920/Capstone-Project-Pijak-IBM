import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  // Sample data for charts
  const salesData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month, index) => ({
      month,
      actual: 15000 + Math.random() * 10000 + index * 2000,
      predicted: 16000 + Math.random() * 9000 + index * 2100,
    }));
  }, []);

  const [summaryStats] = useState({
    totalSales: 245678,
    revenue: 1234567,
    growthRate: 12.5,
    accuracy: 94.2,
  });

  const [insights] = useState([
    {
      type: "increase",
      text: "Sales increased by 18% in the last quarter",
      icon: ArrowUp,
    },
    {
      type: "alert",
      text: "Product A shows declining performance trend",
      icon: ArrowDown,
    },
    {
      type: "recommendation",
      text: "Optimize inventory for holiday season",
      icon: Sparkles,
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          AI-powered sales insights and forecasting
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#FF3B3B]" />
            </div>
            <span className="text-xs text-gray-500">+8.2%</span>
          </div>
          <h3 className="text-2xl text-white mb-1">
            ${summaryStats.totalSales.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">Total Sales</p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#FF3B3B]" />
            </div>
            <span className="text-xs text-gray-500">+12.5%</span>
          </div>
          <h3 className="text-2xl text-white mb-1">
            ${summaryStats.revenue.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">Revenue</p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#FF3B3B]" />
            </div>
            <span className="text-xs text-green-500">
              +{summaryStats.growthRate}%
            </span>
          </div>
          <h3 className="text-2xl text-white mb-1">
            {summaryStats.growthRate}%
          </h3>
          <p className="text-sm text-gray-400">Growth Rate</p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[#FF3B3B]" />
            </div>
            <span className="text-xs text-green-500">+2.1%</span>
          </div>
          <h3 className="text-2xl text-white mb-1">{summaryStats.accuracy}%</h3>
          <p className="text-sm text-gray-400">Prediction Accuracy</p>
        </div>
      </div>

      {/* Chart and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <h2 className="text-white mb-6">Historical vs Predicted Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="month" stroke="#666" />
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
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#FF3B3B"
                strokeWidth={2}
                dot={{ fill: "#FF3B3B" }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#666"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#666" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <h2 className="text-white mb-4">AI Insights</h2>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-[#0B0B0B] rounded-lg border border-[#2A2A2A]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      insight.type === "increase"
                        ? "bg-green-500/10"
                        : insight.type === "alert"
                          ? "bg-[#FF3B3B]/10"
                          : "bg-blue-500/10"
                    }`}
                  >
                    <insight.icon
                      className={`w-4 h-4 ${
                        insight.type === "increase"
                          ? "text-green-500"
                          : insight.type === "alert"
                            ? "text-[#FF3B3B]"
                            : "text-blue-500"
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-300 flex-1">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Best Selling Product</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl text-white mb-2">Premium Laptop Pro</p>
          <p className="text-sm text-gray-400">1,234 units sold this month</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-[#0B0B0B] rounded-full h-2">
              <div
                className="bg-[#FF3B3B] h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-400">85%</span>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Lowest Performance</h3>
            <ArrowDown className="w-5 h-5 text-[#FF3B3B]" />
          </div>
          <p className="text-2xl text-white mb-2">Basic Mouse</p>
          <p className="text-sm text-gray-400">89 units sold this month</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-[#0B0B0B] rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full"
                style={{ width: "15%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-400">15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
