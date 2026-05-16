"use client";

import { Package, User, Clock, FileText, MessageCircle } from "lucide-react";
import { DrawerType } from "./OrderActionManager";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";

interface OrderDetailsDrawerProps {
  orderId: string;
  onNavigate: (view: DrawerType, newOrderId?: string) => void;
}

export default function OrderDetailsDrawer({ orderId, onNavigate }: OrderDetailsDrawerProps) {
  const { format } = useFormatCurrency();

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Overview Hero */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{orderId}</h2>
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-100 dark:border-emerald-500/20">Paid</span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Placed on May 10, 2026 at 14:20
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate("CHAT")}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Contact
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Items & Summary */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Line Items */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-400" /> Fulfillment Items
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">3 Items</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: "Wireless Noise-Cancelling Headphones", sku: "AUD-WH-1000", qty: 1, price: 1250000, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200" },
                { name: "Ergonomic Desk Stand", sku: "ACC-DSK-02", qty: 2, price: 350000, img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=200" },
              ].map((item, i) => (
                <div key={i} className="p-6 flex gap-4">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-800">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono mt-1">SKU: {item.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Qty: {item.qty}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{format(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Breakdown */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Financial Breakdown
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal (3 items)</span>
                <span className="text-slate-900 dark:text-white font-semibold">{format(1950000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Shipping (JNE REG)</span>
                <span className="text-slate-900 dark:text-white font-semibold">{format(25000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Tax & Fees</span>
                <span className="text-slate-900 dark:text-white font-semibold">{format(11000)}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">Total Paid</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{format(1986000)}</span>
              </div>
            </div>
          </section>

        </div>

        {/* Right Col: Customer & Context */}
        <div className="space-y-8">
          
          {/* Customer Card */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Customer Profile
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-lg flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
                  BS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Budi Santoso</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Customer since 2024</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">budi.santoso@example.com</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">+62 812 3456 7890</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shipping Address</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    Jl. Jendral Sudirman No. 45<br/>
                    Tower B, 14th Floor<br/>
                    Kebayoran Baru, Jakarta Selatan<br/>
                    DKI Jakarta 12190
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
