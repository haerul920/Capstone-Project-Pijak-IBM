"use client";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Pencil, Trash2, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { Cpu, Monitor, Battery, Wifi } from "lucide-react";
import { addNotification } from "../../utils/notification";

export default function Inventory() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [featureSuccess, setFeatureSuccess] = useState(false);
  const [specSuccess, setSpecSuccess] = useState(false);

  const iconMap = {
    cpu: Cpu,
    display: Monitor,
    battery: Battery,
    wifi: Wifi,
  };

  const emptyForm = {
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    color: "",
    purchase: "",
    selling: "",
    stock: "",
    image: "",
    description: "",

    // 🔥 NEW (OPTIONAL)
    overview: "",
    features: [], // untuk mosaic
    specifications: [], // untuk accordion
  };

  const [featureInput, setFeatureInput] = useState({
    title: "",
    desc: "",
    icon: "",
  });
  const [form, setForm] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(null);

  const [specInput, setSpecInput] = useState({
    group: "",
    label: "",
    value: "",
  });

  // ✅ TAMBAHAN (TIDAK MENGHAPUS YANG LAMA)
  const [variants, setVariants] = useState([]);
  const [variantInput, setVariantInput] = useState({
    color: "",
    storage: "",
    stock: "",
    purchase: "",
    selling: "",
  });

  const [brands, setBrands] = useState({
  electronics: {
    mobile: ["Xiaomi", "Samsung", "Poco", "iPhone"],
    laptop: ["Asus", "Acer", "Lenovo"],
  },
  skincare: {
    serum: ["Somethinc", "Skintific"],
  },
});
const [newBrand, setNewBrand] = useState("");

const handleAddBrand = () => {
  if (!newBrand || !form.category) return;

  const cat = form.category.toLowerCase();
  const sub = form.subcategory?.toLowerCase();

  const updated = { ...brands };

  if (!updated[cat]) updated[cat] = {};
  if (!updated[cat][sub]) updated[cat][sub] = [];

  updated[cat][sub] = [
    ...new Set([...updated[cat][sub], newBrand]),
  ];

  setBrands(updated);

  // 🔥 SIMPAN
  localStorage.setItem("brands", JSON.stringify(updated));

  setForm({ ...form, brand: newBrand });
  setNewBrand("");
};

useEffect(() => {
  const savedBrands = JSON.parse(localStorage.getItem("brands"));
  if (savedBrands) setBrands(savedBrands);
}, []);

  const [categories, setCategories] = useState([
    "Electronics",
    "Furniture",
    "Camera",
    "Skincare",
    "Audio",
    "Sports",
    "Books",
  ]);
  const [subcategories, setSubcategories] = useState({
    electronics: [
      "mobile",
      "refrigerator",
      "laptop",
      "tv",
      "smarthome",
      "smartwearables",
    ],
    furniture: ["chairs", "tables", "sofas"],
    camera: ["dslr", "mirrorless", "actioncameras"],
    skincare: ["sunscreen", "serum", "moisturizer", "toner", "masker"],
    audio: ["headphones", "speakers", "microphones"],
  });

  const [colors, setColors] = useState([
    "-",
    "Red",
    "Blue",
    "Black",
    "White",
    "Pink",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Gray",
    "Brown",
    "Silver",
    "Gold",
    "Beige",
    "Cyan",
    "Magenta",
    "Lime",
    "Maroon",
    "Navy",
    "Olive",
    "Teal",
    "Turquoise",
    "Violet",
  ]);

  const [storageOptions, setStorageOptions] = useState([
    "-",
    "2GB + 32GB",
    "3GB + 64GB",
    "4GB + 64GB",
    "6GB + 128GB",
    "8GB + 128GB",
    "8GB + 256GB",
    "12GB + 256GB",
    "12GB + 512GB",
    "16GB + 512GB",
    "16GB + 1TB",
  ]);

  const openAddModal = () => {
    setForm(emptyForm);
    setVariants([]); // 🔥 reset variant
    setEditIndex(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Maksimal ukuran gambar 3MB!");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 300; // 🔥 kecilin lebih agresif
      const scale = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressed = canvas.toDataURL("image/png", 0.7);

      // 🔥 cek size base64
      const base64Length = compressed.length - "data:image/png;base64,".length;
      const sizeInBytes = (base64Length * 3) / 4;

      if (sizeInBytes > 3 * 1024 * 1024) {
        alert("Gambar masih terlalu besar setelah kompres!");
        return;
      }

      setForm({ ...form, image: compressed });
    };

    reader.readAsDataURL(file);
  };
  

  const handleSubmit = () => {
    if (!form.name || !form.category) {
      alert("Lengkapi data dulu!");
      return;
    }

    // 🔥 DETEKSI: pakai variant atau tidak
    const isVariant = variants.length > 0;

    // =========================
    // ✅ VALIDASI NON-VARIANT
    // =========================
    if (!isVariant) {
      if (Number(form.stock) <= 0) {
        alert("Isi stock!");
        return;
      }
    }

    // =========================
    // ✅ VALIDASI VARIANT
    // =========================
    if (isVariant) {
      const invalidVariant = variants.some(
        (v) =>
          !v.color ||
          !v.storage ||
          Number(v.stock) <= 0 ||
          Number(v.purchase) <= 0 ||
          Number(v.selling) <= 0,
      );

      if (invalidVariant) {
        alert("Isi semua data variant dengan benar!");
        return;
      }
    }

    // =========================
    // 🔥 HITUNG STOCK
    // =========================
    const totalStock = isVariant
      ? variants.reduce((sum, v) => sum + v.stock, 0)
      : Number(form.stock);

    // =========================
    // 🔥 HITUNG HARGA
    // =========================
    const purchase = isVariant
      ? Math.min(...variants.map((v) => v.purchase))
      : Number(form.purchase) || 0;

    const selling = isVariant
      ? Math.min(...variants.map((v) => v.selling))
      : Number(form.selling) || 0;
    // =========================
    // ✅ FINAL OBJECT
    // =========================
    const newItem = {
      ...form,
      purchase,
      selling,
      variants: isVariant ? variants : [],
      stock: totalStock,
      createdAt:
        editIndex !== null
          ? data[editIndex].createdAt // 🔥 ambil lama
          : new Date().toISOString(),
    };

    // =========================
    // ✅ SAVE DATA
    // =========================
    const updated =
      editIndex !== null
        ? data.map((item, i) => (i === editIndex ? newItem : item))
        : [...data, newItem];

    setData(updated);
    localStorage.setItem("productsMaster", JSON.stringify(updated));
    window.dispatchEvent(new Event("productsUpdated"));

    // =========================
    // 🔄 RESET
    // =========================
    setForm(emptyForm);
    setVariants([]);
    setEditIndex(null);
    setShowModal(false);

    console.log("NEW ITEM:", newItem);
  };

  const handleDelete = (index) => {
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
    localStorage.setItem("productsMaster", JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    setForm(data[index]);
    setVariants(data[index].variants || []); // 🔥 load variant
    setEditIndex(index);
    setShowModal(true);
  };

  const formatRupiah = (num) =>
    "Rp" + new Intl.NumberFormat("id-ID").format(num);

  const [newCategory, setNewCategory] = useState("");
  const [newColor, setNewColor] = useState("");

const handleAddCategory = () => {
  if (!newCategory) return;

  let updatedCategories = categories;

  if (!categories.includes(newCategory)) {
    updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
  }

  // 🔥 SIMPAN KE LOCALSTORAGE
  localStorage.setItem("categories", JSON.stringify(updatedCategories));

  setForm({ ...form, category: newCategory });
  setNewCategory("");

  addNotification(
  `Produk ditambahkan: ${form.name}`,
  "product"
);
};

useEffect(() => {
  const savedCategories = JSON.parse(localStorage.getItem("categories"));

  if (savedCategories) {
    setCategories(savedCategories);
  }
}, []);
  const [newSubcategory, setNewSubcategory] = useState("");
  const handleAddSubcategory = () => {
  if (!newSubcategory || !form.category) return;

  const key = form.category.toLowerCase();

  const updated = {
    ...subcategories,
    [key]: subcategories[key]
      ? [...new Set([...subcategories[key], newSubcategory.toLowerCase()])]
      : [newSubcategory.toLowerCase()],
  };

  setSubcategories(updated);

  // 🔥 SIMPAN KE LOCALSTORAGE
  localStorage.setItem("subcategories", JSON.stringify(updated));

  setForm({ ...form, subcategory: newSubcategory.toLowerCase() });
  setNewSubcategory("");
};

  const handleAddColor = () => {
    if (!newColor) return;

    if (!colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }

    setForm({ ...form, color: newColor });
    setNewColor("");
  };

  useEffect(() => {
  const savedCategories = JSON.parse(localStorage.getItem("categories"));
  const savedSub = JSON.parse(localStorage.getItem("subcategories"));

  if (savedCategories) setCategories(savedCategories);
  if (savedSub) setSubcategories(savedSub);
}, []);

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem("productsMaster")) || [];
      setData(stored);
    };

    load();

    window.addEventListener("productsUpdated", load);

    return () => {
      window.removeEventListener("productsUpdated", load);
    };
  }, []);

  const [useVariant, setUseVariant] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 pt-24 pb-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Product Management</h1>
            <p className="text-gray-400 text-sm">Manage your product catalog</p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-red-500 px-6 py-3 rounded-xl hover:bg-red-600"
          >
            + Add Product
          </button>
        </div>

        {/* EMPTY STATE */}
        {data.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            Belum ada produk. Klik + Add Product untuk menambahkan.
          </div>
        )}

        {/* PRODUCT LIST */}
        <div className="space-y-4">
          {data.map((item, index) => {
            const isVariant = item.variants && item.variants.length > 0;

            const prices = isVariant
              ? item.variants.map((v) => v.selling)
              : [item.selling];

            const buyPrices = isVariant
              ? item.variants.map((v) => v.purchase)
              : [item.purchase];

            console.log("VARIANTS:", variants);
            const min = prices.length ? Math.min(...prices) : item.selling || 0;

            const max = prices.length ? Math.max(...prices) : item.selling || 0;

            const minBuy = buyPrices.length
              ? Math.min(...buyPrices)
              : item.purchase || 0;

            const maxBuy = buyPrices.length
              ? Math.max(...buyPrices)
              : item.purchase || 0;
            return (
              <div
                key={index}
                className="flex justify-between items-center bg-[#111] p-5 rounded-2xl"
              >
                <div className="flex gap-5 items-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-500">
                      IMG
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {item.category} • {item.subcategory || "No Sub"} • ...
                      {isVariant
                        ? item.variants
                            .map((v) => `${v.color} ${v.storage}`)
                            .join(", ")
                        : "No Variant"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Buy:{" "}
                      {minBuy === maxBuy
                        ? formatRupiah(minBuy)
                        : `${formatRupiah(minBuy)} - ${formatRupiah(maxBuy)}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="text-xl font-bold">
                    {min === max
                      ? formatRupiah(min)
                      : `${formatRupiah(min)} - ${formatRupiah(max)}`}
                  </h3>
                  <p className="text-gray-400 text-sm">Stock: {item.stock}</p>

                  <div className="flex justify-end gap-3 mt-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="flex items-center gap-2 bg-[#222] px-4 py-2 rounded-lg hover:bg-yellow-500"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(index)}
                      className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1a1a1a] w-[900px] max-w-[95vw] max-h-[92vh] overflow-y-auto p-8 rounded-3xl relative shadow-2xl">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Package size={25} className="text-red-500" />
              </div>

              <h2 className="text-xl font-semibold">
                {editIndex !== null ? "Edit Product" : "Add New Product"}
              </h2>
            </div>

            <div className="grid gap-5">
              <Input
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <div>
                <Select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={categories}
                />

                {/* ➕ ADD CATEGORY */}
                <div className="flex gap-2 mt-2">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Tambah kategori baru"
                    className="flex-1 bg-[#111] border px-3 py-2 rounded-lg"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-green-500 px-3 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <Select
                  label="Sub Category"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  options={subcategories[form.category?.toLowerCase()] || []}
                />

                <div className="flex gap-2 mt-2">
                  <input
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Tambah subcategory baru"
                    className="flex-1 bg-[#111] border px-3 py-2 rounded-lg"
                  />
                  <button
                    onClick={handleAddSubcategory}
                    className="bg-purple-500 px-3 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
  <Select
    label="Brand"
    name="brand"
    value={form.brand}
    onChange={handleChange}
    options={
      brands[form.category?.toLowerCase()]?.[
        form.subcategory?.toLowerCase()
      ] || []
    }
  />

  {/* ➕ ADD BRAND */}
  <div className="flex gap-2 mt-2">
    <input
      value={newBrand}
      onChange={(e) => setNewBrand(e.target.value)}
      placeholder="Tambah brand baru"
      className="flex-1 bg-[#111] border px-3 py-2 rounded-lg"
    />
    <button
      onClick={handleAddBrand}
      className="bg-yellow-500 px-3 rounded-lg"
    >
      +
    </button>
  </div>
</div>


              <div>
                {/* ➕ ADD COLOR */}
                <div className="flex gap-2 mt-2">
                  <input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Tambah warna baru"
                    className="flex-1 bg-[#111] border px-3 py-2 rounded-lg"
                  />
                  <button
                    onClick={handleAddColor}
                    className="bg-blue-500 px-3 rounded-lg"
                  >
                    +
                  </button>
                </div>
{/* ✅ VARIANT COLOR + STOCK */}
                  <div className="mt-3">
                    <label className="block mb-2 text-sm">
                      Color Variants (with stock)
                    </label>

    {/* 🔥 GRID FULL WIDTH */}
    <div className="grid grid-cols-12 gap-2 mb-2">
      {/* COLOR */}
      <select
        value={variantInput.color}
        onChange={(e) =>
          setVariantInput({
            ...variantInput,
            color: e.target.value,
          })
        }
        className="col-span-2 bg-[#111] border px-3 py-2 rounded-lg"
      >
        <option value="">Color</option>
        {colors.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      {/* STORAGE */}
      <select
        value={variantInput.storage}
        onChange={(e) =>
          setVariantInput({
            ...variantInput,
            storage: e.target.value,
          })
        }
        className="col-span-2 bg-[#111] border px-3 py-2 rounded-lg"
      >
        <option value="">Storage</option>
        {storageOptions.map((s, i) => (
          <option key={i}>{s}</option>
        ))}
      </select>

      {/* STOCK */}
      <input
        type="number"
        placeholder="Stock"
        value={variantInput.stock}
        onChange={(e) =>
          setVariantInput({
            ...variantInput,
            stock: e.target.value,
          })
        }
        className="col-span-2 bg-[#111] border px-3 py-2 rounded-lg"
      />

      {/* PURCHASE */}
      <input
        type="number"
        placeholder="Buy"
        value={variantInput.purchase}
        onChange={(e) =>
          setVariantInput({
            ...variantInput,
            purchase: e.target.value,
          })
        }
        className="col-span-2 bg-[#111] border px-3 py-2 rounded-lg"
      />

      {/* SELLING */}
      <input
        type="number"
        placeholder="Sell"
        value={variantInput.selling}
        onChange={(e) =>
          setVariantInput({
            ...variantInput,
            selling: e.target.value,
          })
        }
        className="col-span-3 bg-[#111] border px-3 py-2 rounded-lg"
      />

      {/* ADD BUTTON */}
      <button
        onClick={() => {
          if (
            variantInput.color ||
            variantInput.storage ||
            variantInput.stock ||
            variantInput.purchase ||
            variantInput.selling
          ) {
            if (
              !variantInput.color ||
              Number(variantInput.stock) <= 0 ||
              Number(variantInput.purchase) <= 0 ||
              Number(variantInput.selling) <= 0
            ) {
              alert("Isi data variant dengan benar!");
              return;
            }
          }

          const exists = variants.some(
            (v) =>
              v.color === variantInput.color &&
              v.storage === variantInput.storage
          );

          if (exists) {
            alert("Variant sudah ada!");
            return;
          }

          setVariants([
            ...variants,
            {
              color: variantInput.color,
              storage: variantInput.storage,
              stock: Number(variantInput.stock),
              purchase: Number(variantInput.purchase),
              selling: Number(variantInput.selling),
            },
          ]);

          setVariantInput({
            color: "",
            storage: "",
            stock: "",
            purchase: "",
            selling: "",
          });
        }}
        className="col-span-1 bg-green-500 rounded-lg"
      >
        +
      </button>
    </div>

    {/* LIST VARIANT */}
    <div className="space-y-1 text-sm">
      {variants.map((v, i) => (
        <div key={i} className="bg-[#111] p-2 rounded">
          <div className="flex justify-between w-full text-xs">
            <span>
              {v.color} • {v.storage}
            </span>
            <span className="text-gray-400">{v.stock} pcs</span>
            <span className="text-green-400">
              {formatRupiah(v.purchase)}
            </span>
            <span className="text-red-400">
              {formatRupiah(v.selling)}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

                
              </div>

              {/* IMAGE */}
              <div>
                <label className="block mb-2 text-sm">Product Image</label>
                <input
                  type="file"
                  onChange={handleImage}
                  className="w-full bg-[#111] border px-4 py-3 rounded-xl"
                />
              </div>



              <div>
                <label className="block mb-2 text-sm">Description</label>
                <textarea
                  name="overview"
                  value={form.overview}
                  onChange={handleChange}
                  className="w-full bg-[#111] border px-4 py-3 rounded-xl"
                  placeholder="Deskripsi besar untuk halaman produk..."
                />
              </div>
             <div>
  <label className="block mb-2 text-sm">
    Features (Optional)
  </label>

  {/* 🔥 GRID */}
  <div className="grid grid-cols-12 gap-2 mb-2">
    <input
      placeholder="Title"
      className="col-span-3 bg-[#111] border px-3 py-2 rounded"
      onChange={(e) =>
        setFeatureInput({
          ...featureInput,
          title: e.target.value,
        })
      }
    />

    <input
      placeholder="Description"
      className="col-span-6 bg-[#111] border px-3 py-2 rounded"
      onChange={(e) =>
        setFeatureInput({
          ...featureInput,
          desc: e.target.value,
        })
      }
    />

    <select
      className="col-span-2 bg-[#111] border px-3 py-2 rounded"
      onChange={(e) =>
        setFeatureInput({
          ...featureInput,
          icon: e.target.value,
        })
      }
    >
      <option value="">Icon</option>
      <option value="cpu">CPU</option>
      <option value="display">Display</option>
      <option value="battery">Battery</option>
      <option value="wifi">Wifi</option>
    </select>

    <button
      onClick={() => {
        if (!featureInput.title) return;

        setForm({
          ...form,
          features: [...(form.features || []), featureInput],
        });

        setFeatureInput({ title: "", desc: "", icon: "" });
      }}
      className="col-span-1 bg-green-500 rounded"
    >
      +
    </button>
  </div>

  {/* LIST */}
  <div className="space-y-1 text-sm">
    {form.features?.map((f, i) => (
      <div
        key={i}
        className="flex justify-between items-center bg-[#111] p-2 rounded"
      >
        <span>
          {f.title} ({f.icon || "no-icon"})
        </span>

        <button
          onClick={() => {
            const updated = form.features.filter((_, idx) => idx !== i);
            setForm({ ...form, features: updated });
          }}
          className="text-red-400 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ))}
  </div>
</div>
<div>
  <label className="block mb-2 text-sm">
    Specifications (Optional)
  </label>

  {/* 🔥 GRID */}
  <div className="grid grid-cols-12 gap-2">
    <input
      placeholder="Group (Processor)"
      className="col-span-3 bg-[#111] border px-3 py-2 rounded"
      onChange={(e) =>
        setSpecInput({ ...specInput, group: e.target.value })
      }
    />

    <input
      placeholder="Label (CPU)"
      className="col-span-4 bg-[#111] border px-3 py-2 rounded"
      onChange={(e) =>
        setSpecInput({ ...specInput, label: e.target.value })
      }
    />

    <input
      placeholder="Value"
      className="col-span-4 bg-[#111] border px-3 py-2 rounded"
      onChange={(e) =>
        setSpecInput({ ...specInput, value: e.target.value })
      }
    />

    <button
      onClick={() => {
        if (!specInput.group || !specInput.label) {
          alert("Group & Label wajib diisi!");
          return;
        }

        setForm({
          ...form,
          specifications: [
            ...(form.specifications || []),
            specInput,
          ],
        });

        setSpecInput({ group: "", label: "", value: "" });

        setSpecSuccess(true);
        setTimeout(() => setSpecSuccess(false), 1500);
      }}
      className="col-span-1 bg-blue-500 rounded"
    >
      +
    </button>
  </div>

  {specSuccess && (
    <p className="text-green-400 text-xs mt-1">
      ✔ Specification berhasil ditambahkan
    </p>
  )}

  {/* LIST */}
  <div className="space-y-1 text-sm mt-2">
    {form.specifications?.map((s, i) => (
      <div
        key={i}
        className="flex justify-between bg-[#111] p-2 rounded"
      >
        <span>
          {s.group} - {s.label}: {s.value}
        </span>

        <button
          onClick={() => {
            const updated = form.specifications.filter(
              (_, idx) => idx !== i
            );
            setForm({ ...form, specifications: updated });
          }}
          className="text-red-400 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ))}
  </div>
</div>

<div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-[#222] px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-red-500 px-6 py-2 rounded-xl"
                >
                  {editIndex !== null ? "Update" : "Add Product"}
                </button>
              </div>
</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm">{label}</label>
      <input
        {...props}
        className="w-full bg-[#111] border px-4 py-3 rounded-xl"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-2 text-sm">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#111] border px-4 py-3 rounded-xl"
      >
        <option value="">Select</option>
        {options.map((o, i) => (
          <option key={i}>{o}</option>
        ))}
      </select>
    </div>
  );
}
