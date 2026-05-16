"use client";

import { useCart } from "../../../lib/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { formatIDR } from "../../components/ui/utils";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    appliedVoucher,
  } = useCart();

  const { user } = useUser();
  const router = useRouter();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = appliedVoucher ? subtotal * appliedVoucher.discount : 0;
  const finalTotal = subtotal - discountAmount;

  const handleCheckoutRedirect = () => {
    if (!user) {
      toast.error("Masuk Terlebih Dahulu", {
        description: "Silakan login untuk melanjutkan ke pembayaran.",
      });
      router.push("/sign-in");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* TOP STEPS */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 py-5">
          {/* STEP 1 - ACTIVE */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shadow-md">
              1
            </div>
            <span className="text-sm font-bold text-black">Keranjang</span>
          </div>

          <div className="w-12 h-[1px] bg-zinc-300" />

          {/* STEP 2 - INACTIVE */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-zinc-200 text-zinc-400 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span className="text-sm font-medium text-zinc-400">Checkout</span>
          </div>

          <div className="w-12 h-[1px] bg-zinc-300" />

          {/* STEP 3 - INACTIVE */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-zinc-200 text-zinc-400 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-sm font-medium text-zinc-400">Ulasan</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Keranjang kosong</h2>
            <Link
              href="/"
              className="inline-flex bg-black text-white px-6 py-3 rounded-lg text-sm"
            >
              Lanjut Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-4">
              {/* HEADER */}
              <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-4 h-4" />
                  <span className="text-sm font-medium">Semua</span>
                </div>
                <button
                  onClick={clearCart}
                  className="text-xs text-zinc-400 hover:text-red-500 transition"
                >
                  Hapus
                </button>
              </div>

              {/* ITEMS */}
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <input type="checkbox" checked readOnly className="w-4 h-4" />
                    <div className="w-20 h-20 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.image ||
                          item.images?.[0] ||
                          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-black line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-zinc-500 mt-1 text-sm font-medium">
                        {formatIDR(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-5">
                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 border border-zinc-200 rounded-xl px-3 py-1.5 bg-zinc-50">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="text-zinc-600 hover:text-black transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="text-zinc-600 hover:text-black transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div>
              <div className="bg-white rounded-2xl p-5 sticky top-24 shadow-sm border border-zinc-100">
                <h2 className="text-lg font-bold mb-4">Ringkasan Pesanan</h2>

                {/* SUMMARY */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">{formatIDR(subtotal)}</span>
                  </div>

                  {appliedVoucher && (
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Diskon ({appliedVoucher.code})</span>
                      <span className="font-medium">
                        -{formatIDR(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Biaya pengiriman</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="text-lg font-bold text-black">
                      {formatIDR(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* COUPON */}
                <Link href="/coupon">
                  <div
                    className={`
                    border rounded-xl px-4 py-3 mb-5 text-xs transition cursor-pointer
                    ${
                      appliedVoucher
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-[#fdf8ef] border-[#f6e7cb] text-orange-800 hover:bg-[#f6e7cb]"
                    }
                  `}
                  >
                    {appliedVoucher
                      ? `Voucher ${appliedVoucher.code} Terpasang ✅`
                      : "Kupon - Masuk untuk melihat kupon Anda →"}
                  </div>
                </Link>

                {/* BUTTON */}
                <button
                  onClick={handleCheckoutRedirect}
                  className="w-full bg-black hover:bg-zinc-800 text-white rounded-xl py-3 text-sm font-semibold transition shadow-md active:scale-[0.98]"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
