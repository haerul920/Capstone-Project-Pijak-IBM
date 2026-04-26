"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LandingHeader from "../../../components/HeaderLanding";
import FooterLanding from "../../../components/FooterLanding";
import { useRef } from "react";

export default function CategoryPage() {
  const [products, setProducts] = useState([]);
  const params = useParams();

  const category = params.category || params.name;
  const sub = params.sub || "all";

  const decodedCategory = decodeURIComponent(category);
  const decodedSub = decodeURIComponent(sub);
  const sectionRefs = useRef({});

  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productsMaster")) || [];

    setProducts(data); // 🔥 INI YANG KAMU LUPA

    const filtered = data.filter(
      (item) => item.category?.toLowerCase() === decodedCategory.toLowerCase(),
    );

    const grouped = {};

    filtered.forEach((item) => {
      const sub = item.subcategory?.toLowerCase() || "other";

      if (!grouped[sub]) {
        grouped[sub] = [];
      }

      grouped[sub].push(item);
    });

    setGroupedProducts(grouped);
  }, [decodedCategory]);

  useEffect(() => {
    if (sub !== "all" && sectionRefs.current[sub]) {
      sectionRefs.current[sub].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [sub, groupedProducts]);

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.username) {
      alert("Silakan login dulu!");
      return;
    }

    const key = `cart_${user.username}`;
    let cart = JSON.parse(localStorage.getItem(key)) || [];

    const existingIndex = cart.findIndex(
      (item) =>
        item.name === product.name &&
        item.color === product.color &&
        item.storage === product.storage,
    );

    if (existingIndex !== -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        ...product,
        qty: 1,
      });
    }

    localStorage.setItem(key, JSON.stringify(cart));

    // 🔥 PENTING BANGET (biar navbar update)
    window.dispatchEvent(new Event("cartUpdated"));

    alert("Produk masuk ke keranjang 🛒");
  };

  const categorySidePromo = {
    electronics: [
      {
        title: "⚡ Special Discount",
        img: "https://i.pinimg.com/736x/8e/bc/a2/8ebca2ecd61e110b2bf90d957a8edf5e.jpg",
      },
      {
        title: "🎧 Hot Deals",
        img: "https://i.pinimg.com/1200x/cb/eb/87/cbeb874da0baef70201ac9ea8dad6303.jpg",
      },
    ],

    skincare: [
      {
        title: "✨ Beauty Sale",
        img: "https://i.pinimg.com/1200x/2d/f4/be/2df4be54f4ac1c6f4cd29e97e7c9f48d.jpg",
      },
      {
        title: "💧 Skincare Deals",
        img: "https://i.pinimg.com/1200x/c3/9c/85/c39c856dc63563b4d020f71ce537e3f5.jpg",
      },
    ],

    furniture: [
      {
        title: "🪑 Furniture Sale",
        img: "https://images.unsplash.com/photo-1567016526105-22da7c130bd5",
      },
      {
        title: "🏡 Home Deals",
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      },
    ],

    audio: [
      {
        title: "🎧 Audio Sale",
        img: "https://i.pinimg.com/736x/0e/fa/eb/0efaeb529479846a5944f4f4a32d7760.jpg",
      },
      {
        title: "🔊 Speaker Deals",
        img: "https://i.pinimg.com/736x/17/65/e9/1765e90b3549e1d115273d50cc931039.jpg",
      },
    ],
  };

  const sidePromos =
    categorySidePromo[decodedCategory.toLowerCase()] ||
    categorySidePromo["electronics"];

  const categoryHero = {
    electronics: {
      title: "Electronic Devices",
      img: "https://i.pinimg.com/1200x/9c/4d/71/9c4d711dd8998d7b9cafbdda616a9267.jpg",
    },
    skincare: {
      title: "Skincare Collection",
      img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
    },
    furniture: {
      title: "Modern Furniture",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    },
    audio: {
      title: "Audio Experience",
      img: "https://i.pinimg.com/1200x/e8/07/cc/e807cc2f7a2656d12bb31ee72be132b3.jpg",
    },
  };

  const heroData =
    categoryHero[decodedCategory.toLowerCase()] || categoryHero["electronics"];

  const categoryPromo = {
    electronics: [
      {
        title: "Smartphone Pro",
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      },
      {
        title: "Gaming Laptop",
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      },
      {
        title: "Smart Watch",
        img: "https://i.pinimg.com/736x/d8/b3/6e/d8b36e05b46a75bbffef65ae02adf9de.jpg",
      },
    ],

    skincare: [
      {
        title: "Glow Serum",
        img: "https://i.pinimg.com/1200x/b9/ac/8b/b9ac8b9b7d1c00e9430e042751175bb4.jpg",
      },
      {
        title: "Cleanser",
        img: "https://i.pinimg.com/736x/c1/f5/6f/c1f56f2cd9f8575513627c1918d70881.jpg",
      },
      {
        title: "Sunscreen SPF",
        img: "https://i.pinimg.com/1200x/a0/35/1a/a0351ab984e3d4d20b217b7555e4a468.jpg",
      },
    ],

    furniture: [
      {
        title: "Modern Sofa",
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      },
      {
        title: "Wood Table",
        img: "https://images.unsplash.com/photo-1567016526105-22da7c130bd5",
      },
      {
        title: "Minimalist Chair",
        img: "https://images.unsplash.com/photo-1582582429416-0e0e2e6c1b6e",
      },
    ],

    audio: [
      {
        title: "Wireless Headphone",
        img: "https://i.pinimg.com/1200x/a5/14/d3/a514d335f78dda38a07335a048299ba8.jpg",
      },
      {
        title: "Bluetooth Speaker",
        img: "https://i.pinimg.com/736x/d1/2c/68/d12c682d256748ac107aaf4d0c18f666.jpg",
      },
      {
        title: "Studio Mic",
        img: "https://i.pinimg.com/736x/69/43/10/694310d3a9d64680b194e16037d8da1a.jpg",
      },
    ],
  };

  const promoItems =
    categoryPromo[decodedCategory.toLowerCase()] ||
    categoryPromo["electronics"];

  const finalProducts = products.filter((item) => {
    const sameCategory =
      item.category?.toLowerCase() === decodedCategory.toLowerCase();

    const sameSub =
      decodedSub === "all" ||
      item.subcategory?.toLowerCase() === decodedSub.toLowerCase();

    return sameCategory && sameSub;
  });
  return (
    <div className="bg-[#f5f5f5] text-black min-h-screen">
      <LandingHeader />

      {/* 🔥 HERO GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-4 gap-4">
        {/* BIG HERO */}
        <div className="col-span-3 relative rounded-xl overflow-hidden h-72">
          {/* IMAGE DINAMIS */}
          <img
            src={heroData.img}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* CONTENT */}
          <div className="relative p-8 flex items-center h-full">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">
                {heroData.title}
              </h2>

              <p className="text-gray-200 mb-4">
                Produk terbaik untuk kategori {decodedCategory}
              </p>

              <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* SIDE PROMO */}
        <div className="flex flex-col gap-4">
          {sidePromos.map((item, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden flex-1">
              <img
                src={item.img}
                className="w-full h-full object-cover absolute inset-0"
              />

              <div className="absolute inset-0 bg-black/40"></div>

              <div className="relative p-4 text-white font-semibold">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 MINI PROMO */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-4 mb-10">
        {promoItems.map((item, i) => (
          <div key={i} className="relative rounded-xl overflow-hidden h-64">
            <img
              src={item.img}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative p-6 text-white font-semibold">
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 BEST SELLING */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-xl font-semibold mb-6">Best Selling Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {finalProducts.map((p, i) => (
            <div
              key={i}
              className="bg-[#fff]  shadow flex flex-col p-4 rounded-xl hover:scale-105 transition group"
            >
              <img src={p.image} className="h-32 mx-auto object-contain mb-3" />

              <h3 className="text-sm mb-1">{p.name}</h3>

              <p className="text-green-400 font-semibold">
                {p.variants && p.variants.length > 0
                  ? (() => {
                      const prices = p.variants.map((v) => v.selling);
                      const min = Math.min(...prices);
                      const max = Math.max(...prices);
                      return min === max
                        ? `Rp${min.toLocaleString()}`
                        : `Rp${min.toLocaleString()} - Rp${max.toLocaleString()}`;
                    })()
                  : `Rp${p.selling?.toLocaleString()}`}
              </p>

              <button
                onClick={() => handleAddToCart(p)}
                className="mt-3 w-full bg-black hover:bg-orange-500 text-white text-xs py-2 rounded-lg transition duration-300"
              >
                + Masukkan Keranjang
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 TRENDING */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-semibold mb-6">Trending This Week</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {finalProducts.slice(0, 5).map((p, i) => (
            <div
              key={i}
              className="bg-[#fff]  shadow flex flex-col p-4 rounded-xl hover:scale-105 transition group"
            >
              <img src={p.image} className="h-32 mx-auto object-contain mb-3" />

              <h3 className="text-sm">{p.name}</h3>
              <button
                onClick={() => handleAddToCart(p)}
                className="mt-3 w-full bg-black hover:bg-orange-500 text-white text-xs py-2 rounded-lg transition duration-300"
              >
                + Masukkan Keranjang
              </button>
            </div>
          ))}
        </div>
      </div>

      <FooterLanding />
    </div>
  );
}
