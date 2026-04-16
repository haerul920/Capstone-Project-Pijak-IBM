"use client";
import { useEffect, useState } from "react";
import LandingHeader from "../../components/HeaderLanding";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";



export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const router = useRouter();



  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.username) {
      alert("Silakan login dulu!");
      return;
    }

    const key = `cart_${user.username}`;
    let cart = JSON.parse(localStorage.getItem(key)) || [];

    const exist = cart.find((item) => item.name === product.name);

    if (exist) {
      exist.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getPrice = (product) => {
    if (product?.variants?.length) {
      const prices = product.variants.map((v) => v.selling);
      return Math.min(...prices);
    }
    return product.selling || 0;
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productsMaster")) || [];

    setProducts(data);

    const electronics = data.filter(
      (item) => item.category?.toLowerCase() === "electronics",
    );

    const grouped = {};

    electronics.forEach((item) => {
      const sub = item.subcategory?.toLowerCase() || "lainnya";

      if (!grouped[sub]) {
        grouped[sub] = [];
      }

      grouped[sub].push(item);
    });

    setGroupedProducts(grouped);
  }, []);

  const getShortDesc = (text, max = 50) => {
    if (!text) return "No description";
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <LandingHeader />

      {Object.entries(groupedProducts).map(([sub, items]) => {
        if (!items || items.length === 0) return null;

        const highlight = items[0];
        const right = items.slice(1, 3);
        const bottom = items.slice(3);

        return (
          <div key={sub} className="px-10 py-6 text-black">
            {/* TITLE */}
            <h1
              onClick={() => router.push(`/user/category/electronics/${sub}`)}
              className="text-3xl font-bold mb-6 text-center cursor-pointer hover:text-orange-500 capitalize"
            >
              {sub}
            </h1>

            {/* TOP */}
            <div className="grid grid-cols-5 gap-6 mb-6 items-stretch">
              {/* LEFT */}
              {highlight && (
                <div
                  onClick={() =>
                   router.push(`/user/ProductDetails/${encodeURIComponent(highlight.name)}`)
                  }
                  className="relative col-span-3 bg-gradient-to-r from-black to-gray-800 text-white p-8 rounded-2xl flex justify-between items-center cursor-pointer hover:scale-[1.01] transition"
                >
                  {/* CART */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(highlight);
                    }}
                    className="absolute top-4 right-4 bg-orange-500 p-2 rounded-full hover:scale-110 transition"
                  >
                    <ShoppingCart size={16} />
                  </button>

                  <div className="max-w-[60%]">
                    <p className="text-sm text-gray-400">Baru</p>
                    <h2 className="text-3xl font-bold line-clamp-2">
                      {highlight.name}
                    </h2>

                    <p className="text-gray-400 mt-2 line-clamp-2">
                      {getShortDesc(highlight.overview, 80)}
                    </p>

                    <p className="text-2xl font-semibold mt-3">
                      Rp{getPrice(highlight).toLocaleString()}
                    </p>
                  </div>

                  {/* IMAGE */}
                  <div className="w-[300px] h-[220px] flex items-center justify-center">
                    <img
                      src={highlight.image}
                      className="h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* RIGHT */}
              <div className="grid grid-cols-2 gap-6 col-span-2 h-full">
                {right.map((p, i) => (
                    <div
                        key={i}
                        onClick={() =>
                        router.push(`/user/ProductDetails/${encodeURIComponent(p.name)}`)
                        }
                    className="relative bg-white p-5 rounded-2xl shadow flex flex-col justify-between h-full cursor-pointer hover:scale-[1.02] transition"
                  >
                    {/* CART */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                      className="absolute top-3 right-3 bg-orange-500 p-2 rounded-full hover:scale-110"
                    >
                      <ShoppingCart size={14} />
                    </button>

                    <div>
                      <p className="text-orange-500 text-sm">Baru</p>
                      <h3 className="font-bold text-lg line-clamp-1">
                        {p.name}
                      </h3>

                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {getShortDesc(p.overview, 40)}
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400">Mulai dari</p>
                        <p className="font-semibold">
                          Rp{getPrice(p).toLocaleString()}
                        </p>
                      </div>

                      {/* IMAGE FIX */}
                      <div className="w-[80px] h-[80px] overflow-hidden flex items-center justify-center">
                        <img
                          src={p.image}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM */}
            <div className="grid grid-cols-4 gap-6 items-stretch auto-rows-fr">
              {bottom.map((p, i) => (
                <div
                  key={i}
                  onClick={() =>
                    router.push(`/user/ProductDetails/${encodeURIComponent(p.name)}`)
                  }
                  className="relative bg-white p-5 rounded-2xl shadow flex flex-col justify-between h-full cursor-pointer hover:scale-[1.02] transition"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="absolute top-3 right-3 bg-orange-500 p-2 rounded-full hover:scale-110"
                  >
                    <ShoppingCart size={14} />
                  </button>

                  <div>
                    <p className="text-orange-500 text-sm">Baru</p>
                    <h3 className="font-bold text-lg line-clamp-1">{p.name}</h3>

                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {getShortDesc(p.overview, 35)}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-400">Mulai dari</p>
                      <p className="font-semibold">
                        Rp{getPrice(p).toLocaleString()}
                      </p>
                    </div>

                    {/* IMAGE FIX */}
                    <div className="w-[90px] h-[90px] overflow-hidden flex items-center justify-center">
                      <img
                        src={p.image}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* SEE ALL */}
              <div
                onClick={() => router.push(`/user/category/electronics/${sub}`)}
                className="bg-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition"
              >
                <h3 className="font-semibold">Semua Produk</h3>
                <p className="text-gray-500 text-sm">Lihat semua koleksi →</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
