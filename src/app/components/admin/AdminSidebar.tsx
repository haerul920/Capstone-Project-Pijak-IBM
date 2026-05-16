"use client";

import {
  Home,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  Monitor,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Produk",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Chat AI",
    href: "/admin/predictions",
    icon: BarChart3,
  },
  {
    label: "Pelanggan",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="w-[260px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shrink-0 z-40 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="text-primary-foreground w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tight text-foreground uppercase leading-none mb-0.5">
              Lumina OS
            </h1>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              Enterprise AI
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 flex-1 overflow-y-auto">
        <div className="mb-8">
          <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-4 px-3 flex items-center gap-2">
            <Monitor className="w-3 h-3" /> Core Intelligence
          </p>
          <nav className="space-y-1">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const active = pathname === menu.href;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                    active
                      ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-primary hover:bg-sidebar-accent font-medium"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`}
                  />
                  {menu.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-muted/50 rounded-2xl border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> AI Governance
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
            System is operating under active AI constraints with 98% drift
            tolerance.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border shrink-0">
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all group"
        >
          <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
          Logout
        </button>
      </div>
    </aside>
  );
}
