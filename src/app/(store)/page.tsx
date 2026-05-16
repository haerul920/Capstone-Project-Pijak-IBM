"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  Truck,
  CreditCard,
  Headphones,
} from "lucide-react";
import Link from "next/link";

import { useCart } from "../../lib/CartContext";

import { CATEGORIES } from "../../lib/data";
import ProductCard from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../../lib/supabase";
import StoreReviews from "../components/StoreReviews";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { formatIDR } from "../components/ui/utils";

export default function StorefrontHome() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const { addToCart } = useCart();

  useEffect(() => {
    if (!isLoaded) return;
    const role =
      (user?.publicMetadata?.role as string) ||
      (user?.unsafeMetadata?.role as string);
    if (user && role?.toLowerCase() === "admin") {
      router.push("/admin");
    }
  }, [isLoaded, user, router]);

  const [products, setProducts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fashionCategories = [
    {
      name: "Tali Pinggang",
      image:
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800",
    },
    {
      name: "Sepatu",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    },
    {
      name: "Tas",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    },
    {
      name: "Baju",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    },
    {
      name: "Celana",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    },
    {
      name: "Jam Tangan",
      image:
        "https://i.pinimg.com/1200x/1f/a8/a9/1fa8a9ba3cb66ef414672da90e085906.jpg",
    },
    {
      name: "Sepatu",
      image:
        "https://i.pinimg.com/736x/dc/02/ee/dc02ee783dfed251d5678d9ec2cf7e36.jpg",
    },
  ];

  // State untuk menentukan index yang sedang di tengah
  const [currentIndex, setCurrentIndex] = useState(2); // Mulai dari 'Tas' (index 2) agar seimbang

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % fashionCategories.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + fashionCategories.length) % fashionCategories.length,
    );
  };

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      // Add mock sales data for featured section
      const enhancedData = (data || []).map((p, i) => ({
        ...p,
        sales_count: p.sales_count || 100 - i * 15, // Mocking best sellers
      }));

      setProducts(enhancedData);
    };

    fetchProducts();
  }, []);

  // HERO SLIDES
  const slides = [
    {
      title: "LUMINA SPRING 2026",
      desc: "Keanggunan modern dengan sentuhan minimalis premium",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
    },

    {
      title: "NEW FASHION ARRIVALS",
      desc: "Eksplorasi koleksi terbaru untuk gaya yang lebih elegan",
      image:
        "https://i.pinimg.com/1200x/8c/55/db/8c55db0cd1c87a68d04ecbcf1799a9b7.jpg",
    },

    {
      title: "TIMELESS LUXURY",
      desc: "Dirancang untuk gaya hidup modern dan eksklusif",
      image:
        "https://i.pinimg.com/1200x/6c/ad/68/6cad687a32cfcc7eaa0976d0e647d88b.jpg",
    },
  ];

  const springCollection = [
    {
      id: "spring-1",
      name: "Cotton Linen Shirt",
      category: "Baju",
      description: "Kemeja linen katun ringan yang sempurna untuk musim semi.",
      price: 459000,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    },
    {
      id: "spring-2",
      name: "Spring Floral Dress",
      category: "Baju",
      description: "Gaun floral cantik dengan bahan jatuh yang nyaman.",
      price: 799000,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
    },
    {
      id: "spring-3",
      name: "Lightweight Trench Coat",
      category: "Baju",
      description: "Coat ringan untuk melindungi dari angin musim semi.",
      price: 1299000,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    },
    {
      id: "spring-4",
      name: "Casual Canvas Sneakers",
      category: "Sepatu",
      description: "Sepatu kanvas santai untuk jalan-jalan sore.",
      price: 549000,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
    },
  ];

  // DUMMY DATA FOR SECTIONS
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: "Nike Luka 5 PF",
      description: "Sepatu basket terbaik dengan teknologi terkini",
      price: 2500000,
      image:
        "https://i.pinimg.com/1200x/8f/a2/04/8fa2048afc1152b77f5ffed6e6201e9c.jpg",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Poco Pad X1",
      description: "Tablet modern dengan performa premium",
      price: 7300000,
      image:
        "https://i.pinimg.com/webp80/736x/b1/b4/7f/b1b47f33ed75383583951f65afa9d151.webp",
      rating: 4.8,
    },
    {
      id: 3,
      name: "iPhone 15 Pro",
      description: "Desain elegan dengan performa flagship terbaru",
      price: 18900000,
      image:
        "https://i.pinimg.com/736x/6c/a7/51/6ca7514032f3642148cf6f4ac930ae96.jpg",
      rating: 4.9,
    },
  ];

  const newArrivals = [
    {
      id: "new-1",
      name: "ZARA Oversized Blazer",
      category: "Baju",
      description: "Blazer oversized dengan potongan premium.",
      price: 2499000,
      rating: 4.8,
      image:
        "https://static.pullandbear.net/2/photos//2024/V/0/1/p/4711/534/800/4711534800_2_1_8.jpg?t=1706271253456",
    },
    {
      id: "new-2",
      name: "H&M Premium Tee",
      category: "Baju",
      description: "Kaos premium katun kualitas terbaik.",
      price: 349000,
      rating: 4.6,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fbc%2F8a%2Fbc8a4d4a8e3d0d5d6d6d4d1d2d3d4d5d6d7d8d9d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeved%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      id: "new-3",
      name: "Streetwear Cargo Pants",
      category: "Celana",
      description: "Celana cargo dengan gaya streetwear modern.",
      price: 899000,
      rating: 4.7,
      image:
        "https://static.pullandbear.net/2/photos//2024/V/0/2/p/5688/511/400/5688511400_2_1_8.jpg?t=1705658145678",
    },
    {
      id: "new-4",
      name: "Minimalist Hoodie",
      category: "Baju",
      description: "Hoodie minimalis dengan bahan fleece lembut.",
      price: 599000,
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=source%5B%2F09%2F78%2F0978931a238618f3a38d6f698371391e65893d6e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
  ];

  const luxuryProducts = [
    {
      id: "lux-1",
      name: "Rolex Submariner",
      category: "Aksesoris",
      description: "Jam tangan ikonik untuk pria sejati.",
      price: 285000000,
      rating: 5.0,
      image:
        "https://images.rolex.com/2024/media/watches/submariner/m126610ln-0001/m126610ln-0001_drp-upright.png?impolicy=upright-majesty",
    },
    {
      id: "lux-2",
      name: "Gucci Horsebit Bag",
      category: "Tas",
      description: "Tas tangan mewah dengan detail ikonik.",
      price: 48000000,
      rating: 4.9,
      image:
        "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1602690903/636703_HUHHG_8565_001_100_0000_Light-Jackie-1961-small-shoulder-bag.jpg",
    },
    {
      id: "lux-3",
      name: "Prada Leather Jacket",
      category: "Baju",
      description: "Jaket kulit premium dengan finishing mewah.",
      price: 65000000,
      rating: 4.9,
      image:
        "https://www.prada.com/content/dam/pradabkg_products/S/SGV/SGV126/1ZCYF0002/SGV126_1ZCY_F0002_S_222_SLF.jpg/_jcr_content/renditions/cq5dam.web.hf-low.800.800.at.jpg",
    },
    {
      id: "lux-4",
      name: "Louis Vuitton Keepall",
      category: "Tas",
      description: "Tas travel mewah untuk perjalanan berkelas.",
      price: 35000000,
      rating: 4.8,
      image:
        "https://images.louisvuitton.com/is/image/louisvuitton/M41414_PM2_Front%20view?wid=800&hei=800",
    },
  ];

  const saleProducts = [
    {
      id: 1,
      name: "Nike Air Max 90",
      price: 1200000,
      oldPrice: 1800000,
      image:
        "https://static.nike.com/a/images/t_PDP_864_v1,f_auto,q_auto:eco/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/195449c9-8e11-4613-90ff-7f31e81540ee/AIR+MAX+90+QS.png",
    },
    {
      id: 2,
      name: "Nike Advantage",
      price: 850000,
      oldPrice: 1200000,
      image:
        "https://static.nike.com/a/images/t_PDP_864_v1,f_auto,q_auto:eco/b04edba2-ded4-4a96-b73e-9accfb42602c/AS+W+NKCT+DF+ADVTG+MR+PANT.png",
    },
    {
      id: 3,
      name: "Nike Pegasus 42",
      price: 950000,
      oldPrice: 1500000,
      image:
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a18b5509-5147-4d1b-ab17-7635648698f8/W+NIKE+AIR+ZOOM+PEGASUS+42.png",
    },
  ];

  const HeroProductCard = ({
    product,
    badge,
  }: {
    product: any;
    badge: string;
  }) => (
    <div className="group relative bg-white rounded-[32px] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[4/5] bg-zinc-50 overflow-hidden p-8">
        <div className="absolute top-4 left-4 z-20">
          <span
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${
              badge === "NEW"
                ? "bg-black"
                : badge === "LUXURY"
                  ? "bg-gradient-to-r from-amber-600 to-yellow-500"
                  : "bg-orange-500"
            }`}
          >
            {badge}
          </span>
        </div>
        <Link
          href={`/product/${product.id}`}
          className="block w-full h-full group-hover:scale-110 transition-transform duration-700"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </Link>
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-orange-400">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-black">
                {product.rating || "4.5"}
              </span>
            </div>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-lg font-black text-black leading-tight hover:text-orange-500 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-400 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="pt-4 border-t border-zinc-50 flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-black">
            {formatIDR(product.price)}
          </span>
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
              })
            }
            className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-lg"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="relative w-full h-[650px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-[1800px] mx-auto px-12 w-full">
            <div className="max-w-3xl text-white space-y-8">
              <div className="overflow-hidden">
                <p className="text-xs font-black uppercase tracking-[0.5em] mb-4 animate-in slide-in-from-bottom duration-700">
                  Lumina Exclusive 2026
                </p>
                <h1 className="text-[100px] leading-[0.9] font-black uppercase tracking-tighter animate-in slide-in-from-bottom duration-1000">
                  {slides[currentSlide].title.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className={i % 2 === 1 ? "text-zinc-400" : ""}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </h1>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-white/70 max-w-xl font-medium leading-relaxed animate-in slide-in-from-bottom duration-1000 delay-300">
                  {slides[currentSlide].desc}
                </p>

                {/* HERO COLLECTION INFO */}
                <div className="space-y-1 animate-in slide-in-from-bottom duration-1000 delay-400">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-white/20"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 animate-in slide-in-from-bottom duration-1000 delay-500">
                <Link href="/store">
                  <Button className="bg-white text-black hover:bg-zinc-200 px-10 py-8 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/store?sortBy=best_seller">
                  <Button
                    variant="outline"
                    className="border-white/30 text-black hover:bg-zinc-200 px-10 py-8 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm"
                  >
                    View Trending
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 z-30 flex items-center gap-6">
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 rounded-full h-1.5 ${currentSlide === index ? "w-12 bg-white" : "w-3 bg-white/30"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentSlide(
                  currentSlide === 0 ? slides.length - 1 : currentSlide - 1,
                )
              }
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-md"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((currentSlide + 1) % slides.length)
              }
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-all shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 overflow-hidden border-b border-zinc-100">
        <div className="max-w-[1800px] mx-auto px-12">
          <div className="flex flex-col gap-12">
            <div
              className={`transition-all duration-1000 transform ${currentSlide === 0 || currentSlide === 1 || currentSlide === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex items-end justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[2px] bg-black"></div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                      Featured Collections
                    </span>
                  </div>
                  <h2 className="text-6xl font-black text-black tracking-tighter uppercase leading-none">
                    {currentSlide === 1
                      ? "New Arrivals"
                      : currentSlide === 2
                        ? "Luxury Series"
                        : "LUMINA Collection"}
                  </h2>
                  <p className="text-zinc-500 font-medium text-sm">
                    {currentSlide === 1
                      ? "Koleksi terbaru yang baru saja hadir minggu ini."
                      : currentSlide === 2
                        ? "Barang-barang premium yang tidak pernah kehilangan nilai dan gaya."
                        : "Kesegaran musim baru dengan kenyamanan koleksi linen dan katun pilihan."}
                  </p>
                </div>
                <Link
                  href="/store"
                  className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-black hover:opacity-60 transition-all"
                >
                  Browse All{" "}
                  <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                  </div>
                </Link>
              </div>
            </div>

            <div className="relative h-[550px]">
              <div
                className={`grid grid-cols-4 gap-8 absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${currentSlide === 1 ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-20 pointer-events-none"}`}
              >
                {newArrivals.map((product) => (
                  <HeroProductCard
                    key={product.id}
                    product={product}
                    badge="NEW"
                  />
                ))}
              </div>

              <div
                className={`grid grid-cols-4 gap-8 absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${currentSlide === 2 ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-20 pointer-events-none"}`}
              >
                {luxuryProducts.map((product) => (
                  <HeroProductCard
                    key={product.id}
                    product={product}
                    badge="LUXURY"
                  />
                ))}
              </div>

              <div
                className={`grid grid-cols-4 gap-8 absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${currentSlide === 0 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-20 pointer-events-none"}`}
              >
                {springCollection.map((product) => (
                  <HeroProductCard
                    key={product.id}
                    product={product}
                    badge="SPRING"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 overflow-hidden bg-[#ffffff]">
        <div className="max-w-[1800px] mx-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between px-12 mb-16">
            <h2
              className="
                  text-[60px]
                  leading-none
                  font-black
                  uppercase
                  tracking-[1px]
                  text-black
                "
              style={{
                fontFamily: "'League Spartan', sans-serif",
              }}
            >
              Categories
            </h2>
            <div className="flex items-center gap-4">
              {/* LEFT */}
              <button
                onClick={prevSlide}
                className="
      w-14
      h-14
      rounded-full
      flex
      items-center
      justify-center
      text-black
      transition-all
      duration-300
      active:scale-95
    "
                style={{
                  background: "#ececec",
                  border: "1px solid rgba(0, 0, 0, 0.17)",
                  boxShadow: `
        inset -4px -4px 8px rgba(255,255,255,0.9),
        inset 4px 6px 10px rgba(0,0,0,0.18),
        0 6px 16px rgba(0,0,0,0.08)
      `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#dcdcdc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ececec";
                }}
              >
                <ChevronLeft size={22} />
              </button>

              {/* RIGHT */}
              <button
                onClick={nextSlide}
                className="
      w-14
      h-14
      rounded-full
      flex
      items-center
      justify-center
      text-black
      transition-all
      duration-300
      active:scale-95
    "
                style={{
                  background: "#ececec",
                  border: "1px solid rgba(0, 0, 0, 0.17)",
                  boxShadow: `
        inset -4px -4px 8px rgba(255,255,255,0.9),
        inset 4px 6px 10px rgba(0,0,0,0.18),
        0 6px 16px rgba(0,0,0,0.08)
      `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#dcdcdc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ececec";
                }}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* CAROUSEL */}
          <div className="relative flex items-center justify-center h-[480px]">
            {fashionCategories.map((item, index) => {
              let position = index - currentIndex;
              if (position < -2) position += fashionCategories.length;
              if (position > 2) position -= fashionCategories.length;

              const isCenter = position === 0;
              const isHidden = Math.abs(position) > 1;

              const xMap: Record<number, number> = {
                [-2]: -580,
                [-1]: -320,
                [0]: 0,
                [1]: 320,
                [2]: 580,
              };
              const wMap: Record<number, number> = {
                [-2]: 200,
                [-1]: 240,
                [0]: 360,
                [1]: 240,
                [2]: 200,
              };
              const hMap: Record<number, number> = {
                [-2]: 200,
                [-1]: 260,
                [0]: 360,
                [1]: 260,
                [2]: 200,
              };
              const zMap: Record<number, number> = {
                [-2]: 1,
                [-1]: 2,
                [0]: 5,
                [1]: 2,
                [2]: 1,
              };

              const translateX = xMap[position] ?? 0;
              const width = wMap[position] ?? 200;
              const height = hMap[position] ?? 200;
              const zIndex = zMap[position] ?? 1;
              const opacity = isHidden ? 0 : isCenter ? 1 : 0.75;

              return (
                <Link
                  href={`/category/${item.name === "Tali Pinggang" ? "tali-pinggang" : item.name.toLowerCase()}`}
                  key={index}
                  className="absolute will-change-transform"
                  style={{
                    transform: `translateX(${translateX}px)`,
                    width: `${width}px`,
                    height: `${height}px`,
                    opacity,
                    zIndex,
                    pointerEvents: isHidden ? "none" : "auto",
                    transition:
                      "transform 0.65s cubic-bezier(0.22,1,0.36,1), " +
                      "width 0.65s cubic-bezier(0.22,1,0.36,1), " +
                      "height 0.65s cubic-bezier(0.22,1,0.36,1), " +
                      "opacity 0.65s cubic-bezier(0.22,1,0.36,1), " +
                      "box-shadow 0.65s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: isCenter
                      ? "0 20px 50px rgba(0,0,0,0.16)"
                      : "0 6px 20px rgba(0,0,0,0.08)",
                    borderRadius: "28px",
                    overflow: "hidden",
                  }}
                >
                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    style={{
                      transform: isCenter ? "scale(1)" : "scale(1.06)",
                      transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />

                  {/* OVERLAY */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                      opacity: isCenter ? 1 : 0.7,
                      transition: "opacity 0.65s ease",
                    }}
                  />

                  {/* CONTENT */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3
                      className="text-white font-extralight leading-none tracking-[-0.03em]"
                      style={{
                        fontSize: isCenter ? "34px" : "20px",
                        transition:
                          "font-size 0.65s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      {item.name}
                    </h3>

                    <div
                      className="flex items-center gap-3 text-white mt-2"
                      style={{
                        opacity: isCenter ? 1 : 0,
                        transform: isCenter
                          ? "translateY(0)"
                          : "translateY(12px)",
                        transition:
                          "opacity 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <span className="text-[11px] uppercase tracking-[0.22em]">
                        Explore
                      </span>
                      <div className="w-10 h-px bg-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* DOTS INDICATOR */}
          <div className="flex justify-center gap-2 mt-10">
            {fashionCategories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="h-[6px] rounded-full transition-all duration-500"
                style={{
                  width: i === currentIndex ? "28px" : "6px",
                  background: i === currentIndex ? "#111" : "rgba(0,0,0,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </section>
      {/* FEATURED PRODUCTS */}
      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TITLE */}
          {/* TITLE & LINK */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">
                Produk <span className="text-red-500">Unggulan</span>
              </h2>
              <p className="text-zinc-500 font-medium mt-1">
                Koleksi terlaris yang paling banyak dicari oleh pelanggan.
              </p>
            </div>
            <Link
              href="/store"
              className="group flex items-center gap-3 bg-white border border-zinc-100 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl shadow-zinc-100/50"
            >
              Lihat Semua Toko
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {(products.length > 0
              ? products.slice(0, 3)
              : featuredProducts
            ).map((product) => (
              <div
                key={product.id}
                className="
            bg-white
            p-5
            rounded-[28px]
            shadow-md
            hover:shadow-xl
            transition-all duration-300
            relative
            w-full
            h-[400px]
            flex
            flex-col
            justify-between
            border border-zinc-100
            group
          "
              >
                {/* BADGE */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#a855f7] text-white text-[10px] px-4 py-1.5 rounded-full font-bold">
                    Best Seller
                  </span>
                </div>

                {/* CART */}
                <button
                  onClick={() => {
                    if (!user) {
                      router.push("/sign-in");
                      return;
                    }
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      quantity: 1,
                    });
                  }}
                  className="absolute top-4 right-4 text-orange-500 hover:scale-110 transition"
                >
                  <ShoppingCart size={20} />
                </button>

                {/* IMAGE */}
                <div className="flex justify-center items-center mt-10">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-32 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* CONTENT */}
                <div className="mt-4">
                  {/* TITLE + RATING */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-black">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 text-orange-400 font-bold text-[10px]">
                      <Star size={12} fill="currentColor" />
                      {product.rating || "4.5"}
                    </div>
                  </div>

                  {/* DESC */}
                  <p className="text-zinc-400 text-[10px] mt-1 line-clamp-2 font-medium">
                    {product.description}
                  </p>

                  {/* PRICE */}
                  <div className="mt-3">
                    <p className="text-[10px] text-zinc-400 font-medium mb-0.5">
                      Harga:
                    </p>
                    <p className="font-bold text-sm text-black">
                      Rp{product.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* BUTTON */}
                  <Link href={`/product/${product.id}`} className="w-full">
                    <button
                      className="
                  mt-6
                  bg-[#ff3131]
                  hover:bg-red-600
                  text-white
                  text-[10px]
                  font-bold
                  py-3.5
                  rounded-2xl
                  w-full
                  transition-all duration-300
                  active:scale-95
                "
                    >
                      Show Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-8 px-10  rounded-xl ">
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
              <p className="text-sm text-gray-500">Tersedia CS dalam 24 jam</p>
            </div>
          </div>
        </div>
      </div>

      {/* FLASH SALE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-black">
                Flash <span className="text-red-500">Sale</span>
              </h2>

              <p className="text-gray-500 mt-3">
                Penawaran spesial dengan diskon terbatas
              </p>
            </div>

            {/* COUNTDOWN */}
            <div className="flex items-center gap-4">
              {[
                {
                  label: "Jam",
                  value: timeLeft.hours,
                },
                {
                  label: "Menit",
                  value: timeLeft.minutes,
                },
                {
                  label: "Detik",
                  value: timeLeft.seconds,
                },
              ].map((time, index) => (
                <div
                  key={index}
                  className="
              w-24
              h-24
              rounded-2xl
              flex
              flex-col
              items-center
              justify-center
              border
              border-black/10
            "
                  style={{
                    background: "#f4f4f4",
                    boxShadow: `
                inset -4px -4px 8px rgba(255,255,255,0.9),
                inset 4px 6px 10px rgba(0,0,0,0.12)
              `,
                  }}
                >
                  <span className="text-3xl font-black">
                    {String(time.value).padStart(2, "0")}
                  </span>

                  <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    {time.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN OFFER */}
          <div
            className="
        rounded-[32px]
        p-10
        flex
        flex-col
        lg:flex-row
        gap-10
        mb-10
      "
            style={{
              background: "#f8f8f8",
              boxShadow: `
          inset 5px 5px 12px rgba(0,0,0,0.08),
          inset -5px -5px 12px rgba(255,255,255,0.9)
        `,
            }}
          >
            {/* LEFT */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={saleProducts[0].image}
                alt={saleProducts[0].name}
                className="h-[320px] object-contain"
              />
            </div>

            {/* RIGHT */}
            <div className="flex-1 flex flex-col justify-center">
              <span className="bg-red-500 text-white px-5 py-2 rounded-full text-sm w-fit mb-5">
                Limited Offer
              </span>

              <h3 className="text-5xl font-black mb-4">
                {saleProducts[0].name}
              </h3>

              <p className="text-gray-500 mb-6 max-w-lg">
                Produk premium dengan penawaran terbaik dan kualitas unggulan.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-black text-red-500">
                  Rp{saleProducts[0].price.toLocaleString()}
                </span>

                <span className="text-2xl text-gray-400 line-through">
                  Rp{saleProducts[0].oldPrice.toLocaleString()}
                </span>
              </div>

              <button
                className="
            bg-black
            hover:bg-zinc-800
            text-white
            px-8
            py-4
            rounded-full
            w-fit
            transition
          "
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* MINI PRODUCTS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {saleProducts.slice(1).map((item) => (
              <div
                key={item.id}
                className="
            bg-white
            rounded-[24px]
            p-5
            text-center
            border
            border-black/5
            transition-all
            hover:-translate-y-1
          "
                style={{
                  boxShadow: `
              inset 4px 4px 10px rgba(0,0,0,0.05),
              inset -4px -4px 10px rgba(255,255,255,0.8)
            `,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 mx-auto object-contain mb-4"
                />

                <h4 className="font-semibold mb-2">{item.name}</h4>

                <div className="flex flex-col items-center">
                  <span className="text-red-500 font-bold">
                    Rp{item.price.toLocaleString()}
                  </span>

                  <span className="text-sm text-gray-400 line-through">
                    Rp{item.oldPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 ABOUT SECTION (FULL WIDTH) */}
      <div className="w-full bg-red-600 py-5 flex justify-center">
        <div className="bg-white px-10 py-4 rounded-md shadow-md">
          <a href="/aboutus">
            <h2 className="text-xl font-bold text-red-600">About Lumina</h2>
          </a>
        </div>
      </div>

      {/* CUSTOMER REVIEWS */}
      <section className="w-full bg-[#f5f5f5] py-20 border-t border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-12">
            <h2
              className="
          text-[34px]
          md:text-[46px]
          font-black
          tracking-tight
          text-[#1e293b]
          leading-tight
        "
            >
              What My Clients Are Saying
            </h2>

            {/* NAVIGATION */}
            <div className="flex gap-4">
              <button
                className="
            w-14
            h-14
            rounded-full
            bg-white
            shadow-lg
            flex
            items-center
            justify-center
            hover:bg-gray-100
            transition
            active:scale-90
          "
              >
                <ChevronLeft size={26} />
              </button>

              <button
                className="
            w-14
            h-14
            rounded-full
            bg-white
            shadow-lg
            flex
            items-center
            justify-center
            hover:bg-gray-100
            transition
            active:scale-90
          "
              >
                <ChevronRight size={26} />
              </button>
            </div>
          </div>

          {/* REVIEW CARDS */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                product: "Nike Air Max",
                user: "winter",
                rating: 5,
                comment: "Kualitas barang bagus",
                date: "17/4/2026, 22.35.33",
                avatar:
                  "https://i.pinimg.com/736x/14/e9/7c/14e97cb6143526336653101cbb75a659.jpg",
              },

              {
                product: "Redmi Note 15 5G",
                user: "winter",
                rating: 2,
                comment: "kotak hp nya hancur",
                date: "17/4/2026, 22.42.47",
                avatar:
                  "https://i.pinimg.com/736x/54/19/f8/5419f84ec62c3cca9ad7b87cf46fd686.jpg",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="
            bg-[#f8f4f4]
            rounded-[28px]
            p-5
            flex
            gap-5
            border
            border-black/5
            transition-all
            duration-300
            hover:shadow-xl
            w-full
            max-w-[520px]
          "
                style={{
                  boxShadow: `
              inset 5px 5px 10px rgba(0,0,0,0.08),
              inset -5px -5px 10px rgba(255,255,255,0.9)
            `,
                }}
              >
                {/* LEFT PROFILE */}
                <div
                  className="
              w-[95px]
              h-[95px]
              rounded-[20px]
              overflow-hidden
              bg-white
              shrink-0
              flex
              items-center
              justify-center
            "
                >
                  <img
                    src={r.avatar}
                    alt={r.user}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex flex-col justify-center flex-1">
                  <h3
                    className="
                text-[20px]
                font-bold
                text-[#14213d]
                leading-tight
                mb-1
              "
                  >
                    {r.product}
                  </h3>

                  <p className="text-[17px] font-semibold text-[#1f2937] mb-2">
                    {r.user}
                  </p>

                  {/* STARS */}
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
                  <p
                    className="
                text-gray-600
                italic
                text-[15px]
                leading-relaxed
                mb-3
              "
                  >
                    "{r.comment}"
                  </p>

                  {/* DATE */}
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
