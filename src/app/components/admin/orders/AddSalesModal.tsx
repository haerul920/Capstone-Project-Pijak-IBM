"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_PRODUCTS = [
  { id: "P1", name: "Wireless Noise-Cancelling Headphones", variants: ["Black", "Silver", "Blue"] },
  { id: "P2", name: "Ergonomic Desk Stand", variants: ["Wood", "Metal", "White"] },
  { id: "P3", name: "Mechanical Keyboard", variants: ["Red Switches", "Blue Switches", "Brown Switches"] },
];

export default function AddSalesModal({ isOpen, onClose }: AddSalesModalProps) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!isOpen) return null;

  const currentProduct = MOCK_PRODUCTS.find(p => p.id === selectedProduct);
  const variants = currentProduct ? currentProduct.variants : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedVariant || !quantity || !date || !time) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Sales data added successfully! Stock updated.");
    // Reset form
    setSelectedProduct("");
    setSelectedVariant("");
    setQuantity("");
    setDate("");
    setTime("");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[101] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header Content */}
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Input Penjualan</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Input data penjualan produk</p>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 rounded-xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Add Sales Data</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Product</label>
                  <select 
                    value={selectedProduct}
                    onChange={(e) => {
                      setSelectedProduct(e.target.value);
                      setSelectedVariant("");
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none shadow-sm transition-colors"
                  >
                    <option value="" disabled className="text-slate-400">Select Product</option>
                    {MOCK_PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity Sold */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Quantity Sold</label>
                  <input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="1"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 shadow-sm transition-colors"
                  />
                </div>

                {/* Variant */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Variant</label>
                  <select 
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    disabled={!selectedProduct}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800 shadow-sm transition-colors"
                  >
                    <option value="" disabled className="text-slate-400">Select Variant</option>
                    {variants.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div></div> {/* Spacer */}

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Date</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 shadow-sm transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Time</label>
                  <input 
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 shadow-sm transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                >
                  + Add Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
