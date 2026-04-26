"use client";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // =========================
    // 🔥 LOAD CATEGORY
    // =========================
    const loadCategories = () => {
      const stored = JSON.parse(localStorage.getItem("categories")) || [];

      const defaultCategories = [
        "Electronics",
        "Furniture",
        "Camera",
        "Skincare",
        "Audio",
        "Sports",
        "Books",
      ];

      setCategories(stored.length > 0 ? stored : defaultCategories);
    };

    // =========================
    // 🔥 LOAD BRAND (DINAMIS)
    // =========================
    const loadBrands = () => {
      const stored = JSON.parse(localStorage.getItem("brands")) || {};

      let allBrands = [];

      // 🔥 flatten object → array
      Object.values(stored).forEach((sub) => {
        Object.values(sub).forEach((arr) => {
          allBrands = [...allBrands, ...arr];
        });
      });

      // 🔥 remove duplicate + sort
      const uniqueBrands = [...new Set(allBrands)].sort();

      const defaultBrands = ["Xiaomi", "Samsung", "Apple", "Huawei", "IKEA"];

      setBrands(uniqueBrands.length > 0 ? uniqueBrands : defaultBrands);
    };

    // INIT LOAD
    loadCategories();
    loadBrands();

    // =========================
    // 🔥 REALTIME SYNC
    // =========================
    window.addEventListener("categoriesUpdated", loadCategories);
    window.addEventListener("brandsUpdated", loadBrands);

    return () => {
      window.removeEventListener("categoriesUpdated", loadCategories);
      window.removeEventListener("brandsUpdated", loadBrands);
    };
  }, []);

  return (
    <footer className="bg-[#0f0f0f] text-gray-300 px-10 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* 🔥 KATEGORI */}
        <div>
          <h3 className="text-white font-semibold mb-4">Kategori</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((cat, index) => (
              <li
                key={index}
                onClick={() =>
                  router.push(`/user/category/${cat.toLowerCase()}`)
                }
                className="hover:text-white cursor-pointer transition"
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* TEAM */}
        <div>
          <h3 className="text-white font-semibold mb-4">Team</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Haerul Algifar</li>
            <li className="hover:text-white cursor-pointer">
              Dio Abiyyu Zidane Ginting
            </li>
            <li className="hover:text-white cursor-pointer">
              Eric Yedija Sinaga
            </li>
            <li className="hover:text-white cursor-pointer">
              Erlangga Pradana Kurniawan
            </li>
            <li className="hover:text-white cursor-pointer">Naufal Helmy</li>
          </ul>
        </div>

        {/* 🔥 BRAND DINAMIS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Brand</h3>
          <ul className="space-y-2 text-sm">
            {brands.slice(0, 8).map((brand, index) => (
              <li
                key={index}
                onClick={() =>
                  router.push(`/user/brand/${brand.toLowerCase()}`)
                }
                className="hover:text-white cursor-pointer transition"
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>

        {/* TENTANG */}
        <div>
          <h3 className="text-white font-semibold mb-4">Tentang</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Tentang kita</li>
            <li className="hover:text-white cursor-pointer">Leadership Team</li>
            <li className="hover:text-white cursor-pointer">
              Kebijakan privasi
            </li>
            <li className="hover:text-white cursor-pointer">
              Integrity & Compliance
            </li>
            <li className="hover:text-white cursor-pointer">Trust Center</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-white font-semibold mb-4">Ikuti sosial media</h3>

          <div className="flex gap-4 mb-6">
            <div className="bg-[#1a1a1a] p-2 rounded-full hover:bg-gray-700 cursor-pointer">
              <FaLinkedin size={18} />
            </div>
            <div className="bg-[#1a1a1a] p-2 rounded-full hover:bg-gray-700 cursor-pointer">
              <FaInstagram size={18} />
            </div>
            <div className="bg-[#1a1a1a] p-2 rounded-full hover:bg-gray-700 cursor-pointer">
              <FaGithub size={18} />
            </div>
          </div>

          <hr className="border-gray-700 mb-4" />
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-700 mt-12 pt-6 flex justify-between text-sm text-gray-400">
        <p>Copyright © 2026 Lytro. All Rights Reserved</p>
      </div>
    </footer>
  );
}
