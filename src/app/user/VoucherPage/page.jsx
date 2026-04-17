"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function VoucherPage() {
  const [user, setUser] = useState(null);
  const [isUsed, setIsUsed] = useState(false); // 🔥 status voucher

  
    const router = useRouter();


  // 🔥 LOAD USER + STATUS VOUCHER
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);

    const usedVoucher = localStorage.getItem("voucher");
    setIsUsed(usedVoucher === "NEW35");
  }, []);

  // 🔥 HANDLE TOGGLE
  const handleVoucher = () => {
    if (isUsed) {
      // ❌ CANCEL VOUCHER
      localStorage.removeItem("voucher");
      setIsUsed(false);
    } else {
      // ✅ PAKAI VOUCHER
      localStorage.setItem("voucher", "NEW35");
      setIsUsed(true);
      router.push("/user/CartPage"); // optional langsung balik
    }
  };

  if (!user) {
    return <div className="p-10">Harus login dulu</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Voucher Saya</h1>

      {/* 🔥 USER BARU */}
      {user.isNew ? (
        <div className="bg-orange-100 p-5 rounded-xl">
          <h2 className="font-semibold text-lg mb-2">
            🎉 Diskon 35% untuk pengguna baru!
          </h2>
          <p className="text-gray-600 mb-4">
            Gunakan voucher ini saat checkout
          </p>

          <button
            onClick={handleVoucher}
            className={`px-4 py-2 rounded-lg text-white ${
              isUsed ? "bg-red-500" : "bg-orange-500"
            }`}
          >
            {isUsed ? "Batalkan" : "Pakai"}
          </button>
        </div>
      ) : (
        <div className="text-gray-500">Tidak ada voucher 😢</div>
      )}
    </div>
  );
}
