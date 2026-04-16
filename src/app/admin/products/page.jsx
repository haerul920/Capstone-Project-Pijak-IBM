"use client";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState, useEffect } from "react";

export default function Products() {
  const [category, setCategory] = useState("All");
  const [sortKey, setSortKey] = useState(null);
  const [asc, setAsc] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const sales = JSON.parse(localStorage.getItem("salesData")) || [];
      const productsMaster =
        JSON.parse(localStorage.getItem("productsMaster")) || [];

      const map = {};

      productsMaster.forEach((p) => {
        map[p.name] = {
          name: p.name,
          category: p.category,
          price: p.variants?.length
            ? p.variants.reduce((sum, v) => sum + v.selling, 0) /
              p.variants.length
            : 0,
          stock: p.stock,
          sold: 0,
          revenue: 0,
          trend: "up",
        };
      });

      sales.forEach((s) => {
        if (map[s.name]) {
          map[s.name].sold += Number(s.qty);
          map[s.name].revenue += Number(s.qty) * Number(s.price);
        }
      });

      setProducts(Object.values(map));
    };

    // 🔥 LOAD AWAL
    loadData();

    // 🔥 LISTENER (INI KUNCINYA)
    window.addEventListener("productsUpdated", loadData);
    window.addEventListener("salesUpdated", loadData);
    window.addEventListener("ordersUpdated", loadData);

    return () => {
      window.removeEventListener("productsUpdated", loadData);
      window.removeEventListener("salesUpdated", loadData);
      window.removeEventListener("ordersUpdated", loadData);
    };
  }, []);

  // 🔥 FILTER
  let filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  // 🔥 SORT
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      if (typeof a[sortKey] === "string") {
        return asc
          ? a[sortKey].localeCompare(b[sortKey])
          : b[sortKey].localeCompare(a[sortKey]);
      } else {
        return asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
      }
    });
  }

  // 🔥 HANDLE SORT
  const handleSort = (key) => {
    if (sortKey === key) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const formatRupiah = (num) => {
    return "Rp" + new Intl.NumberFormat("id-ID").format(num);
  };

  // 🔥 CARD DATA (DINAMIS)
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

  const topProduct = [...products].sort((a, b) => b.revenue - a.revenue)[0];

  const topSold = [...products].sort((a, b) => b.sold - a.sold)[0];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 pt-24 pb-6">
        {/* TITLE */}
        <h1 className="text-3xl font-semibold mb-1">Products</h1>
        <p className="text-gray-400 mb-6">
          Manage and analyze product performance
        </p>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card title="Total Revenue" value={formatRupiah(totalRevenue)} />

          <Card
            title="Top Product"
            value={topProduct?.name || "-"}
            sub={formatRupiah(topProduct?.revenue || 0)}
          />
        </div>

        {/* FILTER */}
        <div className="mb-4">
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-xl"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Audio">Audio</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-[#2a2a2a]">
              <tr>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Product Name ↑↓
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Category ↑↓
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price ↑↓
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("sold")}
                >
                  Total Sold ↑↓
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("revenue")}
                >
                  Revenue ↑↓
                </th>
                <th>Trend</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={i}
                  className={`border-b text-center border-[#2a2a2a] ${
                    i === 0 ? "bg-[#2a1a1a]" : ""
                  }`}
                >
                  <td className="p-4 flex items-center gap-3">
                    {p.name === topSold?.name && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        #1
                      </span>
                    )}
                    {p.name}
                  </td>

                  <td className="text-gray-400">{p.category}</td>
                  <td>{formatRupiah(p.price)}</td>
                  <td>{p.sold.toLocaleString()}</td>
                  <td>{formatRupiah(p.revenue)}</td>

                  <td>
                    {p.trend === "up" ? (
                      <span className="text-green-400">↗ Up</span>
                    ) : (
                      <span className="text-red-400">↘ Down</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// CARD COMPONENT
function Card({ title, value, sub }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
      <p className="text-gray-400 mb-1">{title}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>

      {sub && <p className="text-red-400 mt-1">{sub}</p>}
    </div>
  );
}
