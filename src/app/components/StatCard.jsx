"use client";
import { DollarSign, TrendingUp, Activity, Target } from "lucide-react";

export default function StatCard({ title, value, change, type }) {
  const icons = {
    sales: <DollarSign />,
    revenue: <TrendingUp />,
    growth: <Activity />,
    accuracy: <Target />,
  };

  return (
    <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#2a2a2a] relative">
      {/* Icon */}
      <div className="w-10 h-10 bg-red-500/20 text-red-500 flex items-center justify-center rounded-lg mb-4">
        {icons[type]}
      </div>

      {/* Value */}
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-gray-400">{title}</p>

      {/* Change */}
      <span className="absolute top-5 right-5 text-green-400 text-sm">
        {change}
      </span>
    </div>
  );
}
