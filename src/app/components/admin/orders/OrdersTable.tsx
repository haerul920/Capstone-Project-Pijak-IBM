"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  Eye,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import OrderActionManager, { DrawerType } from "./drawers/OrderActionManager";

interface Order {
  id: string;
  customer: string;
  avatar: string;
  city: string;
  date: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  payment: "PAID";
  items: number;
}

const INITIAL_ORDERS: Order[] = [
  { id: "#ORD-8821", customer: "Budi Santoso", avatar: "BS", city: "Jakarta", date: "2026-05-10 14:20", total: 1250000, status: "PROCESSING", payment: "PAID", items: 3 },
  { id: "#ORD-8822", customer: "Siti Aminah", avatar: "SA", city: "Surabaya", date: "2026-05-10 13:45", total: 450000, status: "PENDING", payment: "PAID", items: 1 },
  { id: "#ORD-8823", customer: "Andi Wijaya", avatar: "AW", city: "Bandung", date: "2026-05-10 12:10", total: 2300000, status: "SHIPPED", payment: "PAID", items: 5 },
  { id: "#ORD-8824", customer: "Rina Kartika", avatar: "RK", city: "Medan", date: "2026-05-10 10:30", total: 890000, status: "COMPLETED", payment: "PAID", items: 2 },
  { id: "#ORD-8825", customer: "Joko Susilo", avatar: "JS", city: "Yogyakarta", date: "2026-05-10 09:15", total: 150000, status: "CANCELLED", payment: "PAID", items: 1 },
  { id: "#ORD-8826", customer: "Dewi Rahayu", avatar: "DR", city: "Makassar", date: "2026-05-11 08:05", total: 3750000, status: "PROCESSING", payment: "PAID", items: 7 },
  { id: "#ORD-8827", customer: "Hendra Gunawan", avatar: "HG", city: "Semarang", date: "2026-05-11 07:30", total: 670000, status: "SHIPPED", payment: "PAID", items: 2 },
];

const STATUS_CONFIG = {
  COMPLETED: { label: "Completed", bg: "bg-emerald-50/50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  PROCESSING: { label: "Processing", bg: "bg-blue-50/50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  SHIPPED: { label: "Shipped", bg: "bg-violet-50/50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  PENDING: { label: "Pending", bg: "bg-amber-50/50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50/50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
};

const PAYMENT_CONFIG = {
  PAID: { label: "Paid", bg: "bg-emerald-50/50", text: "text-emerald-700" },
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [filter, setFilter] = useState("ALL");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [sortKey, setSortKey] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const { format } = useFormatCurrency();
  const ITEMS_PER_PAGE = 7;

  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [drawerOrderId, setDrawerOrderId] = useState<string | null>(null);

  const openDrawer = (type: DrawerType, newOrderId?: string) => {
    setActiveDrawer(type);
    if (newOrderId) setDrawerOrderId(newOrderId);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
    setDrawerOrderId(null);
  };

  const filters = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "ALL" || o.status === filter;
    const matchSearch =
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20"
                  : "bg-transparent text-slate-500 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-[40px_2.5fr_1.5fr_1.5fr_1.2fr_48px] gap-4 px-6 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100/50 dark:border-slate-800">
        {[
          { label: "Order Info", key: "id" },
          { label: "Status", key: "status" },
          { label: "Payment", key: "payment" },
          { label: "Amount", key: "total" },
          { label: "", key: "" },
        ].map((col, i) => (
          <button
            key={i}
            onClick={() => col.key && toggleSort(col.key)}
            className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-left ${i === 0 ? "col-span-2" : ""}`}
          >
            {col.label}
            {col.key === sortKey && (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
          </button>
        ))}
      </div>

      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {paginated.map((order) => {
          const status = STATUS_CONFIG[order.status];
          const payment = PAYMENT_CONFIG[order.payment];
          const isExpanded = expandedRow === order.id;

          return (
            <div key={order.id}>
              <div className={`px-6 py-4 transition-all duration-300 ${isExpanded ? "bg-indigo-50/10 dark:bg-indigo-500/5" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"}`}>
                <div className="flex lg:hidden flex-col gap-4">
                  <div className="flex items-start justify-between cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{order.avatar}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{order.id}</p>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{order.customer}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{format(order.total)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${status.bg} ${status.text} ${status.border}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="hidden lg:grid grid-cols-[40px_2.5fr_1.5fr_1.5fr_1.2fr_48px] gap-4 items-center">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <div className={`w-5 h-5 flex items-center justify-center transition-colors ${isExpanded ? "" : "opacity-0 group-hover:opacity-100"}`}>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-90 text-indigo-500" : ""}`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700">
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{order.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{order.id}</p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{order.customer}</p>
                        <span className="text-slate-300 dark:text-slate-700 text-[10px]">|</span>
                        <div className="flex items-center gap-0.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          {order.city}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${status.bg} ${status.text} ${status.border}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div className="cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium ${payment.bg} ${payment.text}`}>
                      <CreditCard className="w-3 h-3" />
                      {payment.label}
                    </span>
                  </div>

                  <div className="cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{format(order.total)}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{order.items} items</p>
                  </div>

                  <div className="flex items-center justify-end">
                    <button className="w-7 h-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100/60 dark:border-slate-800 px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-5 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Order Details
                        </p>
                        <div className="space-y-4">
                           <div className="flex justify-between">
                             <span className="text-[11px] text-slate-500">Date</span>
                             <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{order.date}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-[11px] text-slate-500">Items</span>
                             <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{order.items} items</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-[11px] text-slate-500">City</span>
                             <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{order.city}</span>
                           </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-5 flex items-center gap-2">
                          <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" /> Quick Actions
                        </p>
                        <div className="space-y-2.5">
                          {[
                            { label: "View Full Order", icon: Eye, type: "ORDER" as DrawerType, primary: true },
                            { label: "Message Customer", icon: MessageCircle, type: "CHAT" as DrawerType, primary: false },
                          ].map((action, i) => {
                            const ActionIcon = action.icon;
                            return (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDrawer(action.type, order.id);
                                }}
                                className={`w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-[11px] font-medium transition-all ${
                                  action.primary
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                <ActionIcon className="w-3.5 h-3.5" />
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > ITEMS_PER_PAGE && (
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100/50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-medium text-slate-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(filtered.length / ITEMS_PER_PAGE) }).map(
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-7 h-7 rounded-md text-[11px] font-medium transition-all ${
                        pageNum === currentPage
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      <OrderActionManager 
        isOpen={activeDrawer !== null}
        activeView={activeDrawer}
        orderId={drawerOrderId}
        onClose={closeDrawer}
        onNavigate={openDrawer}
      />
    </div>
  );
}
