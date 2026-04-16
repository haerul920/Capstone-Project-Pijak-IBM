"use client";
import { ArrowUp, ArrowDown, Sparkles } from "lucide-react";

export default function Insight({ text, type }) {
  const config = {
    positive: {
      icon: <ArrowUp />,
      color: "bg-green-900/30 text-green-400",
    },
    negative: {
      icon: <ArrowDown />,
      color: "bg-red-900/30 text-red-400",
    },
    neutral: {
      icon: <Sparkles />,
      color: "bg-blue-900/30 text-blue-400",
    },
  };

  const current = config[type] || config.neutral;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111] border border-[#2a2a2a] mb-3">
      <div className={`p-2 rounded-lg ${current.color}`}>{current.icon}</div>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}
