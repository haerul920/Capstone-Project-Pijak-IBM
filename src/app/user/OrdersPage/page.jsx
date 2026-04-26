"use client";
import { useEffect, useState } from "react";
import LandingHeader from "../../components/HeaderLanding";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) return;

      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

      const userOrders = allOrders.filter(
        (order) => order.customer?.username === user.username,
      );

      setOrders(userOrders);
    };

    loadOrders();

    window.addEventListener("ordersUpdated", loadOrders);
    window.addEventListener("reviewsUpdated", loadOrders);

    return () => {
      window.removeEventListener("ordersUpdated", loadOrders);
      window.removeEventListener("reviewsUpdated", loadOrders);
    };
  }, []);

  // 🔥 CEK APAKAH SUDAH DIREVIEW
  const hasReviewed = (item, orderId) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    return reviews.find(
      (r) =>
        r.product === item.name &&
        r.orderId === orderId && // 🔥 INI KUNCI
        r.user === user?.username,
    );
  };

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const handleCancelOrder = () => {
    if (!cancelReason) {
      alert("Pilih alasan terlebih dahulu!");
      return;
    }

    const finalReason =
      cancelReason === "Lainnya" ? customReason : cancelReason;

    if (cancelReason === "Lainnya" && !customReason) {
      alert("Isi alasan lainnya!");
      return;
    }

    let allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    let sales = JSON.parse(localStorage.getItem("salesData")) || [];
    let products = JSON.parse(localStorage.getItem("productsMaster")) || [];

    const order = allOrders.find((o) => o.id === selectedOrderId);

    // 🔥 UPDATE STATUS
    const updated = allOrders.map((o) =>
      o.id === selectedOrderId
        ? { ...o, status: "Cancelled", cancelReason: finalReason }
        : o,
    );

    // 🔥 ROLLBACK SALES + STOCK
    if (order) {
      order.items.forEach((item) => {
        // ❌ HAPUS SALES
        sales = sales.filter(
          (s) =>
            !(
              s.name === item.name &&
              s.qty === item.qty &&
              s.date === order.date
            ),
        );

        // 🔥 BALIKIN STOCK
        products = products.map((p) => {
          if (p.name === item.name) {
            return {
              ...p,
              variants: p.variants.map((v) => {
                if (
                  `${v.color} - ${v.storage}` ===
                  `${item.color} - ${item.storage}`
                ) {
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

    // 🔥 SAVE
    localStorage.setItem("orders", JSON.stringify(updated));
    localStorage.setItem("salesData", JSON.stringify(sales));
    localStorage.setItem("productsMaster", JSON.stringify(products));

    // 🔥 TRIGGER REFRESH
    window.dispatchEvent(new Event("ordersUpdated"));
    window.dispatchEvent(new Event("salesUpdated"));
    window.dispatchEvent(new Event("productsUpdated"));

    // RESET
    setShowCancelModal(false);
    setCancelReason("");
    setCustomReason("");
    setSelectedOrderId(null);
  };

  const cancelOptions = [
    "Berubah pikiran / tidak jadi beli",
    "Salah pilih produk (warna, ukuran, varian)",
    "Salah jumlah pesanan",
    "Ingin ubah alamat pengiriman",
    "Menemukan harga lebih murah di tempat lain",
    "Metode pembayaran tidak sesuai / gagal bayar",
    "Salah checkout (tidak sengaja pesan)",
    "Ingin ganti metode pembayaran",
    "Kendala aplikasi / error sistem",
    "Estimasi Pengiriman Terlalu Lama",
    "Lainnya",
  ];
  const [customReason, setCustomReason] = useState("");

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.qty * item.selling, 0);
  };
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <LandingHeader />

      <div className="max-w-5xl mx-auto px-6 py-10 text-black">
        <h1 className="text-2xl font-semibold mb-6">Pesanan Saya</h1>

        {orders.length === 0 && (
          <p className="text-gray-500">Belum ada pesanan 😢</p>
        )}

        <div className="space-y-6">
          {orders.map((order, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <p className="text-sm text-gray-400 mb-2">{order.date}</p>

              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  const reviewData = hasReviewed(item, order.id); // ✅ benar

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      {/* LEFT */}
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.image}
                          className="w-24 h-24 object-contain bg-gray-100 p-2 rounded-lg"
                        />

                        <div>
                          <p className="font-semibold">
                            {item.name} {item.color} {item.storage}
                          </p>

                          {/* STATUS */}
                          <p
                            className={`inline-block px-3 py-1 rounded-lg text-sm mb-2 ${
                              order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : order.status === "Completed"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {order.status}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item.qty} x Rp{item.selling.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT BUTTON */}
                      {/* RIGHT BUTTON GROUP */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (order.status === "Completed") {
                              localStorage.setItem(
                                "reviewItem",
                                JSON.stringify({
                                  ...item,
                                  orderId: order.id, // 🔥 INI KUNCI
                                }),
                              );
                              window.location.href = "/user/ReviewProducts";
                            }
                          }}
                          disabled={order.status !== "Completed"}
                          className={`text-xs px-4 py-2 rounded-lg transition ${
                            order.status !== "Completed"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : reviewData
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-red-800 text-white hover:bg-red-900"
                          }`}
                        >
                          {reviewData ? "Edit Ulasan" : "Tambah Ulasan"}
                        </button>
                        {order.status === "Pending" && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setShowCancelModal(true);
                            }}
                            className="text-xs px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 ml-2"
                          >
                            Cancel
                          </button>
                        )}

                        {showCancelModal && (
                          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-2xl w-[420px] text-black max-h-[80vh] overflow-y-auto">
                              <h2 className="text-lg font-semibold mb-3">
                                Batalkan Pesanan
                              </h2>

                              <p className="text-sm text-gray-500 mb-4">
                                Kenapa kamu ingin membatalkan pesanan ini?
                              </p>

                              {/* 🔥 CUSTOM RADIO LIST */}
                              <div className="space-y-2 mb-4">
                                {cancelOptions.map((option, i) => (
                                  <div
                                    key={i}
                                    onClick={() => setCancelReason(option)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                                      cancelReason === option
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200 hover:border-gray-400"
                                    }`}
                                  >
                                    {/* 🔴 CUSTOM RADIO */}
                                    <div
                                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        cancelReason === option
                                          ? "border-red-500"
                                          : "border-gray-400"
                                      }`}
                                    >
                                      {cancelReason === option && (
                                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                                      )}
                                    </div>

                                    <span className="text-sm">{option}</span>
                                  </div>
                                ))}
                              </div>

                              {/* 🔥 INPUT JIKA LAINNYA */}
                              {cancelReason === "Lainnya" && (
                                <textarea
                                  value={customReason}
                                  onChange={(e) =>
                                    setCustomReason(e.target.value)
                                  }
                                  className="w-full border rounded-lg p-2 mb-4 transition-all duration-300"
                                  placeholder="Tulis alasan kamu..."
                                />
                              )}

                              {/* BUTTON */}
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setShowCancelModal(false)}
                                  className="px-4 py-2 bg-gray-300 rounded-lg"
                                >
                                  Batal
                                </button>

                                <button
                                  onClick={handleCancelOrder}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  Ya, Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TOTAL */}
              <div className="text-right mt-4 font-semibold">
                Total: Rp{calculateTotal(order.items).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
