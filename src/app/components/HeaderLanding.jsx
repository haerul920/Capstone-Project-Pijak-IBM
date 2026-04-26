"use client";
import { User, ShoppingCart, Search, Package, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingHeader() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [openCategory, setOpenCategory] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    const savedCat = JSON.parse(localStorage.getItem("categories")) || [];
    const savedSub = JSON.parse(localStorage.getItem("subcategories")) || {};

    // 🔥 MERGE CATEGORY
    const mergedCategories = [...new Set([...defaultCategories, ...savedCat])];

    // 🔥 MERGE SUBCATEGORY
    const mergedSub = { ...defaultSubcategories };

    Object.keys(savedSub).forEach((key) => {
      mergedSub[key] = [...(mergedSub[key] || []), ...savedSub[key]];

      // 🔥 HAPUS DUPLIKAT
      mergedSub[key] = [...new Set(mergedSub[key])];
    });

    setCategories(mergedCategories);
    setSubcategories(mergedSub);
  }, []);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const getPreviewProducts = () => {
    if (!activeCategory || !activeSub) return [];

    return products
      .filter(
        (p) =>
          p.category?.toLowerCase() === activeCategory.toLowerCase() &&
          p.subcategory?.toLowerCase() === activeSub.toLowerCase(),
      )
      .slice(0, 4); // 🔥 maksimal 4 item kayak Xiaomi
  };

  // 🔥 LOAD PRODUCTS
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productsMaster")) || [];
    setProducts(data);
  }, []);

  useEffect(() => {
    if (!search) return setResults([]);

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );

    setResults(filtered.slice(0, 5));
  }, [search, products]);

  // 🔥 USER
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("currentUser"));
    setUser(data);
  }, []);

  // 🔥 CART
  useEffect(() => {
    const loadCart = () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) return setCartCount(0);

      const cart =
        JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];

      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(total);
    };

    // 🔥 load pertama
    loadCart();

    // 🔥 listen event dari halaman lain
    window.addEventListener("ordersUpdated", loadCart);

    return () => {
      window.removeEventListener("ordersUpdated", loadCart);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // 🔥 hapus session saja
    setUser(null);
    router.push("/login");
  };

  const defaultCategories = [
    "Electronics",
    "Furniture",
    "Camera",
    "Skincare",
    "Audio",
  ];

  const defaultSubcategories = {
    electronics: ["mobile", "laptop", "tv"],
    furniture: ["chairs", "tables"],
    camera: ["dslr", "mirrorless"],
    skincare: ["serum", "sunscreen"],
    audio: ["headphones", "speakers"],
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white text-black shadow sticky top-0 z-50">
      {/* 🔥 LEFT */}
      <div className="flex items-center gap-8">
        {/* LOGO */}
        <div
          onClick={() => router.push("/user/landingpages")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative w-10 h-10 bg-gray-300 rounded-md overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500">
            {/* LOGO */}
            <img
              src="/images/logo.png"
              className="w-6 h-6 object-contain transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0"
            />

            {/* HOME ICON */}
            <Home
              size={20}
              className="absolute text-white opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            />
          </div>

          <span className="font-bold text-lg">Lytro</span>
        </div>

        {/* MENU */}
        <div className="flex gap-6 text-sm">
          <span
            onClick={() => router.push("/user/StorePage")}
            className="cursor-pointer hover:text-orange-500"
          >
            Store
          </span>

          <span
            onClick={() => router.push("/support")}
            className="cursor-pointer hover:text-orange-500"
          >
            Support
          </span>
        </div>

        <div className="relative">
          <span
            onClick={() => {
              setOpenCategory(!openCategory);
              setOpenUser(false);
              setSelectedCategory(null);
              setSelectedSub(null);
            }}
            className="cursor-pointer hover:text-orange-500"
          >
            Category
          </span>

          {openCategory && (
            <div className="fixed left-0 top-[70px] w-full bg-white shadow-2xl z-50 px-16 py-10 flex gap-12">
              {/* 🔥 LEFT */}
              <div className="w-1/4 border-r pr-6">
                {categories.map((cat, i) => (
                  <div key={i} className="mb-6">
                    {/* CATEGORY */}
                    <p
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSub(null);
                      }}
                      className={`font-semibold text-lg cursor-pointer ${
                        selectedCategory === cat
                          ? "text-orange-500"
                          : "text-gray-800 hover:text-orange-500"
                      }`}
                    >
                      {cat}
                    </p>

                    {/* SUBCATEGORY (MUNCUL SETELAH CLICK) */}
                    {selectedCategory === cat && (
                      <div className="ml-3 mt-2 space-y-2">
                        {(subcategories[cat.toLowerCase()] || []).map(
                          (sub, j) => (
                            <p
                              key={j}
                              onClick={() => setSelectedSub(sub)}
                              className={`text-sm cursor-pointer ${
                                selectedSub === sub
                                  ? "text-orange-500 font-semibold"
                                  : "text-gray-500 hover:text-orange-500"
                              }`}
                            >
                              {sub}
                            </p>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 🔥 RIGHT */}
              <div className="w-3/4">
                {selectedSub ? (
                  <>
                    <div className="grid grid-cols-4 gap-6">
                      {products
                        .filter(
                          (p) =>
                            p.category?.toLowerCase() ===
                              selectedCategory.toLowerCase() &&
                            p.subcategory?.toLowerCase() ===
                              selectedSub.toLowerCase(),
                        )
                        .slice(0, 4)
                        .map((p, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              router.push(
                                `/user/ProductDetails/${encodeURIComponent(p.name)}`,
                              )
                            }
                            className="cursor-pointer group"
                          >
                            <div className="bg-gray-100 rounded-2xl p-6 mb-3 group-hover:shadow-xl transition">
                              <img
                                src={p.image}
                                className="h-32 mx-auto object-contain"
                              />
                            </div>

                            <p className="text-sm font-medium text-center">
                              {p.name}
                            </p>
                          </div>
                        ))}
                    </div>

                    {/* 🔥 BUTTON */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/user/category/${selectedCategory.toLowerCase()}?sub=${selectedSub}`,
                          )
                        }
                        className="px-6 py-2 border rounded-full hover:bg-orange-500 hover:text-white transition"
                      >
                        Lihat semua
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center mt-20 text-lg">
                    Pilih sub category
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 RIGHT */}
      <div className="flex items-center gap-6 relative">
        {/* 🔍 SEARCH */}
        <div className="relative">
          <Search
            onClick={() => setShowSearch(!showSearch)}
            className="cursor-pointer hover:text-orange-500"
          />

          {showSearch && (
            <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-xl p-3 border">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full border px-3 py-2 rounded-lg mb-2"
              />

              {results.length === 0 ? (
                <p className="text-gray-400 text-sm">Tidak ditemukan</p>
              ) : (
                results.map((item, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      router.push(
                        `/user/ProductDetails/${encodeURIComponent(item.name)}`,
                      )
                    }
                    className="flex gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <img
                      src={item.image}
                      className="w-10 h-10 object-contain"
                    />
                    <div className="text-sm">
                      <p>{item.name}</p>
                      <p className="text-gray-400 text-xs">
                        Rp{item.selling?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🛒 CART */}
        <div className="relative">
          <ShoppingCart
            onClick={() => router.push("/user/CartPage")}
            className="cursor-pointer hover:text-orange-500"
          />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1 rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* 📦 ORDERS */}
        <div className="relative">
          <Package
            onClick={() => router.push("/user/OrdersPage")}
            className="cursor-pointer hover:text-orange-500"
          />
        </div>

        {/* 👤 USER */}
        <div className="relative">
          <User
            onClick={() => {
              setOpenUser(!openUser);
              setOpenCategory(false); // 🔥 tutup category kalau buka user
            }}
            className="cursor-pointer hover:text-orange-500"
          />

          {openUser && (
            <div className="absolute right-0 mt-3 w-44 bg-white shadow-xl rounded-xl p-3 border">
              {!user || !user.isLogin ? (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 font-semibold border-b">
                    {user.username}
                  </div>

                  <button
                    onClick={() => router.push("/support/MyAccount")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => router.push("/user/OrdersPage")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={() => {
                      const currentUser = JSON.parse(
                        localStorage.getItem("currentUser"),
                      );

                      if (currentUser) {
                        const updatedUser = { ...currentUser, isLogin: false };

                        localStorage.setItem(
                          "user",
                          JSON.stringify(updatedUser),
                        );
                      }

                      setUser(null);
                      router.push("/login");
                    }}
                    className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
