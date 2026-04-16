"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      const data = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(data);
    };

    loadOrders(); // initial load

    window.addEventListener("ordersUpdated", loadOrders);

    return () => {
      window.removeEventListener("ordersUpdated", loadOrders);
    };
  }, []);
  const updateStatus = (id, newStatus) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const prevStatus = order.status;

    // ✅ ANTI DOUBLE TRIGGER
    if (prevStatus === newStatus) return;

    // 🔥 UPDATE STATUS DULU
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o,
    );

    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));

    let sales = JSON.parse(localStorage.getItem("salesData")) || [];
    let products = JSON.parse(localStorage.getItem("productsMaster")) || [];

    // ====================================
    // ✅ CASE 1: Pending → Completed
    // ====================================
    if (prevStatus === "Pending" && newStatus === "Completed") {
      order.items.forEach((item) => {
        // ➕ TAMBAH SALES
        sales.push({
          orderId: order.id, // 🔥 WAJIB
          name: item.name,
          qty: item.qty,
          price: item.selling,
          date: order.date,
          category: item.category || "Other",
        });

        // ➖ KURANGI STOCK
        products = products.map((p) => {
          if (p.name === item.name) {
            return {
              ...p,
              variants: p.variants.map((v) => {
                if (v.color === item.color && v.storage === item.storage) {
                  return {
                    ...v,
                    stock: v.stock - item.qty,
                  };
                }
                return v;
              }),
            };
          }
          return p;
        });
      });
    }

    // ====================================
    // ✅ CASE 2: Completed → Cancelled
    // ====================================
    if (prevStatus === "Completed" && newStatus === "Cancelled") {
      // ❌ HAPUS SALES SEKALI SAJA
      console.log("BEFORE DELETE:", sales.length);

      sales = sales.filter((s) => String(s.orderId) !== String(order.id));

      console.log("AFTER DELETE:", sales.length);

      // ➕ BALIKIN STOCK
      order.items.forEach((item) => {
        products = products.map((p) => {
          if (p.name === item.name) {
            return {
              ...p,
              variants: p.variants.map((v) => {
                if (v.color === item.color && v.storage === item.storage) {
                  return {
                    ...v,
                    stock: v.stock + item.qty,
                  };
                }
                return v;
              }),
            };
          }
          return p;
        });
      });
    }

    console.log("ORDER ID:", order.id);
    console.log("SALES:", sales);

    // ====================================
    // ❌ CASE 3: Pending → Cancelled
    // (NO EFFECT)
    // ====================================
    // 🔥 HITUNG ULANG TOTAL STOCK (WAJIB)
    products = products.map((p) => ({
      ...p,
      stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    }));

    // SAVE
    localStorage.setItem("salesData", JSON.stringify(sales));
    localStorage.setItem("productsMaster", JSON.stringify(products));

    // REFRESH
    window.dispatchEvent(new Event("salesUpdated"));
    window.dispatchEvent(new Event("productsUpdated"));
    window.dispatchEvent(new Event("ordersUpdated"));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 py-4 mt-20">
        <h1 className="text-3xl font-semibold mb-1">Order Management</h1>
        <p className="text-gray-400 mb-6">Monitor and manage customer orders</p>

        {/* 🔥 CONDITIONAL RENDER */}
        {orders.length === 0 ? (
          <div className="bg-[#1a1a1a] p-12 rounded-2xl border border-[#2a2a2a] flex flex-col items-center justify-center text-center">
            {/* ICON */}
            <div className="w-16 h-16 border border-[#444] rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10"
                />
              </svg>
            </div>

            {/* TEXT */}
            <p className="text-gray-400 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]"
              >
                {/* HEADER */}
                <div className="grid grid-cols-5 gap-4 items-center mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Order ID</p>
                    <p className="font-semibold">{order.id}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Customer</p>
                    <p className="font-semibold">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="font-semibold">{order.date}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="font-semibold text-red-500">
                      Rp{order.total?.toLocaleString()}
                    </p>
                  </div>

                  {/* STATUS DROPDOWN */}
                  <div className="text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-[#111] border border-[#333] px-4 py-2 rounded-xl"
                    >
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* STATUS BADGE */}
                <div className="mb-4">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm ${
                      order.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <hr className="border-[#2a2a2a] my-4" />

                {/* DETAIL */}
                <div className="grid grid-cols-2 gap-6">
                  {/* SHIPPING */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Shipping Address
                    </p>
                    <p>{order.customer?.address}</p>
                    <p className="text-gray-400 text-sm">
                      Phone: {order.customer?.phone}
                    </p>
                  </div>

                  {/* ITEMS */}
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Order Items</p>

                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-400 text-sm">
                            Quantity: {item.qty}
                          </p>
                        </div>

                        <p className="font-semibold">
                          Rp{(item.selling * item.qty).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
