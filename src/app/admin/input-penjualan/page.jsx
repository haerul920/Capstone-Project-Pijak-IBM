"use client";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function InputData() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    variant: "", // 🔥 TAMBAHAN
    qty: "",
    date: "",
    time: "",
  });

  // 🔥 LOAD DATA
  useEffect(() => {
    const load = () => {
      const storedSales = JSON.parse(localStorage.getItem("salesData")) || [];
      const storedProducts =
        JSON.parse(localStorage.getItem("productsMaster")) || [];

      setData(storedSales);
      setProducts(storedProducts);
    };

    load();

    window.addEventListener("salesUpdated", load);

    return () => {
      window.removeEventListener("salesUpdated", load);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.qty || !form.date) {
      alert("Lengkapi data!");
      return;
    }

    const selectedProduct = products.find((p) => p.name === form.name);
    const selectedVariant = selectedProduct?.variants?.find(
      (v) => `${v.color} - ${v.storage}` === form.variant,
    );

    const newItem = {
      name: form.name,
      variant: form.variant,
      qty: Number(form.qty),
      price: selectedVariant?.selling || 0,
      date: form.time ? `${form.date}T${form.time}` : form.date,
      category: selectedProduct?.category || "Other",
    };

    let updated = [...data];

    if (editIndex !== null) {
      // 🔥 BALIKIN STOCK LAMA DULU
      const old = data[editIndex];

      let updatedProducts = [...products];

      updatedProducts = updatedProducts.map((p) => {
        if (p.name === old.name) {
          return {
            ...p,
            variants: p.variants.map((v) => {
              if (`${v.color} - ${v.storage}` === old.variant) {
                return {
                  ...v,
                  stock: v.stock + Number(old.qty),
                };
              }
              return v;
            }),
          };
        }
        return p;
      });

      // 🔥 KURANGIN STOCK BARU
      updatedProducts = updatedProducts.map((p) => {
        if (p.name === newItem.name) {
          return {
            ...p,
            variants: p.variants.map((v) => {
              if (`${v.color} - ${v.storage}` === newItem.variant) {
                return {
                  ...v,
                  stock: v.stock - Number(newItem.qty),
                };
              }
              return v;
            }),
          };
        }
        return p;
      });

      // 🔥 HITUNG ULANG
      updatedProducts = updatedProducts.map((p) => ({
        ...p,
        stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
      }));

      localStorage.setItem("productsMaster", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);

      updated[editIndex] = newItem;
    } else {
      updated.push(newItem);
    }

    setData(updated);
    localStorage.setItem("salesData", JSON.stringify(updated));

    window.dispatchEvent(new Event("salesUpdated"));
    window.dispatchEvent(new Event("productsUpdated"));

    setForm({ name: "", variant: "", qty: "", date: "", time: "" });
    setEditIndex(null);
  };

  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    const item = data[index];

    // 🔥 SPLIT DATE + TIME
    let date = "";
    let time = "";

    if (item.date.includes("T")) {
      const parts = item.date.split("T");
      date = parts[0];
      time = parts[1]?.slice(0, 5);
    } else {
      date = item.date;
    }

    setForm({
      name: item.name,
      variant: item.variant || "",
      qty: item.qty,
      date,
      time,
    });

    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const item = data[index];

    let updatedProducts = [...products];

    updatedProducts = updatedProducts.map((p) => {
      if (p.name === item.name) {
        return {
          ...p,
          variants: p.variants.map((v) => {
            if (`${v.color} - ${v.storage}` === item.variant) {
              return {
                ...v,
                stock: v.stock + Number(item.qty),
              };
            }
            return v;
          }),
        };
      }
      return p;
    });

    // 🔥 HITUNG ULANG TOTAL STOCK
    updatedProducts = updatedProducts.map((p) => ({
      ...p,
      stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    }));

    const updated = data.filter((_, i) => i !== index);

    setData(updated);
    setProducts(updatedProducts);

    localStorage.setItem("salesData", JSON.stringify(updated));
    localStorage.setItem("productsMaster", JSON.stringify(updatedProducts));

    window.dispatchEvent(new Event("salesUpdated"));
    window.dispatchEvent(new Event("productsUpdated"));
  };

  const formatRupiah = (num) =>
    "Rp" + new Intl.NumberFormat("id-ID").format(num);

  const selectedProduct = products.find((p) => p.name === form.name);

  const selectedVariant = selectedProduct?.variants?.find(
    (v) => `${v.color} - ${v.storage}` === form.variant,
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 pt-24 pb-6">
        <h1 className="text-3xl font-semibold mb-2">Input Penjualan</h1>
        <p className="text-gray-400 mb-6">Input data penjualan produk</p>

        {/* FORM */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Add Sales Data</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Product"
              name="name"
              value={form.name}
              onChange={handleChange}
              options={products.map((p) => p.name)}
            />
            {form.name && (
              <Select
                label="Variant"
                name="variant"
                value={form.variant}
                onChange={handleChange}
                options={
                  products
                    .find((p) => p.name === form.name)
                    ?.variants?.map((v) => `${v.color} - ${v.storage}`) || []
                }
              />
            )}

            {form.variant && (
              <div className="bg-[#111] p-4 rounded-xl">
                <p>Price: {formatRupiah(selectedVariant?.selling || 0)}</p>
                <p>Stock: {selectedVariant?.stock || 0}</p>
              </div>
            )}

            <Input
              label="Quantity Sold"
              name="qty"
              value={form.qty}
              onChange={handleChange}
              type="number"
            />

            <Input
              label="Date"
              name="date"
              value={form.date}
              onChange={handleChange}
              type="date"
            />

            {/* 🔥 TIME INPUT */}
            <Input
              label="Time"
              name="time"
              value={form.time}
              onChange={handleChange}
              type="time"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl"
          >
            {editIndex !== null ? "Update Data" : "+ Add Entry"}
          </button>
        </div>

        {/* TABLE */}
        <div className="mt-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Sales History</h2>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-[#2a2a2a]">
              <tr>
                <th className="py-3 text-left">Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#2a2a2a] hover:bg-[#222]"
                >
                  <td className="py-4 font-medium">{item.name}</td>
                  <td>{formatRupiah(item.price)}</td>
                  <td>{item.qty}</td>
                  <td className="text-gray-400">
                    {new Date(item.date).toLocaleString("id-ID")}
                  </td>

                  <td className="text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(index)}>
                        <Pencil size={16} className="text-yellow-400" />
                      </button>

                      <button onClick={() => handleDelete(index)}>
                        <Trash2 size={16} className="text-red-400" />
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
// INPUT
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-300">{label}</label>
      <input
        {...props}
        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3"
      />
    </div>
  );
}

// SELECT
function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-300">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3"
      >
        <option value="">Select {label}</option>

        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
