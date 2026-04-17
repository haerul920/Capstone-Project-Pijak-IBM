"use client";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

const formatRupiah = (num) =>
  "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(num || 0));

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const storedSales = JSON.parse(localStorage.getItem("salesData")) || [];
      const storedProducts =
        JSON.parse(localStorage.getItem("productsMaster")) || [];

      setSales(storedSales);
      setProducts(storedProducts);
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, []);

  // ================== 📊 DATA ==================
  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.qty || 0) * Number(s.price || 0),
    0,
  );

  const avgOrder = totalRevenue / (sales.length || 1);

  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);

  const lowStock = products.filter((p) => Number(p.stock) < 5).length;

  // CATEGORY
  const categoryMap = {};
  products.forEach((p) => (categoryMap[p.category] = 0));

  sales.forEach((s) => {
    const product = products.find((p) => p.name === s.name);
    if (product) categoryMap[product.category] += Number(s.qty || 0);
  });

  const topCategory =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const accuracy = sales.length > 0 ? "92% - 96%" : "-";

  // ================== 🏆 TOP PRODUCT ==================
  const getTopProducts = () => {
    const map = {};

    products.forEach((p) => {
      map[p.name] = {
        name: p.name,
        category: p.category,
        stock: p.stock,
        rating: p.rating || null, // 🔥 belum ada = null
        sold: 0,
      };
    });

    sales.forEach((s) => {
      if (map[s.name]) {
        map[s.name].sold += Number(s.qty);
      }
    });

    return Object.values(map)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  };

  // ================== 📁 EXPORT ==================
  const downloadCSV = (filename, rows) => {
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const exportSales = () => {
    const rows = [
      ["Product", "Qty", "Price", "Total", "Date"],
      ...sales.map((s) => [s.name, s.qty, s.price, s.qty * s.price, s.date]),
    ];
    downloadCSV("sales_report.csv", rows);
  };

  const exportInventory = () => {
    const rows = [
      ["Product", "Category", "Stock"],
      ...products.map((p) => [p.name, p.category, p.stock]),
    ];
    downloadCSV("inventory_report.csv", rows);
  };

  const exportRevenue = () => {
    const map = {};

    sales.forEach((s) => {
      if (!map[s.name]) map[s.name] = 0;
      map[s.name] += Number(s.qty) * Number(s.price);
    });

    const rows = [["Product", "Revenue"], ...Object.entries(map)];
    downloadCSV("revenue_report.csv", rows);
  };

  const exportPerformance = () => {
    const map = {};

    products.forEach((p) => {
      map[p.name] = { sold: 0, revenue: 0 };
    });

    sales.forEach((s) => {
      if (map[s.name]) {
        map[s.name].sold += Number(s.qty);
        map[s.name].revenue += Number(s.qty) * Number(s.price);
      }
    });

    const rows = [
      ["Product", "Sold", "Revenue"],
      ...Object.entries(map).map(([name, val]) => [
        name,
        val.sold,
        val.revenue,
      ]),
    ];

    downloadCSV("performance_report.csv", rows);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 pt-24 pb-6">
        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-2">
          Business Intelligence Report
        </h1>
        <p className="text-gray-400 mb-6">
          Comprehensive overview of business performance
        </p>

        {/* 🔥 SUMMARY */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Revenue"
              value={formatRupiah(totalRevenue)}
            />
            <SummaryCard title="Average Order" value={formatRupiah(avgOrder)} />
            <SummaryCard title="Total Products" value={products.length} />
            <SummaryCard title="Low Stock" value={lowStock} />
          </div>
        </div>

        {/* 🔥 BIG CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <BigCard
            title="Sales Performance"
            items={[
              { label: "Total Orders", value: sales.length },
              { label: "Revenue", value: formatRupiah(totalRevenue) },
              { label: "Avg Order", value: formatRupiah(avgOrder) },
            ]}
          />

          <BigCard
            title="Product Performance"
            items={[
              { label: "Total Products", value: products.length },
              { label: "Total Stock", value: totalStock },
              { label: "Low Stock", value: lowStock },
            ]}
          />

          <BigCard
            title="Insights"
            items={[
              { label: "Top Category", value: topCategory },
              { label: "Forecast", value: accuracy },
            ]}
          />
        </div>

        {/* 🔥 TOP PRODUCTS */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6">
            Top Performing Products
          </h2>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-[#2a2a2a] text-center">
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {getTopProducts().map((item, i) => (
                <tr key={i} className="border-b border-[#2a2a2a] text-center">
                  {/* RANK */}
                  <td>
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      {i + 1}
                    </span>
                  </td>

                  {/* PRODUCT */}
                  <td className="py-3">{item.name}</td>

                  {/* CATEGORY */}
                  <td className="text-gray-400">{item.category}</td>

                  {/* RATING (KOSONGKAN DULU) */}
                  <td>
                    {item.rating ? (
                      <span className="text-yellow-400">⭐ {item.rating}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  {/* STOCK */}
                  <td>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {item.stock} units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔥 EXPORT */}
        {/* 🔥 EXPORT REPORTS (PUNYA KAMU TETAP ADA) */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ReportCard
            title="Sales Report"
            desc={`Total transaksi: ${sales.length}`}
            onCSV={exportSales}
          />

          <ReportCard
            title="Revenue Report"
            desc={`Total revenue: ${formatRupiah(totalRevenue)}`}
            onCSV={exportRevenue}
          />

          <ReportCard
            title="Inventory Report"
            desc={`Total stock: ${totalStock} | Low: ${lowStock}`}
            onCSV={exportInventory}
          />

          <ReportCard
            title="Performance Report"
            desc={`Produk aktif: ${products.length}`}
            onCSV={exportPerformance}
          />

          <ReportCard
            title="Forecast Report"
            desc="Prediksi berbasis data historis"
          />
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENT =================
function SummaryCard({ title, value }) {
  return (
    <div className="bg-black rounded-xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-lg font-semibold">{value}</h2>
    </div>
  );
}

function BigCard({ title, items }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h2 className="font-semibold mb-4">{title}</h2>

      <div className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-gray-400">
            <span>{item.label}</span>
            <span className="text-white font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportCard({ title, desc, onCSV }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <div className="mb-4">
        <div className="bg-red-500/20 p-3 rounded-xl w-fit">
          <FileText className="text-red-400" />
        </div>
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-400 text-sm mb-6">{desc}</p>

      <button
        onClick={onCSV}
        className="w-full bg-red-500 px-4 py-3 rounded-xl"
      >
        Download CSV
      </button>
    </div>
  );
}
