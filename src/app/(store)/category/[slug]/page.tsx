"use client";
import Link from "next/link";
import { CATEGORIES } from "../../../../lib/data";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const resolvedParams = params;

  const category = CATEGORIES.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  // Dummy products based on category
  const getDummyProducts = (slug: string) => {
    switch (slug) {
      case "sepatu":
        return [
          {
            id: 1,
            brand: "Jordan",
            name: "Air Jordan 1 Retro",
            description: "OG High University Blue",
            price: 2499000,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
          },
          {
            id: 2,
            brand: "Yeezy",
            name: "Yeezy Boost 350",
            description: "V2 Semi Frozen Yellow",
            price: 3500000,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200",
          },
          {
            id: 3,
            brand: "Nike",
            name: "Nike VaporMax",
            description: "Off-White White 2018",
            price: 5800000,
            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200",
          },
          {
            id: 4,
            brand: "Adidas",
            name: "Adidas NMD R1",
            description: "Pharrell Williams Human Race",
            price: 4200000,
            image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1200",
          },
        ];
      case "tas":
        return [
          {
            id: 101,
            brand: "Gucci",
            name: "GG Marmont Shoulder Bag",
            description: "Matelassé chevron leather",
            price: 28500000,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200",
          },
          {
            id: 102,
            brand: "Prada",
            name: "Re-Edition 2005",
            description: "Saffiano leather bag",
            price: 22000000,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200",
          },
          {
            id: 103,
            brand: "Louis Vuitton",
            name: "Neverfull MM",
            description: "Damier Ebene canvas",
            price: 31000000,
            image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1200",
          },
        ];
      case "baju":
        return [
          {
            id: 201,
            brand: "Supreme",
            name: "Box Logo Tee",
            description: "Classic White T-Shirt",
            price: 1500000,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200",
          },
          {
            id: 202,
            brand: "Off-White",
            name: "Caravaggio Hoodie",
            description: "Graphic Print Black Hoodie",
            price: 8500000,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200",
          },
          {
            id: 203,
            brand: "Balenciaga",
            name: "Oversized Shirt",
            description: "Striped Cotton Poplin",
            price: 12000000,
            image: "https://images.unsplash.com/photo-1596755094514-f87034a264c6?w=1200",
          },
        ];
      case "celana":
        return [
          {
            id: 301,
            brand: "Levi's",
            name: "501 Original Fit",
            description: "Straight Leg Blue Jeans",
            price: 1200000,
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200",
          },
          {
            id: 302,
            brand: "Dickies",
            name: "874 Work Pants",
            description: "Classic Khaki Trousers",
            price: 850000,
            image: "https://images.unsplash.com/photo-1624371414361-e67094c2496a?w=1200",
          },
        ];
      case "tali-pinggang":
        return [
          {
            id: 401,
            brand: "Hermès",
            name: "H Belt Kit",
            description: "Reversible Leather Belt",
            price: 15000000,
            image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=1200",
          },
          {
            id: 402,
            brand: "Gucci",
            name: "Double G Buckle Belt",
            description: "Black Leather with Gold Hardware",
            price: 8500000,
            image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200",
          },
        ];
      default:
        return [
          {
            id: 999,
            brand: "Lumina",
            name: "Coming Soon",
            description: "New collection arriving shortly",
            price: 0,
            image: category.image,
          },
        ];
    }
  };

  const categoryProducts = getDummyProducts(resolvedParams.slug);

  const [currentIndex, setCurrentIndex] = useState(0);
  const brands = ["All", ...new Set(categoryProducts.map(p => p.brand))];

  const [selectedBrand, setSelectedBrand] = useState("All");
  const filteredProducts =
    selectedBrand === "All"
      ? categoryProducts
      : categoryProducts.filter((product) => product.brand === selectedBrand);

  const nextSlide = () => {
    if (categoryProducts.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % categoryProducts.length);
  };

  const prevSlide = () => {
    if (categoryProducts.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? categoryProducts.length - 1 : prev - 1,
    );
  };

  return (
    <div className="bg-white min-h-screen text-[#111] overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen border-b border-black">
        {/* HUGE BACKGROUND TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <h1
            className="
              text-[24vw]
              font-black
              uppercase
              tracking-[-0.08em]
              text-[#f1f1f1]
              leading-none
              select-none
            "
          >
            {category.name}
          </h1>
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={prevSlide}
          className="
    absolute
    left-8
    top-1/2
    -translate-y-1/2
    z-20
    w-16
    h-16
    border
    border-black/20
    bg-white/80
    backdrop-blur-md
    flex
    items-center
    justify-center
    hover:bg-black
    hover:text-white
    transition-all
    duration-300
  "
        >
          <ChevronLeft size={34} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={nextSlide}
          className="
    absolute
    right-8
    top-1/2
    -translate-y-1/2
    z-20
    w-16
    h-16
    border
    border-black/20
    bg-white/80
    backdrop-blur-md
    flex
    items-center
    justify-center
    hover:bg-black
    hover:text-white
    transition-all
    duration-300
  "
        >
          <ChevronRight size={34} />
        </button>

        {/* MAIN CONTENT */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 -mt-20">
          {" "}
          {/* PRODUCT IMAGE */}
          <div className="w-full flex justify-center">
            {categoryProducts[currentIndex] && (
              <img
                src={categoryProducts[currentIndex].image}
                alt={categoryProducts[currentIndex].name}
                className="
                  w-full
                  max-w-3xl
                  object-contain
                  drop-shadow-2xl
                  transition-all
                  duration-700
                  hover:scale-105
                "
              />
            )}
          </div>
          {/* PRODUCT INFO */}
          <div className="mt-4 text-center">
            <p
              className="
                uppercase
                tracking-[0.5em]
                text-[10px]
                font-bold
                text-gray-500
                mb-4
              "
            >
              Featured Product
            </p>

            <h2
              className="
                text-5xl
                md:text-6xl
                font-black
                uppercase
                italic
                tracking-tight
              "
            >
              {categoryProducts[currentIndex]?.name || "Product Name"}
            </h2>

            <p className="mt-5 text-gray-500 text-lg">
              {categoryProducts[currentIndex]?.description || "Product Description"}
            </p>

            <p
              className="
                mt-6
                text-2xl
                font-black
                italic
              "
            >
              Rp
              {categoryProducts[currentIndex]?.price.toLocaleString("id-ID") || 0}
            </p>
          </div>
          {/* SLIDER INDICATOR */}
          <div
            className="
              absolute
              bottom-10
              left-10
              flex
              items-center
              gap-5
            "
          >
            <span
              className="
                text-2xl
                font-black
                italic
              "
            >
              {String(currentIndex + 1).padStart(2, "0")}
            </span>

            <div className="w-40 h-[2px] bg-gray-200 relative">
              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  bg-black
                  transition-all
                  duration-500
                "
                style={{
                  width: `${
                    ((currentIndex + 1) / categoryProducts.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROMO SECTION */}
      {categoryProducts.length >= 2 && (
        <section className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
          {/* LEFT */}
          <div
            className="
              border-r
              border-black
              p-10
              md:p-20
              flex
              flex-col
              md:flex-row
              items-center
              gap-10
              group
              hover:bg-[#fafafa]
              transition
            "
          >
            <div className="flex-1 flex justify-center">
              <img
                src={categoryProducts[0].image}
                className="
                  w-72
                  h-72
                  object-contain
                  group-hover:scale-110
                  transition
                  duration-500
                "
              />
            </div>

            <div className="flex-1">
              <p className="uppercase tracking-[0.4em] text-xs text-gray-400 mb-3">
                New Collection
              </p>

              <h3
                className="
                  text-5xl
                  font-black
                  uppercase
                  italic
                  leading-none
                  mb-6
                "
              >
                New Releases
              </h3>

              <button
                className="
                  bg-black
                  text-white
                  px-8
                  py-4
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  hover:bg-zinc-800
                  transition
                "
              >
                View All
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
              p-10
              md:p-20
              flex
              flex-col
              md:flex-row-reverse
              items-center
              gap-10
              group
              hover:bg-[#fafafa]
              transition
            "
          >
            <div className="flex-1 flex justify-center">
              <img
                src={categoryProducts[1].image}
                className="
                  w-72
                  h-72
                  object-contain
                  group-hover:scale-110
                  transition
                  duration-500
                "
              />
            </div>

            <div className="flex-1">
              <p className="uppercase tracking-[0.4em] text-xs text-gray-400 mb-3">
                Trending Now
              </p>

              <h3
                className="
                  text-5xl
                  font-black
                  uppercase
                  italic
                  leading-none
                  mb-6
                "
              >
                Price Drop
              </h3>

              <button
                className="
                  bg-black
                  text-white
                  px-8
                  py-4
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  hover:bg-zinc-800
                  transition
                "
              >
                Explore
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS GRID */}
      <section className="py-24">
        <div className="text-center mb-20">
          <p
            className="
              uppercase
              tracking-[0.5em]
              text-xs
              text-gray-400
              mb-4
            "
          >
            Collection
          </p>

          <h2
            className="
              text-6xl
              font-black
              uppercase
              italic
            "
          >
            Best Sellers
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            border-t
            border-l
            border-black
            mx-6
          "
        >
          {categoryProducts.map((product) => (
            <div
              key={product.id}
              className="
                border-r
                border-b
                border-black
                p-10
                group
                hover:bg-[#fafafa]
                transition-all
                duration-500
              "
            >
              <div className="h-72 flex items-center justify-center mb-10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    max-h-full
                    object-contain
                    group-hover:scale-110
                    transition
                    duration-700
                  "
                />
              </div>

              <div className="text-center">
                <h3
                  className="
                    uppercase
                    tracking-[0.2em]
                    text-xs
                    text-gray-500
                    mb-3
                  "
                >
                  {product.name}
                </h3>

                <p
                  className="
                    text-lg
                    font-black
                    italic
                  "
                >
                  Rp
                  {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <button
            className="
              bg-black
              text-white
              px-12
              py-4
              uppercase
              tracking-[0.3em]
              text-xs
              hover:bg-zinc-800
              transition
            "
          >
            View All Products
          </button>
        </div>
      </section>

      {/* SEARCH BY BRAND */}
      <section className="py-24 border-t border-black">
        <div className="text-center mb-14">
          <p
            className="
        uppercase
        tracking-[0.5em]
        text-xs
        text-gray-400
        mb-4
      "
          >
            Featured
          </p>

          <h2
            className="
        text-6xl
        font-black
        uppercase
        italic
      "
          >
            Search By Brand
          </h2>
        </div>

        {/* BRAND TABS */}
        <div
          className="
      flex
      justify-center
      flex-wrap
      border-t
      border-l
      border-black
      mx-6
    "
        >
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`
          flex-1
          min-w-[140px]
          border-r
          border-b
          border-black
          px-8
          py-5
          uppercase
          text-xs
          tracking-[0.3em]
          font-bold
          transition-all
          duration-300

          ${
            selectedBrand === brand
              ? "bg-black text-white"
              : "bg-white hover:bg-[#f7f7f7]"
          }
        `}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div
          className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      border-l
      border-black
      mx-6
    "
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="
          border-r
          border-b
          border-black
          p-10
          group
          hover:bg-[#fafafa]
          transition-all
          duration-500
        "
            >
              {/* IMAGE */}
              <div className="h-72 flex items-center justify-center mb-10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="
              max-h-full
              object-contain
              group-hover:scale-110
              transition
              duration-700
            "
                />
              </div>

              {/* INFO */}
              <div className="text-center">
                <p
                  className="
              text-[10px]
              uppercase
              tracking-[0.4em]
              text-gray-400
              mb-3
            "
                >
                  {product.brand}
                </p>

                <h3
                  className="
              uppercase
              tracking-[0.15em]
              text-sm
              font-bold
              mb-3
            "
          >
                  {product.name}
                </h3>

                <p
                  className="
              text-lg
              font-black
              italic
            "
                >
                  Rp
                  {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <Link href={`/category/brand/${selectedBrand.toLowerCase()}`}>
            <button
              className="
        bg-black
        text-white
        px-12
        py-4
        uppercase
        tracking-[0.3em]
        text-xs
        hover:bg-zinc-800
        transition
      "
            >
              View {selectedBrand}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
