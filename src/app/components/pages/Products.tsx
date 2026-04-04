import { useState } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  totalSold: number;
  revenue: number;
  trend: "up" | "down";
}

export function Products() {
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Premium Laptop Pro",
      category: "Electronics",
      price: 1299.99,
      totalSold: 1234,
      revenue: 1604387,
      trend: "up",
    },
    {
      id: "2",
      name: "Wireless Mouse",
      category: "Accessories",
      price: 34.99,
      totalSold: 3456,
      revenue: 120914,
      trend: "up",
    },
    {
      id: "3",
      name: "Mechanical Keyboard",
      category: "Accessories",
      price: 149.99,
      totalSold: 2145,
      revenue: 321727,
      trend: "down",
    },
    {
      id: "4",
      name: "4K Monitor",
      category: "Electronics",
      price: 599.99,
      totalSold: 987,
      revenue: 592190,
      trend: "up",
    },
    {
      id: "5",
      name: "USB-C Hub",
      category: "Accessories",
      price: 79.99,
      totalSold: 1876,
      revenue: 150061,
      trend: "up",
    },
    {
      id: "6",
      name: "Wireless Headphones",
      category: "Audio",
      price: 249.99,
      totalSold: 1543,
      revenue: 385734,
      trend: "down",
    },
    {
      id: "7",
      name: "Webcam HD",
      category: "Electronics",
      price: 89.99,
      totalSold: 876,
      revenue: 78823,
      trend: "up",
    },
    {
      id: "8",
      name: "Laptop Stand",
      category: "Accessories",
      price: 45.99,
      totalSold: 654,
      revenue: 30077,
      trend: "down",
    },
  ]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  }>({ key: "revenue", direction: "desc" });

  const [filterCategory, setFilterCategory] = useState("all");

  const sortedAndFilteredProducts = [...products]
    .filter((product) => filterCategory === "all" || product.category === filterCategory)
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const handleSort = (key: keyof Product) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const topProduct = products.reduce((max, p) => (p.revenue > max.revenue ? p : max));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Products</h1>
        <p className="text-gray-400">Manage and analyze product performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <p className="text-sm text-gray-400 mb-2">Total Products</p>
          <h3 className="text-3xl text-white">{products.length}</h3>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <p className="text-sm text-gray-400 mb-2">Total Revenue</p>
          <h3 className="text-3xl text-white">${totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <p className="text-sm text-gray-400 mb-2">Top Product</p>
          <h3 className="text-xl text-white">{topProduct.name}</h3>
          <p className="text-sm text-[#FF3B3B] mt-1">${topProduct.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filter by category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B3B]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0B0B0B]">
              <tr>
                <th className="text-left py-4 px-6">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Product Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 px-6">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Category
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 px-6">
                  <button
                    onClick={() => handleSort("price")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Price
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 px-6">
                  <button
                    onClick={() => handleSort("totalSold")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Total Sold
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 px-6">
                  <button
                    onClick={() => handleSort("revenue")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Revenue
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 px-6 text-sm text-gray-400">Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-t border-[#2A2A2A] hover:bg-[#0B0B0B] transition-colors ${
                    index === 0 ? "bg-[#FF3B3B]/5" : ""
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {index === 0 && (
                        <span className="px-2 py-1 bg-[#FF3B3B] text-white text-xs rounded">
                          #1
                        </span>
                      )}
                      <span className="text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{product.category}</td>
                  <td className="py-4 px-6 text-white">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-6 text-gray-400">{product.totalSold.toLocaleString()}</td>
                  <td className="py-4 px-6 text-white">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {product.trend === "up" ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Up</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[#FF3B3B]">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm">Down</span>
                      </div>
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
