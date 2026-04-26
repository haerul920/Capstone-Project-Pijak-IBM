"use client";

import { useEffect, useState } from "react";
import LandingHeader from "../../components/HeaderLanding";
import { Trash2 } from "lucide-react";
import CheckoutStep from "../../components/CheckoutStep";
import { useRouter } from "next/navigation";



export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
const router = useRouter();
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) return;

  const key = `cart_${user.username}`;
  const data = JSON.parse(localStorage.getItem(key)) || [];

  setCart(data);
  setSelected(data.map((_, i) => i));
}, []);



const handleCouponClick = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || !user.isLogin) {
    router.push("/login");
  } else {
    router.push("/user/VoucherPage");
  }
};

  const [discount, setDiscount] = useState(0);
  useEffect(() => {
    const voucher = localStorage.getItem("voucher");

    if (voucher === "NEW35") {
      setDiscount(0.35);
    } else {
      setDiscount(0);
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    const user = JSON.parse(localStorage.getItem("user"));
    const key = `cart_${user.username}`;

    localStorage.setItem(key, JSON.stringify(newCart));

    // 🔥 TAMBAHAN PENTING
    window.dispatchEvent(new Event("ordersUpdated"));
  };

  const toggleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleAll = () => {
    if (selected.length === cart.length) {
      setSelected([]);
    } else {
      setSelected(cart.map((_, i) => i));
    }
  };

  const increaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].qty += 1;
    updateCart(newCart);
  };

  const decreaseQty = (index) => {
    const newCart = [...cart];
    if (newCart[index].qty > 1) {
      newCart[index].qty -= 1;
    }
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item, i) => {
    if (selected.includes(i)) {
      return sum + item.selling * item.qty;
    }
    return sum;
  }, 0);

  const finalTotal = total - total * discount;

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <LandingHeader />

      {/* 🔥 STEP */}
      <CheckoutStep currentStep={1} />

      <div className="grid grid-cols-3 gap-6 px-10 pb-10 text-black">
        {/* LEFT */}
        <div className="col-span-2 space-y-4">
          {/* SELECT ALL */}
          <div className="bg-white p-4 rounded-xl flex justify-between items-center text-black">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.length === cart.length}
                onChange={toggleAll}
              />
              <span>Semua</span>
            </div>

            <button className="text-gray-400">Hapus</button>
          </div>

          {/* ITEMS */}
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl flex justify-between items-center"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selected.includes(index)}
                  onChange={() => toggleSelect(index)}
                />

                <img src={item.image} className="w-20 h-20 object-contain" />

                <div>
                  <h3 className="font-semibold">
                    {item.name} {item.color} {item.storage}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Rp{item.selling.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6">
                {/* QTY */}
                <div className="flex items-center gap-3 border rounded-lg px-3 py-1">
                  <button onClick={() => decreaseQty(index)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(index)}>+</button>
                </div>

                {/* DELETE */}
                <button
                  onClick={() => removeItem(index)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-semibold mb-4">Total</h2>
          {/* 🔥 STATUS VOUCHER */}
          {discount > 0 && (
            <div className="text-green-600 text-sm mb-2">
              Voucher NEW35 digunakan ✅
            </div>
          )}

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>Rp{total.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-orange-500 mb-2">
              <span>Diskon 35%</span>
              <span>-Rp{(total * discount).toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp{finalTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Biaya pengiriman</span>
            <span className="text-orange-500">Gratis</span>
          </div>

          {/* COUPON */}
          <div
            onClick={handleCouponClick}
            className="bg-orange-100 text-sm p-3 rounded-lg mb-4 cursor-pointer hover:bg-orange-200 transition"
          >
            Kupon - Masuk untuk melihat kupon Anda →
          </div>

          <button
            onClick={() => router.push("/user/CheckoutPage")}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
