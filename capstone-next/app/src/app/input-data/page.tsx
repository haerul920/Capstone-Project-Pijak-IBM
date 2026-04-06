import { useState } from "react";
import { Plus, Edit2, Trash2, Upload } from "lucide-react";

interface SalesDataEntry {
  id: string;
  productName: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  date: string;
  supplier?: string;
  notes?: string;
}

export default function InputData() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    date: "",
    supplier: "",
    notes: "",
  });

  const [dataEntries, setDataEntries] = useState<SalesDataEntry[]>([
    {
      id: "1",
      productName: "Premium Laptop Pro",
      category: "Electronics",
      purchasePrice: 800,
      sellingPrice: 1200,
      quantity: 45,
      date: "2026-03-15",
      supplier: "Tech Supplies Inc",
      notes: "Popular item",
    },
    {
      id: "2",
      productName: "Wireless Mouse",
      category: "Accessories",
      purchasePrice: 15,
      sellingPrice: 35,
      quantity: 120,
      date: "2026-03-20",
      supplier: "Global Tech",
      notes: "",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: SalesDataEntry = {
      id: editingId || Date.now().toString(),
      productName: formData.productName,
      category: formData.category,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
      date: formData.date,
      supplier: formData.supplier,
      notes: formData.notes,
    };

    if (editingId) {
      setDataEntries((prev) =>
        prev.map((entry) => (entry.id === editingId ? newEntry : entry)),
      );
      setEditingId(null);
    } else {
      setDataEntries((prev) => [...prev, newEntry]);
    }

    setFormData({
      productName: "",
      category: "",
      purchasePrice: "",
      sellingPrice: "",
      quantity: "",
      date: "",
      supplier: "",
      notes: "",
    });
  };

  const handleEdit = (entry: SalesDataEntry) => {
    setFormData({
      productName: entry.productName,
      category: entry.category,
      purchasePrice: entry.purchasePrice.toString(),
      sellingPrice: entry.sellingPrice.toString(),
      quantity: entry.quantity.toString(),
      date: entry.date,
      supplier: entry.supplier || "",
      notes: entry.notes || "",
    });
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    setDataEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Input Data</h1>
        <p className="text-gray-400">Add and manage your sales data</p>
      </div>

      {/* Data Input Form */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Add Sales Data</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B0B0B] text-gray-400 rounded-lg hover:bg-[#2A2A2A] border border-[#2A2A2A] transition-colors">
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Product Name <span className="text-[#FF3B3B]">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B]"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Product Category <span className="text-[#FF3B3B]">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#FF3B3B]"
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Purchase Price <span className="text-[#FF3B3B]">*</span>
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B]"
                placeholder="0.00"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Selling Price <span className="text-[#FF3B3B]">*</span>
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B]"
                placeholder="0.00"
              />
            </div>

            {/* Quantity Sold */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Quantity Sold <span className="text-[#FF3B3B]">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B]"
                placeholder="0"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Date <span className="text-[#FF3B3B]">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#FF3B3B]"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B]"
                placeholder="Supplier name (optional)"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B] resize-none"
                placeholder="Additional notes (optional)"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-[#FF3B3B] text-white rounded-lg hover:bg-[#FF3B3B]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {editingId ? "Update Entry" : "Add Entry"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    productName: "",
                    category: "",
                    purchasePrice: "",
                    sellingPrice: "",
                    quantity: "",
                    date: "",
                    supplier: "",
                    notes: "",
                  });
                }}
                className="px-6 py-2 bg-[#0B0B0B] text-gray-400 rounded-lg hover:bg-[#2A2A2A] border border-[#2A2A2A] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <h2 className="text-white mb-4">Data Preview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left py-3 px-4 text-sm text-gray-400">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">
                  Purchase
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">
                  Selling
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dataEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-[#2A2A2A] hover:bg-[#0B0B0B] transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-white">
                    {entry.productName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {entry.category}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    ${entry.purchasePrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    ${entry.sellingPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {entry.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {entry.date}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-1 hover:bg-[#2A2A2A] rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 hover:bg-[#2A2A2A] rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-[#FF3B3B]" />
                      </button>
                    </div>
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
