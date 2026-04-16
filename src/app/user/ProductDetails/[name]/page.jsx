"use client";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Cpu, Monitor, Battery, Wifi } from "lucide-react";
import LandingHeader from "../../../components/HeaderLanding";

export default function ProductDetail() {
const params = useParams();
const name = params?.name;
const decodedName = name ? decodeURIComponent(name) : "";

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  //data dummy dulu ya
  const bgImages = [
    "https://picsum.photos/800/600?random=1",
    "https://picsum.photos/800/600?random=2",
    "https://picsum.photos/800/600?random=3",
    "https://picsum.photos/800/600?random=4",
  ];

  //sampai sini data dummy dulu ya, cuma utk penanda
  const iconMap = {
    cpu: Cpu,
    display: Monitor,
    battery: Battery,
    wifi: Wifi,
  };
  const [openSpec, setOpenSpec] = useState("processor");

  const groupedSpecs = {};

  (product?.specifications || []).forEach((item) => {
    if (!groupedSpecs[item.group]) {
      groupedSpecs[item.group] = [];
    }
    groupedSpecs[item.group].push({
      label: item.label,
      value: item.value,
    });
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];

    const filtered = allReviews.filter(
      (r) => r.product?.toLowerCase() === product?.name?.toLowerCase(),
    );

    setReviews(filtered);
  }, [product]);

  const specs = Object.keys(groupedSpecs).map((key) => ({
    key,
    title: key,
    content: groupedSpecs[key],
  }));

  const features = product?.features?.length
    ? product.features
    : [
        {
          title: "Advanced Processor",
          desc: "High performance",
          icon: "cpu",
        },
        {
          title: "Stunning Display",
          desc: "Crystal clear visuals",
          icon: "display",
        },
      ];

useEffect(() => {
  if (!name) return; // 🔥 INI WAJIB

  const data = JSON.parse(localStorage.getItem("productsMaster")) || [];

  const found = data.find(
    (p) => p.name?.toLowerCase() === decodedName.toLowerCase()
  );

  setProduct(found);

  if (found?.variants?.length) {
    setSelectedVariant(found.variants[0]);
  }
}, [name]);

  // 🔥 LOADING / NOT FOUND HANDLING
  if (!product) {
    return (
      <div className="bg-white min-h-screen">
        <LandingHeader />
        <div className="p-10 text-center text-gray-500">
          Product tidak ditemukan 😢
        </div>
      </div>
    );
  }

  // 🔥 UNIQUE COLOR & STORAGE (biar ga duplikat)
  const colors = [...new Set((product.variants || []).map((v) => v.color))];
  const storages = [
    ...new Set(
      (product.variants || [])
        .filter((v) => v.color === selectedVariant?.color)
        .map((v) => v.storage),
    ),
  ];

  const handleSelect = (type, value) => {
    if (!product?.variants) return;

    let newVariant = null;

    if (type === "color") {
      newVariant = product.variants.find(
        (v) => v.color === value && v.storage === selectedVariant?.storage,
      );

      // fallback kalau kombinasi gak ada
      if (!newVariant) {
        newVariant = product.variants.find((v) => v.color === value);
      }
    }

    if (type === "storage") {
      newVariant = product.variants.find(
        (v) => v.storage === value && v.color === selectedVariant?.color,
      );

      if (!newVariant) {
        newVariant = product.variants.find((v) => v.storage === value);
      }
    }

    if (newVariant) setSelectedVariant(newVariant);
  };

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      alert("Login dulu!");
      return;
    }

    const key = `cart_${user.username}`;
    const cart = JSON.parse(localStorage.getItem(key)) || [];

    const exist = cart.find(
      (item) =>
        item.name === product.name &&
        item.color === selectedVariant?.color &&
        item.storage === selectedVariant?.storage,
    );

    if (exist) {
      exist.qty += 1;
    } else {
      cart.push({
        name: product.name,
        image: product.image,
        selling: selectedVariant?.selling,
        color: selectedVariant?.color,
        storage: selectedVariant?.storage,
        qty: 1,
      });
    }

    localStorage.setItem(key, JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    alert("Berhasil ditambahkan ke keranjang!");
  };
  return (
    <div className="bg-white min-h-screen">
      <LandingHeader />

      {/* 🔥 TOP BAR */}
      <div className="flex justify-between items-center px-10 py-4 border-b sticky top-0 bg-white z-40">
        <h1 className="text-xl font-semibold text-black">{product.name}</h1>

        <div className="flex items-center gap-4">
          <span className="text-orange-500 text-xl font-bold ">
            Rp{selectedVariant?.selling?.toLocaleString() || 0}
          </span>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-5 py-2 rounded-xl"
          >
            Tambah ke keranjang
          </button>
        </div>
      </div>

      {/* 🔥 MAIN */}
      <div className="grid grid-cols-2 gap-12 px-10 py-10">
        {/* LEFT IMAGE */}
        <div>
          <img
            src={product.image || "https://via.placeholder.com/500"}
            className="w-full max-h-[500px] object-contain"
          />

          {/* 🔥 THUMBNAIL (dummy dulu) */}
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="w-14 h-14 border rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500"
              >
                <img src={product.image} className="h-10" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT DETAIL */}
        <div className="text-black">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <h2 className="text-orange-500 text-3xl font-bold mb-2">
            Rp{selectedVariant?.selling?.toLocaleString() || 0}
          </h2>

          <p className="text-gray-400 text-sm mb-4">
            atau mulai dari Rp 1.353.300 /bln
          </p>

          {/* 🔥 PROMO */}
          <div className="space-y-2 mb-6 text-sm">
            <p>🎁 Hadiah menarik tersedia</p>
            <p>💰 Kupon diskon hingga Rp100.000</p>
            <p>⭐ Poin Mi hingga 19999</p>
          </div>

          {/* 🔥 COLOR */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Colour</p>

            <div className="flex gap-3 flex-wrap">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect("color", c)}
                  className={`px-4 py-3 border rounded-xl w-28 ${
                    selectedVariant?.color === c
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 🔥 STORAGE */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Storage</p>

            <div className="flex gap-3 flex-wrap">
              {storages.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect("storage", s)}
                  className={`px-4 py-3 border rounded-xl w-36 ${
                    selectedVariant?.storage === s
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 🔥 ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl w-full"
          >
            Tambah ke keranjang
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-10 border-b pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2 ${
            activeTab === "overview"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-400"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 ${
            activeTab === "reviews"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-400"
          }`}
        >
          Ulasan
        </button>
      </div>

      {activeTab === "reviews" && (
        <div className="bg-[#f7f7f7] py-20 px-6 text-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">
              What My Clients Are Saying
            </h2>

            {reviews.length === 0 ? (
              <p className="text-center text-gray-400">Belum ada ulasan 😢</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((r, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-2xl shadow flex gap-4"
                  >
                    {/* IMAGE */}
                    <img
                      src={r.imageProof || "https://i.pravatar.cc/100"}
                      className="w-20 h-20 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{r.user}</h3>

                      {/* ⭐ RATING */}
                      <div className="text-orange-500 text-sm">
                        {"★".repeat(r.rating)}{" "}
                        <span className="text-gray-400 ml-1">{r.rating}.0</span>
                      </div>

                      <p className="text-gray-500 text-sm mt-2">{r.comment}</p>

                      <p className="text-xs text-gray-400 mt-2">{r.date}</p>
                    </div>

                    {/* QUOTE ICON */}
                    <span className="text-orange-500 text-xl">❝</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <>
          {/* 🔥 OVERVIEW */}
          <div className="bg-white py-24 px-6 text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {product.name}
            </h2>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              {product.overview ||
                product.description ||
                "Produk ini dirancang untuk pengalaman terbaik"}
            </p>

            <div className="flex justify-center">
              <img
                src={product.image}
                className="w-full max-w-4xl object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* 🔥 FEATURES */}
          <div className="bg-white py-24 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {features.map((feature, i) => {
                  const Icon = iconMap[feature.icon] || Cpu;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <Icon className="text-orange-500" size={20} />
                      </div>

                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>

                      <p className="text-gray-400 text-sm mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🔥 SPECIFICATIONS */}
          <div className="bg-[#f7f7f7] py-20 px-6 text-black">
            <div className="max-w-5xl mx-auto">
              <p className="text-xs tracking-widest text-gray-400 mb-6">
                SPECIFICATIONS
              </p>

              {specs.map((spec) => (
                <div key={spec.key} className="border-b py-5">
                  <div
                    onClick={() =>
                      setOpenSpec(openSpec === spec.key ? null : spec.key)
                    }
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <h3 className="text-lg font-medium">{spec.title}</h3>

                    <span
                      className={`text-gray-400 transition-transform duration-300 ${
                        openSpec === spec.key ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      openSpec === spec.key
                        ? "max-h-96 mt-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-6 text-sm text-gray-600 pb-4">
                      {spec.content.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="font-medium text-black">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
