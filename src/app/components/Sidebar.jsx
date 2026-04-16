"use client";

import {
  LayoutDashboard,
  Database,
  Package,
  BarChart2,
  TrendingUp,
  Box,
  FileText,
  Settings,
  ShoppingBag,
  Star,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const menu = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/admin/dashboard",
    },
    {
      label: "Input Penjualan",
      icon: <Database size={18} />,
      path: "/admin/input-penjualan",
    },
    {
      label: "Inventory",
      icon: <Package size={18} />,
      path: "/admin/inventory",
    },
    {
      label: "Analytics",
      icon: <BarChart2 size={18} />,
      path: "/admin/analytics",
    },
    {
      label: "Predictions",
      icon: <TrendingUp size={18} />,
      path: "/admin/predictions",
    },
    {
      label: "Products",
      icon: <Box size={18} />,
      path: "/admin/products",
    },
    {
      label: "Orders",
      icon: <ShoppingBag size={18} />,
      path: "/admin/orders",
    },
    {
      label: "Reviews",
      icon: <Star size={18} />,
      path: "/admin/reviews",
    },
    {
      label: "Reports",
      icon: <FileText size={18} />,
      path: "/admin/reports",
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 min-w-[250px] bg-[#1a1a1a] p-4 h-screen border-r border-[#2a2a2a]">
      <h1 className="text-white text-lg font-bold mb-6">
        SalesForecast AI
      </h1>

      <div className="space-y-2">
        {menu.map((item, i) => (
          <MenuItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ icon, label, path }) {
  const pathname = usePathname();

  // 🔥 FIX ACTIVE (biar semua child ikut aktif)
  const isActive = pathname.startsWith(path);

  return (
    <Link
      href={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-red-500 text-white"
          : "text-gray-400 hover:bg-[#222] hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}