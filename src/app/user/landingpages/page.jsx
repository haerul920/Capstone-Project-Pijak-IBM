"use client";
import { useEffect, useState, useRef } from "react";
import LandingHeader from "../../components/HeaderLanding";
import FooterLanding from "../../components/FooterLanding";
import React from "react";

import { useRouter } from "next/navigation";



import {
  Laptop,
  Sofa,
  Camera,
  HeartPulse,
  Headphones,
  Dumbbell,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("flagship");

 const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productsMaster")) || [];
    setProducts(data);
  }, []);

  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    const scrollAmount = 300;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const tabs = {
    flagship: {
      title: "Xiaomi 17 Ultra",
      desc: "Leica 200MP kamera ultra dinamis",
      price: "Rp 19.999.000",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
    },
    trending: {
      title: "Xiaomi 17",
      desc: "Smartphone flagship terbaru",
      price: "Rp 14.999.000",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    },
    wearables: {
      title: "Smart Watch",
      desc: "Kesehatan & gaya hidup",
      price: "Rp 3.999.000",
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    },
    smart: {
      title: "Smart Home",
      desc: "Rumah pintar masa depan",
      price: "Rp 2.499.000",
      image: "https://images.unsplash.com/photo-1581091215367-59ab6b7c4b4b",
    },
    mobility: {
      title: "Electric Scooter",
      desc: "Transportasi modern",
      price: "Rp 6.699.000",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    },
  };

  const categoryRef = useRef(null);

  const scrollCategory = (direction) => {
    if (!categoryRef.current) return;

    const scrollAmount = 300;

    categoryRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const slides = [


 
    {
      title: "SPECTACULAR DEAL",
      desc: "Penawaran terbaik untuk produk pilihan",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
    },
    {
      title: "Xiaomi Watch 5",
      desc: "0% installment up to 12 months",
      image: "/images/1.jpg",
    },
    {
      title: "Radiant Skin Essentials",
      desc: "Perawatan kulit berkualitas tinggi untuk membantu menjaga kesehatan dan kecerahan kulit setiap hari.",
          image: "/images/2.jpg",
    },
    {
      title: "iPhone 17 Pro Max",
      desc: "Performa luar biasa dengan desain premium dan teknologi terbaru untuk pengalaman penggunaan yang lebih cepat, cerdas, dan elegan.",
      image: "/images/3.jpg",
    },
  ];

  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;

    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffTime = now - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const tabConfig = {
    flagship: { category: "electronics", sub: "mobile" },
    trending: { category: "electronics", sub: "smarthome" },
    wearables: { category: "electronics", sub: "smartwearables" },
    work: { category: "electronics", sub: "laptop" },
    media: { category: "electronics", sub: "tv" },
    perabotan: { category: "furniture", sub: "chairs" }, // contoh
    glow: { category: "skincare", sub: "serum" },
  };

  const currentTabConfig = tabConfig[activeTab];

  const filteredProducts = products.filter((item) => {
    const category = item.category?.toString().toLowerCase();
    const sub = item.subcategory?.toString().toLowerCase();

    return (
      category === currentTabConfig?.category && sub === currentTabConfig?.sub
    );
  });

  const mainProduct = filteredProducts[0];
  return (
    <div className="bg-white min-h-screen text-black">
      <LandingHeader />

      {/* 🔥 HERO SLIDER */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* 🔥 BACKGROUND SLIDER */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0"
            }`}
          >
            <img src={slide.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* 🔥 TEXT (FIXED, TIDAK IKUT SLIDE) */}
        <div className="absolute inset-0 flex items-center z-20">
          <div className="ml-40 max-w-xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {slides[currentSlide].title}
            </h1>

            <p className="text-lg text-gray-200 mb-6">
              {slides[currentSlide].desc}
            </p>

            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* 🔥 ARROW */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 
    bg-gray-200/80 hover:bg-gray-400 
    w-12 h-12 rounded-xl flex items-center justify-center 
    text-black shadow transition z-30"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 
    bg-gray-200/80 hover:bg-gray-400 
    w-12 h-12 rounded-xl flex items-center justify-center 
    text-black shadow transition z-30"
        >
          ›
        </button>

        {/* 🔥 DOT */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === currentSlide ? "bg-white" : "bg-gray-400 opacity-50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-10 py-10">
        {/* 🔥 CATEGORY ICONS */}
        <h2 className="text-2xl font-semibold mb-6">
          Berbagai produk tersedia
        </h2>

        <div className="relative mb-12">
          {/* 🔥 BUTTON LEFT */}
          <button
            onClick={() => scrollCategory("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
          >
            ◀
          </button>

          {/* 🔥 SCROLL AREA */}
          <div className="flex justify-center">
            <div
              ref={categoryRef}
              className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-4 max-w-5xl pt-8"
            >
              <div className="min-w-[120px] flex-shrink-0">
                <Category
                  title="Electronics"
                  icon={<Laptop size={40} />}
                  price="Mulai Rp11 juta"
                />
              </div>

              <div className="min-w-[120px] flex-shrink-0">
                <Category
                  title="Furniture"
                  icon={<Sofa size={40} />}
                  price="Mulai Rp8 juta"
                />
              </div>

              <div className="min-w-[120px] flex-shrink-0">
                <Category
                  title="Camera"
                  icon={<Camera size={40} />}
                  price="Mulai Rp4 juta"
                />
              </div>

              <div className="min-w-[120px] flex-shrink-0">
                <Category
                  title="Skincare"
                  icon={<HeartPulse size={40} />}
                  price="Mulai Rp3 juta"
                />
              </div>

              <div className="min-w-[120px] flex-shrink-0">
                <Category
                  title="Audio"
                  icon={<Headphones size={40} />}
                  price="Mulai Rp2 juta"
                />
              </div>

              <div className="min-w-[120px] flex-shrink-0">
                <Category
                  title="Sports"
                  icon={<Dumbbell size={40} />}
                  price="Mulai Rp200rb"
                />
              </div>

              <div className="min-w-[120px] flex-shrink-0">
                <Category
                  title="Books"
                  icon={<BookOpen size={40} />}
                  price="Mulai Rp400rb"
                />
              </div>
            </div>
            {/* 🔥 bebas tambah sebanyak apapun */}
          </div>

          {/* 🔥 BUTTON RIGHT */}
          <button
            onClick={() => scrollCategory("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
          >
            ▶
          </button>
        </div>
        {/* 🔥 PRODUCT GRID */}
        <h2 className="text-2xl font-semibold mb-6">Cek yang terbaru.</h2>

        <div className="relative">
          {/* 🔥 BUTTON LEFT */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
          >
            ◀
          </button>

          {/* 🔥 SCROLL AREA */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-10"
          >
            {products.map((p, i) => (
              <div
                key={i}
                onClick={() => router.push(`/user/ProductDetails/${p.name}`)}
                className="min-w-[250px] bg-gray-50 p-5 rounded-2xl flex-shrink-0 hover:shadow-lg transition cursor-pointer"
              >
                <div className="relative">
                  {isNewProduct(p.createdAt) && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      NEW
                    </span>
                  )}

                  <img
                    src={p.image}
                    className="h-40 w-full object-contain mb-4"
                  />
                </div>
                <h3 className="font-semibold text-lg">{p.name}</h3>

                <p className="text-gray-500 text-sm mb-2">
                  Produk terbaru berkualitas tinggi
                </p>

                <p className="font-semibold">Rp{p.selling?.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* 🔥 BUTTON RIGHT */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
          >
            ▶
          </button>
        </div>

        <div className="bg-gray-100 py-16 mt-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* 🔥 ITEM 1 */}
            <div>
              <div className="text-4xl mb-4 text-gray-500">👥</div>

              <h3 className="text-xl font-semibold mb-2">
                Dapatkan servis dan bantuan profesional.
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Mulai dari pengaturan device terbaru-mu hingga servis, dapatkan
                pengalaman terbaiknya.
              </p>

              <button className="text-blue-500 hover:underline">
                Lebih lanjut →
              </button>
            </div>

            {/* 🔥 ITEM 2 */}
            <div>
              <div className="text-4xl mb-4 text-blue-500">💳</div>

              <h3 className="text-xl font-semibold mb-2">
                Simulasi kredit dan cicilan
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Berbagai pilihan pembayaran kredit dan cicilan. Semua pilihanmu.
              </p>

              <button className="text-blue-500 hover:underline">
                Lebih lanjut →
              </button>
            </div>

            {/* 🔥 ITEM 3 */}
            <div>
              <div className="text-4xl mb-4 text-gray-500">🚚</div>

              <h3 className="text-xl font-semibold mb-2">
                Beli online, ambil di toko.
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Belanja online dan bebas biaya kirim.
              </p>

              <button className="text-blue-500 hover:underline">
                Lebih lanjut →
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 py-16 mt-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Featured Products
            </h2>

            {/* 🔥 TAB MENU */}
            <div className="flex justify-center gap-8 mb-10 border-b pb-2">
              <TabBtn
                label="Mobile / Smartphone"
                id="flagship"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabBtn
                label="Smart Home"
                id="trending"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabBtn
                label="Smart Wearables"
                id="wearables"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabBtn
                label="Computing & Accessories"
                id="work"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabBtn
                label="Entertainment & Media"
                id="tv"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabBtn
                label="Furniture"
                id="perabotan"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabBtn
                label="Skincare"
                id="glow"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* 🔥 MAIN FEATURE */}
            {mainProduct && (
              <div
                onClick={() =>
  router.push(`/user/ProductDetails/${encodeURIComponent(mainProduct.name)}`)
}
                className="bg-white rounded-2xl p-6 flex gap-6 mb-8 shadow cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={mainProduct.image}
                  className="w-1/2 rounded-xl object-cover"
                />

                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-2">
                    {mainProduct.name}
                  </h3>

                  <p className="text-gray-500 mb-4">
                    {mainProduct.description || "Produk unggulan"}
                  </p>

                  <p className="font-semibold mb-4">
                    Rp{mainProduct.selling?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* 🔥 MINI PRODUCTS */}
            <div className="grid grid-cols-4 gap-6">
              {filteredProducts.slice(1, 5).map((p, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/user/ProductDetails/${p.name}`)}
                  className="bg-white p-4 rounded-2xl shadow text-center cursor-pointer hover:shadow-lg transition"
                >
                  <img src={p.image} className="h-32 mx-auto mb-3" />

                  <h4 className="font-semibold">{p.name}</h4>

                  <p className="text-gray-500 text-sm">
                    Rp{p.selling?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 🔥 FOOTER */}
      <FooterLanding />
    </div>
  );
}

function Category({ title, icon, price }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/user/category/${title.toLowerCase()}`)}
      className="group flex flex-col items-center gap-2 
      hover:scale-105 transition cursor-pointer"
    >
      <div
        className="bg-gray-100 p-4 rounded-2xl 
        transition duration-300 
        group-hover:bg-orange-500"
      >
        {React.cloneElement(icon, {
          className: "transition group-hover:text-white",
        })}
      </div>

      <p className="font-medium">{title}</p>
      <p className="text-xs text-gray-400">{price}</p>
    </div>
  );
}

function TabBtn({ label, id, activeTab, setActiveTab }) {
  const active = activeTab === id;

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`pb-2 text-sm ${
        active
          ? "text-orange-500 border-b-2 border-orange-500 font-semibold"
          : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}
