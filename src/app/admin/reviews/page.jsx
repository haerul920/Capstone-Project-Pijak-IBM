"use client";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reviews")) || [];
    const prod = JSON.parse(localStorage.getItem("productsMaster")) || [];
    setReviews(stored);
    setProducts(prod);
  }, []);

  const filtered = selectedProduct === "All"
    ? reviews
    : reviews.filter((r) => r.product === selectedProduct);

  const handleDelete = (id) => {
    if (confirm("Hapus review ini?")) {
      const updated = reviews.filter((r) => r.id !== id);
      setReviews(updated);
      localStorage.setItem("reviews", JSON.stringify(updated));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 py-4 mt-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Product Reviews</h1>
            <p className="text-gray-400">Manage customer feedback</p>
          </div>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-xl"
          >
            <option value="All">All Products</option>
            {products.map((p, i) => (
              <option key={i} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Review</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-b border-[#2a2a2a]">
                    <td className="py-3 px-4">{r.product}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {[...Array(r.rating)].map((_, k) => (
                          <Star
  key={k}
  size={16}
  className="text-yellow-400 fill-yellow-400"
/>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">{r.comment}</td>
                    <td className="py-3 px-4">{r.date}</td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}