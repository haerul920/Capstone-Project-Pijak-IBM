"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  Package,
  Wallet,
  UserPlus,
  Inbox,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { useLanguageStore, translations } from "@/store/languageStore";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  location: string;
  birthDate: string; // YYYY-MM-DD
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Budi Santoso", email: "budi.s@email.com", phone: "+62 812-3456-7890", orders: 42, totalSpent: 12500000, location: "Jakarta, ID", birthDate: "1985-06-15" },
  { id: "2", name: "Siti Aminah", email: "siti.a@email.com", phone: "+62 811-2233-4455", orders: 12, totalSpent: 3450000, location: "Bandung, ID", birthDate: "1998-11-20" },
  { id: "3", name: "Andi Wijaya", email: "andi.w@email.com", phone: "+62 878-9900-1122", orders: 1, totalSpent: 890000, location: "Surabaya, ID", birthDate: "2012-02-10" },
  { id: "4", name: "Rina Kartika", email: "rina.k@email.com", phone: "+62 856-7788-9900", orders: 8, totalSpent: 1200000, location: "Medan, ID", birthDate: "1972-04-05" },
  { id: "5", name: "Joko Susilo", email: "joko.s@email.com", phone: "+62 813-4455-6677", orders: 25, totalSpent: 8500000, location: "Semarang, ID", birthDate: "1960-09-30" },
  { id: "6", name: "Dio", email: "dio@email.com", phone: "+62 812-0000-1111", orders: 5, totalSpent: 2500000, location: "Jakarta, ID", birthDate: "2005-05-13" },
];

function getGeneration(birthDate: string, t: any) {
  const year = new Date(birthDate).getFullYear();
  if (year >= 1946 && year <= 1964) return { label: t.babyBoomer || "Baby Boomer", color: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20" };
  if (year >= 1965 && year <= 1976) return { label: t.genX || "Gen X", color: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" };
  if (year >= 1977 && year <= 1994) return { label: t.genY || "Gen Y", color: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20" };
  if (year >= 1995 && year <= 2010) return { label: t.genZ || "Gen Z", color: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20" };
  if (year >= 2011 && year <= 2025) return { label: t.genAlpha || "Gen Alpha", color: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" };
  return { label: t.unknown || "Unknown", color: "bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400" };
}

export default function CustomersPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { format, formatAbbreviated } = useFormatCurrency();
  const { addNotification } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { 
      label: t.totalCustomers || "Total Customers", 
      value: "1,284", 
      subtitle: t.totalCustomersDesc || "Active accounts across Lumina ecosystem.",
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10"
    },
    { 
      label: t.newCustomers || "New Customers", 
      value: "+48", 
      subtitle: t.newCustomersDesc || "Registration velocity last 30 days.",
      icon: <UserPlus className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    { 
      label: t.totalOrders || "Total Orders", 
      value: "3,892", 
      subtitle: t.totalOrdersDesc || "Successful transaction conversions.",
      icon: <Package className="w-5 h-5" />,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-500/10"
    },
    { 
      label: t.avgSpending || "Avg Spending", 
      value: formatAbbreviated(425000), 
      subtitle: t.avgSpendingDesc || "Mean transaction value per unit.",
      icon: <Wallet className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10"
    },
  ];

  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Simulate notification for a new customer registration
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: "Customer Baru Terdaftar",
        description: "Dio baru saja membuat akun dan bergabung dengan ekosistem Lumina.",
        type: "SUCCESS",
        source: "Auth"
      });
    }, 20000); // 20 seconds after load
    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700 dark:bg-slate-950 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-600/20" />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t.customersTitleHeader || "Customer Database"}</h1>
        </div>
        <p className="text-slate-400 dark:text-slate-500 font-medium text-xl max-w-lg leading-snug">{t.customersSubtitle || "Monitor and manage global customer demographic intelligence."}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-200/20 transition-all duration-500 group">
            <div className="flex items-center gap-6 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{s.value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
              {s.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-sm overflow-hidden transition-colors">
        {/* Search Bar Section */}
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-6 flex-wrap bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-lg w-full group">
            <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder={t.searchCustomersPlaceholder || "Search by name, email, or generation..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="px-6 py-4 bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
               {t.exportRegistry || "Export Registry"}
             </button>
             <button className="px-6 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
               {t.addNewCustomer || "Add New Entity"}
             </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {filteredCustomers.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.entityName || "Customer Entity"}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.generation || "Generation"}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contactChannels || "Contact Channels"}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.region || "Geographic Region"}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.ordersCount || "Orders"}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t.lifetimeValue || "Lifetime Value"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredCustomers.map((c) => {
                  const gen = getGeneration(c.birthDate, t);
                  return (
                    <tr key={c.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-500/5 cursor-pointer transition-all duration-300">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 font-black text-base shadow-sm group-hover:scale-110 transition-transform">
                            {c.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight">{c.name}</p>
                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter flex items-center gap-2">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" /> ID: LUM-{c.id.padStart(4, '0')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${gen.color}`}>
                          {gen.label}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-blue-500" /> {c.email}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            <Phone className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" /> {c.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                          <MapPin className="w-4 h-4 text-rose-500" /> {c.location}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                          {c.orders}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">{format(c.totalSpent)}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase">
                             <TrendingUp className="w-3 h-3" /> +12.4%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-32 px-10 text-center space-y-8 animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center shadow-inner">
                <Inbox className="w-10 h-10 text-slate-200 dark:text-slate-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.emptyCustomersTitle || "No Entities Detected"}</h3>
                <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                  {t.emptyCustomersDesc || "Customer intelligence will populate once entities engage with the Lumina ecosystem."}
                </p>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                <UserPlus className="w-4 h-4" /> Register First Entity
              </button>
            </div>
          )}
        </div>

        {/* Pagination / Footer */}
        <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Showing <span className="text-slate-900 dark:text-white">1 - {filteredCustomers.length}</span> of 1,284 total entities
           </p>
           <div className="flex items-center gap-3">
              <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-600 transition-all disabled:opacity-30" disabled>
                 <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
