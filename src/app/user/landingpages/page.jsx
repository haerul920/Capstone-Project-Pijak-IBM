"use client";
import { useEffect, useState, useRef } from "react";
import LandingHeader from "../../components/HeaderLanding";
import FooterLanding from "../../components/FooterLanding";
import React from "react";

import { useRouter } from "next/navigation";

import {
  Truck,
  CreditCard,
  Headphones,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("flagship");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [reviews, setReviews] = useState([]);

  const categories = [
    {
      name: "electronics",
      title: "ELECTRONICS",
      desc: "Temukan berbagai produk elektronik modern yang dirancang untuk menunjang gaya hidup praktis dan cerdas. Mulai dari peralatan rumah tangga pintar seperti kulkas digital dan robot vacuum, hingga perangkat personal seperti smartwatch, earbuds, dan smartphone terbaru semuanya hadir dengan teknologi inovatif untuk memberikan kenyamanan, efisiensi, dan hiburan dalam satu genggaman.",
      images: [
        "https://i02.appmifile.com/959_item_id/25/02/2026/59ad74a690c9ff8afc6ea578b2d6cf9e.png?thumb=1&w=600&f=webp&q=85", // kulkas

        "https://i02.appmifile.com/407_item_id/06/03/2026/68a5376a9c75bb0930015b4fd1b73ead.png?thumb=1&w=400&f=webp&q=85", // tab
        "https://i02.appmifile.com/43_item_id/10/02/2026/78b8b9f2470e705b511ae432b97e27d2.png?thumb=1&w=1000&f=webp&q=85", // hp
        "https://i02.appmifile.com/153_item_id/25/02/2026/1679e550267d3856edf210870c3f3a16.png?thumb=1&w=400&f=webp&q=85", // robot
        "https://i02.appmifile.com/158_item_id/04/03/2026/571370062f6195eba8a56c79acd92cd8.png?thumb=1&w=600&f=webp&q=85", // earbuds
        "https://i02.appmifile.com/353_item_id/27/08/2025/4dc62dbe400daa96e5aa9c9abb5dd44b.png?thumb=1&w=600&f=webp&q=85", // tv
      ],
    },
    {
      name: "skincare",
      title: "SKINCARE",
      desc: "Perawatan kulit terbaik untuk kamu...",
      images: [
        "/images/serum.png",
        "/images/cleanser.png",
        "/images/sunscreen.png",
      ],
    },
    {
      name: "furniture",
      title: "FURNITURE",
      desc: "Perabotan modern untuk rumah impian...",
      images: ["/images/chair.png", "/images/table.png", "/images/sofa.png"],
    },
  ];
  const [categoryIndex, setCategoryIndex] = useState(0);
  const nextCategory = () => {
    setCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCategoryIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productsMaster")) || [];
    setProducts(data);
    const reviewsData = JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(reviewsData);
  }, []);

  useEffect(() => {
    const loadReviews = () => {
      const data = JSON.parse(localStorage.getItem("reviews")) || [];
      setReviews(data);
    };

    loadReviews();

    window.addEventListener("reviewsUpdated", loadReviews);

    return () => {
      window.removeEventListener("reviewsUpdated", loadReviews);
    };
  }, []);

  const getProductRating = (productName) => {
    const productReviews = reviews.filter(
      (r) => r.product?.toLowerCase() === productName?.toLowerCase(),
    );

    if (productReviews.length === 0) {
      return { avg: 0, total: 0 };
    }

    const total = productReviews.length;
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / total;

    return {
      avg: avg.toFixed(1),
      total,
    };
  };

  const sliderRef = useRef(null);

  // Tambahkan ini di bagian atas bersama state lainnya
  const [reviewIndex, setReviewIndex] = useState(0);

  // Logic untuk mengambil maksimal 5 review terbaru
  const topReviews = reviews.slice(0, 5);

  const nextReview = () => {
    setReviewIndex((prev) => (prev + 1) % topReviews.length);
  };

  const prevReview = () => {
    setReviewIndex((prev) => (prev === 0 ? topReviews.length - 1 : prev - 1));
  };

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

  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("Login dulu bro");

    const key = `cart_${user.username}`;
    const cart = JSON.parse(localStorage.getItem(key)) || [];

    const existingIndex = cart.findIndex((item) => item.name === product.name);

    if (existingIndex !== -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem(key, JSON.stringify(cart));

    // trigger update global
    window.dispatchEvent(new Event("ordersUpdated"));

    alert("Ditambahkan ke keranjang 🛒");
  };
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

      <div className="px-10">
        <div className="py-8 px-6  rounded-xl">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mt-20">
            {/* ITEM 1 */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-white p-4 rounded-xl shadow">
                <Truck className="text-red-500" size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Free Shipping</h3>
                <p className="text-sm text-gray-500">
                  Gratis ongkir dalam 1 pulau
                </p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-white p-4 rounded-xl shadow">
                <CreditCard className="text-red-500" size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Flexible Payment</h3>
                <p className="text-sm text-gray-500">
                  Tersedia banyak jenis pembayaran
                </p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-white p-4 rounded-xl shadow">
                <Headphones className="text-red-500" size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">24x7 Support</h3>
                <p className="text-sm text-gray-500">
                  Tersedia CS dalam 24 jam
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 🔥 PRODUCT GRID */}
        <h2 className="text-4xl font-black mb-6 text-center mt-20">
          Our <span className="text-red-500 font-black">Products</span>
        </h2>

        <div className="relative">
          {/* 🔥 GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-10 justify-items-center">
            {currentProducts.map((p, i) => {
              const ratingData = getProductRating(p.name);

              return (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition relative w-full h-[400px] flex flex-col justify-between"
                >
                  {/* 🔥 BADGE */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-purple-600 text-white text-[13px] px-4 py-2 rounded-full">
                      Best Seller
                    </span>

                    {isNewProduct(p.createdAt) && (
                      <span className="bg-yellow-400 text-white text-[13px] px-4 py-2 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* 🔥 CART ICON */}
                  <button
                    onClick={() => addToCart(p)}
                    className="absolute top-3 right-3 text-orange-500 hover:scale-110 transition"
                  >
                    <ShoppingCart size={18} />
                  </button>

                  {/* 🔥 IMAGE */}
                  <img
                    src={p.image}
                    className="h-40 mx-auto object-contain mb-3 mt-4"
                  />

                  {/* 🔥 TITLE + RATING */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <div className="flex items-center gap-1 text-orange-500 text-xs">
                      {ratingData.total > 0 && (
                        <>
                          <Star size={14} fill="orange" />
                          {ratingData.avg}
                        </>
                      )}
                    </div>
                  </div>

                  {/* 🔥 DESC */}
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                    {p.overview ||
                      p.description ||
                      "Produk terbaik dengan kualitas tinggi"}
                  </p>

                  {/* 🔥 PRICE */}
                  <p className="text-xs text-gray-500">Harga:</p>
                  <p className="font-bold text-sm mb-2">
                    Rp{p.selling?.toLocaleString()}
                  </p>

                  {/* 🔥 BUTTON */}
                  <button
                    onClick={() =>
                      router.push(`/user/ProductDetails/${p.name}`)
                    }
                    className="bg-red-500 text-white text-xs px-3 py-3 rounded-full w-full"
                  >
                    Show Details
                  </button>
                </div>
              );
            })}
          </div>

          {/* 🔥 NAVIGATION */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev === 0 ? totalPages - 1 : prev - 1,
                  )
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-red-500 text-white w-10 h-10 rounded-full"
              >
                ‹
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) => (prev + 1) % totalPages)
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500 text-white w-10 h-10 rounded-full"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* 🔥 CATEGORY SECTION (BENTO GRID STYLE) */}
        <div className="bg-gray-200 mt-20 rounded-2xl p-8 md:p-18 ">
          <h2 className="text-3xl font-black mb-8 text-red-500">Category</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* --- GRID GAMBAR (KIRI) --- */}
            <div className="lg:col-span-7 grid grid-cols-4 grid-rows-2 gap-4 h-[700px]">
              {/* Kulkas (Besar di kiri) */}
              <div className="col-span-2 row-span-2 bg-white rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={categories[categoryIndex].images[0]}
                  className="h-96 object-contain"
                  alt="Kulkas"
                />
              </div>

              {/* Smartwatch (Kanan atas - kiri) */}
              <div className="col-span-1 row-span-1 bg-white rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={categories[categoryIndex].images[1]}
                  className="h-40 object-contain"
                  alt="Tablet"
                />
              </div>

              {/* Robot Vacuum (Kanan atas - kanan) */}
              <div className="col-span-1 row-span-1 bg-white rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={categories[categoryIndex].images[2]}
                  className="h-30 object-contain"
                  alt="HP"
                />
              </div>

              {/* Earbuds (Kanan bawah - lebar) */}
              <div className="col-span-2 row-span-1 bg-white rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={categories[categoryIndex].images[3]}
                  className="h-60 object-contain"
                  alt="Earbuds"
                />
              </div>

              {/* TV (Bawah kiri - lebar) */}
              <div className="col-span-2 row-span-1 bg-white rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={categories[categoryIndex].images[4]}
                  className="h-50 object-contain"
                  alt="TV"
                />
              </div>

              {/* Smartphone (Bawah kanan - portrait) */}
              <div className="col-span-2 row-span-1 bg-white rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={categories[categoryIndex].images[5]}
                  className="h-50 object-contain"
                  alt="AC"
                />
              </div>
            </div>

            {/* --- TEXT CONTENT (KANAN) --- */}
            <div className="lg:col-span-5 flex flex-col justify-between pl-0 lg:pl-8">
              <div>
                <h3 className="text-4xl font-black mb-6 tracking-tight text-red-500">
                  {categories[categoryIndex].title}
                </h3>
                <p className="text-lg leading-relaxed opacity-90 mb-8">
                  {categories[categoryIndex].desc}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <button
                  onClick={() =>
                    router.push(
                      `/user/category/${categories[categoryIndex].name}`,
                    )
                  }
                  className="bg-red-500 text-white font-bold px-20 py-3 rounded-lg hover:bg-red-700 transition shadow-lg"
                >
                  View All
                </button>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  {/* LEFT */}
                  <button
                    onClick={prevCategory}
                    className="w-14 h-14 rounded-full flex items-center text-black justify-center 
    transition duration-300 active:scale-95"
                    style={{
                      background: "#e5e5e5",
                      boxShadow: `
        inset -5px -5px 10px rgba(255,255,255,0.7),
        inset 5px 10px 10px rgba(0, 0, 0, 0.41)
      `,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#d4d4d4"; // 🔥 lebih gelap
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#e5e5e5";
                    }}
                  >
                    <ChevronLeft size={22} />
                  </button>

                  {/* RIGHT */}
                  <button
                    onClick={nextCategory}
                    className="w-14 h-14 rounded-full flex items-center text-black justify-center 
    transition duration-300 active:scale-95"
                    style={{
                      background: "#e5e5e5",
                      boxShadow: `
        inset -5px -5px 10px rgba(255,255,255,0.7),
        inset 5px 10px 10px rgba(0, 0, 0, 0.41)
      `,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#d4d4d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#e5e5e5";
                    }}
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" py-16 mt-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-black mb-6 text-center mt-20">
              Featured <span className="text-red-500 font-black">Products</span>
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
                  router.push(
                    `/user/ProductDetails/${encodeURIComponent(mainProduct.name)}`,
                  )
                }
                className="rounded-2xl p-8 flex gap-10 mb-10 cursor-pointer transition"
                style={{
                  background: "#ffffffff",
                  boxShadow: `
                    inset 5px 5px 10px rgba(0,0,0,0.25),
                    inset -5px -5px 10px rgba(223, 220, 220, 0.7)
    `,
                }}
              >
                {/* LEFT IMAGE */}
                <div className="w-1/2 flex items-center justify-center">
                  <img
                    src={mainProduct.image}
                    className="h-[260px] object-contain"
                  />
                </div>

                {/* 🔥 DIVIDER */}
                <div className="w-[2px] bg-gray-600/20"></div>

                {/* RIGHT CONTENT */}
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="text-3xl font-bold mb-3">
                    {mainProduct.name}
                  </h3>

                  <p className="text-gray-600 mb-4 max-w-md line-clamp-3">
                    {mainProduct.overview ||
                      mainProduct.description ||
                      "Produk unggulan dengan kualitas terbaik"}
                  </p>
                  <p className="text-red-500 text-2xl font-bold">
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
                  className="p-4 rounded-2xl text-center cursor-pointer transition "
                  style={{
                    background: "#fffbfbdf",
                    boxShadow: `
                    inset 5px 5px 10px rgba(0,0,0,0.25),
                    inset -5px -5px 10px rgba(255,255,255,0.7)
                  `,
                  }}
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
      {/* 🔥 ABOUT SECTION (FULL WIDTH) */}
      <div className="w-full bg-red-600 py-5 flex justify-center">
        <div className="bg-white px-10 py-4 rounded-md shadow-md">
          <a href="/user/about">
            <h2 className="text-xl font-bold text-red-600">About Lytro</h2>
          </a>
        </div>
      </div>

      {/* 🔥 REVIEW SECTION */}
      <div className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-10">
          {/* HEADER SECTION */}
          <div className="flex items-center justify-between mb-12 text-center">
            {/* Teks - Menggunakan flex-1 agar tetap di tengah atau sesuai porsi */}
            <h2 className="text-5xl font-black text-gray-800 tracking-tight">
              What My Clients Are Saying
            </h2>

            {/* Tombol Navigasi - Berjajar di sebelah kanan judul */}
            {topReviews.length > 1 && (
              <div className="flex gap-4 shrink-0">
                <button
                  onClick={prevReview}
                  className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition active:scale-90"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextReview}
                  className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition active:scale-90"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            )}
          </div>

          {/* CONTAINER CARD */}
          <div
            className={`flex gap-6 overflow-hidden transition-all duration-500 ${topReviews.length < 3 ? "justify-center" : ""}`}
          >
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${reviewIndex * 20}%)` }} // Geser tipis jika mau efek slider murni
            >
              {topReviews.map((r, i) => (
                <div
                  key={i}
                  className="min-w-[450px] bg-white rounded-3xl p-8 flex gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-xl transition-shadow"
                  style={{
                    background: "#fffbfbdf",
                    boxShadow: `
                    inset 5px 5px 10px rgba(0,0,0,0.25),
                    inset -5px -5px 10px rgba(255,255,255,0.7)
                  `,
                  }}
                >
                  {/* KIRI: GAMBAR PRODUK */}
                  <div className="w-1/3 flex items-center justify-center bg-gray-50 rounded-2xl p-2">
                    <img
                      src={r.image || "https://via.placeholder.com/150"}
                      className="h-32 w-full object-contain"
                      alt={r.product}
                    />
                  </div>

                  {/* KANAN: INFO REVIEW */}
                  <div className="w-2/3 flex flex-col justify-center">
                    <h3 className="font-bold text-xl text-gray-800">
                      {r.product}
                    </h3>
                    <p className="font-bold text-lg text-gray-700 mb-1">
                      {r.user}
                    </p>

                    {/* RATING */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, k) => (
                        <Star
                          key={k}
                          size={18}
                          className={
                            k < r.rating
                              ? "text-orange-400 fill-orange-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>

                    {/* COMMENT */}
                    <p className="text-gray-600 italic text-sm mb-4 line-clamp-3 leading-relaxed">
                      "{r.comment || "Produknya bagus sekali"}"
                    </p>

                    {/* DATE */}
                    <p className="text-xs text-gray-400 font-medium">
                      {r.date}
                    </p>
                  </div>
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
