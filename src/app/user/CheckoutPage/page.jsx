"use client";
import { useEffect, useState } from "react";

import LandingHeader from "../../components/HeaderLanding";
import CheckoutStep from "../../components/CheckoutStep";
import { useRouter } from "next/navigation";



export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, []);

  const [payment, setPayment] = useState("card");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    const key = `cart_${user.username}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];

    setCart(data);
  }, []);

  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || !user.username) {
      alert("Silakan login dulu!");
      router.push("/login");
      return;
    }

    const cartKey = `cart_${user.username}`;
    const orderKey = `orders_${user.username}`;

    const cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    const userOrders = JSON.parse(localStorage.getItem(orderKey)) || [];

    let globalOrders = [];
    const stored = localStorage.getItem("orders");

    if (stored) {
      try {
        globalOrders = JSON.parse(stored);
        if (!Array.isArray(globalOrders)) globalOrders = [];
      } catch {
        globalOrders = [];
      }
    }

    if (!form.firstName || !form.phone || !form.address) {
      alert("Lengkapi data dulu!");
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: cartData,
      total,
      discount: discountAmount,
      voucher: discount > 0 ? "NEW35" : null,
      customer: {
        ...form,
        username: user.username,
      },
      payment,
      date: new Date().toISOString(),
      status: "Pending",
    };

    localStorage.setItem(orderKey, JSON.stringify([...userOrders, newOrder]));

    const updatedOrders = [...globalOrders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    localStorage.removeItem(cartKey);
    localStorage.removeItem("voucher");

    window.dispatchEvent(new Event("ordersUpdated"));

    // ✅ PINDAHIN LOG KE DALAM FUNCTION
    console.log("SETELAH:", updatedOrders);
    console.log("GLOBAL AFTER:", updatedOrders);

    alert("Checkout berhasil 🎉");
    router.push("/user/OrdersPage");
  };
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const voucher = localStorage.getItem("voucher");

    if (voucher === "NEW35") {
      setDiscount(0.35);
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.selling * item.qty, 0);

  const shipping = 0;

  const discountAmount = subtotal * discount;
  const total = subtotal + shipping - discountAmount;

  return (
    <div className="bg-gray-100 min-h-screen">
      <LandingHeader />

      <CheckoutStep currentStep={2} />

      <div className="grid grid-cols-2 gap-10 p-10 text-black">
        {/* ================= LEFT ================= */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>

          {/* CUSTOMER */}
          <h3 className="font-semibold mb-2">Customer Details</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="First Name"
              className="border p-2 rounded"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
            <input
              placeholder="Last Name (Opsional)"
              className="border p-2 rounded"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
          </div>

          <input
            placeholder="Email"
            className="w-full border p-2 rounded mb-3"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <input
            placeholder="Phone"
            className="w-full border p-2 rounded mb-6"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {/* SHIPPING */}
          <h3 className="font-semibold mb-2">Shipping Details</h3>

          <input
            placeholder="Address"
            className="w-full border p-2 rounded mb-3"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              placeholder="City"
              className="border p-2 rounded"
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              placeholder="Country"
              className="border p-2 rounded"
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>

          {/* PAYMENT */}
          <h3 className="font-semibold mb-2 text-black">Payment Method</h3>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setPayment("card")}
              className={`border px-4 py-2 rounded ${
                payment === "card" && "bg-black text-white"
              }`}
            >
              Credit Card
            </button>

            <button
              onClick={() => setPayment("cod")}
              className={`border px-4 py-2 rounded ${
                payment === "cod" && "bg-black text-white"
              }`}
            >
              COD
            </button>
          </div>

          {payment === "card" && (
            <div className="grid grid-cols-3 gap-4">
              {/* Card Number full */}
              <input
                placeholder="Card Number"
                className="col-span-3 w-full border p-3 rounded"
              />

              {/* MM/YY & CVV 50% 50% */}
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <input
                  placeholder="MM/YY"
                  className="w-full border p-3 rounded"
                />
                <input
                  placeholder="CVV"
                  className="w-full border p-3 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {cart.map((item, i) => (
            <div key={i} className="flex gap-4 mb-4">
              <img src={item.image} className="w-16 h-16 object-contain" />

              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Rp{item.selling.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span>{item.qty}</span>
              </div>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>Rp{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span>Gratis</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600 text-sm mb-2">
              <span>Voucher NEW35</span>
              <span>-Rp{discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between font-bold mt-3">
            <span>Total</span>
            <span>Rp{total.toLocaleString()}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-black text-white py-3 rounded-xl"
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
