import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  Database,
  BarChart3,
  TrendingUp,
  Package,
  FileText,
  Settings,
  Search,
  Bell,
  ChevronDown
} from "lucide-react";

export function Root() {
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/input-data", label: "Input Data", icon: Database },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/predictions", label: "Predictions", icon: TrendingUp },
    { path: "/products", label: "Products", icon: Package },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0B0B0B] text-white dark">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col">
        <div className="p-6 border-b border-[#2A2A2A]">
          <h1 className="text-xl text-white">SalesForecast AI</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#FF3B3B] text-white"
                    : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#1A1A1A] border-b border-[#2A2A2A] flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3B3B] rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#2A2A2A] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#FF3B3B] rounded-full flex items-center justify-center">
                <span>U</span>
              </div>
              <span className="text-sm text-gray-300">User</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-[#0B0B0B]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
