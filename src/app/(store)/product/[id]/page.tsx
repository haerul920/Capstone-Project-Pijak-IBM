"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { useCart } from "../../../../lib/CartContext";
import { useUser } from "@clerk/nextjs";
import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Heart,
  Store,
} from "lucide-react";
import Link from "next/link";
import { formatIDR } from "../../../components/ui/utils";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("Default");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [realReviews, setRealReviews] = useState<any[]>([]);

  const allMockReviews = [
    {
      user: "winter",
      rating: 5,
      comment: "Kualitas barang bagus, bahan sangat adem dan nyaman dipakai.",
      date: "17/4/2026, 22.35.33",
      avatar:
        "https://i.pinimg.com/736x/14/e9/7c/14e97cb6143526336653101cbb75a659.jpg",
      color: "Hitam",
      size: "XL",
    },
    // ... rest of mock reviews
  ];

  // Combine real reviews with mock reviews for better visual
  const allReviews = [...realReviews.map(r => ({
    user: r.username || "Customer",
    rating: r.rating,
    comment: r.review_text,
    date: new Date(r.created_at).toLocaleString("id-ID"),
    avatar: r.user_avatar || "https://ui-avatars.com/api/?name=User",
    color: "Default",
    size: "M",
    image: r.review_image
  })), ...allMockReviews];

  const displayedReviews = showAllReviews ? allReviews : allReviews.slice(0, 4);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*, users(username, avatar_url)") // Assuming a join with users table if possible
          .eq("product_id", id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          // If users join failed, just use raw data
          setRealReviews(data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    }

    if (id) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          const fashionDummyProducts = [
            {
              id: "d1",
              name: "Lumina Oversized Blazer",
              price: 1299000,
              category: "Pakaian Atasan",
              color: "Beige",
              rating: 4.8,
              image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
              images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800"],
              description: "Blazer oversized dengan potongan premium untuk tampilan formal namun santai.",
              stock: 12, brand: "Lumina", material: "Wool Blend", gender: "Women"
            },
            {
              id: "d2",
              name: "Premium Silk Scarf",
              price: 450000,
              category: "Aksesoris",
              color: "Cream",
              rating: 4.9,
              image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
              images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"],
              description: "Syal sutra lembut dengan motif eksklusif Lumina.",
              stock: 25, brand: "Lumina", material: "Silk", gender: "Unisex"
            },
            {
              id: "d3",
              name: "Classic Leather Loafers",
              price: 2100000,
              category: "Alas Kaki",
              color: "Brown",
              rating: 4.7,
              image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800",
              images: ["https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800"],
              description: "Loafers kulit asli yang nyaman untuk penggunaan sepanjang hari.",
              stock: 8, brand: "Lumina", material: "Genuine Leather", gender: "Men"
            },
            {
              id: "d4",
              name: "Urban Cargo Pants",
              price: 850000,
              category: "Pakaian Bawahan",
              color: "Black",
              rating: 4.6,
              image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
              images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"],
              description: "Celana cargo gaya urban dengan banyak saku fungsional.",
              stock: 15, brand: "Lumina", material: "Cotton Canvas", gender: "Unisex"
            },
            {
              id: "d5",
              name: "Minimalist Totebag",
              price: 350000,
              category: "Tas",
              color: "Navy",
              rating: 4.5,
              image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
              images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800"],
              description: "Tas kanvas minimalis yang tahan lama untuk kebutuhan harian.",
              stock: 30, brand: "Lumina", material: "Heavy Canvas", gender: "Unisex"
            },
            {
              id: "d6",
              name: "Abaya Modern Exclusive",
              price: 1500000,
              category: "Fashion Muslim",
              color: "Black",
              rating: 4.9,
              image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800",
              images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800"],
              description: "Abaya dengan potongan modern dan detail bordir halus.",
              stock: 10, brand: "Lumina Exclusive", material: "Nida", gender: "Women"
            },
            {
              id: "d7",
              name: "Oversized Streetwear Hoodie",
              price: 799000,
              category: "Pakaian Atasan",
              color: "Black",
              rating: 4.8,
              image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
              images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"],
              description: "Hoodie tebal dengan potongan oversized yang sangat nyaman.",
              stock: 20, brand: "Lumina Street", material: "Cotton Fleece", gender: "Unisex"
            },
            {
              id: "d8",
              name: "Vintage Denim Jacket",
              price: 1150000,
              category: "Pakaian Atasan",
              color: "Navy",
              rating: 4.7,
              image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800",
              images: ["https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800"],
              description: "Jaket denim klasik dengan aksen washed yang otentik.",
              stock: 5, brand: "Lumina Heritage", material: "Denim", gender: "Unisex"
            },
            {
              id: "d9",
              name: "Nike Air Max 270",
              price: 2499000,
              category: "Alas Kaki",
              color: "White",
              rating: 4.9,
              image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
              images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
              description: "Sepatu olahraga ikonik dengan kenyamanan bantalan udara maksimal.",
              stock: 12, brand: "Nike", material: "Synthetic", gender: "Men"
            },
            {
              id: "d10",
              name: "Prada Style Leather Bag",
              price: 4500000,
              category: "Tas",
              color: "Black",
              rating: 5.0,
              image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
              images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"],
              description: "Tas tangan kulit mewah dengan desain timeless.",
              stock: 3, brand: "Prada", material: "Saffiano Leather", gender: "Women"
            },
            {
              id: "d11",
              name: "Essential Cotton Tee",
              price: 299000,
              category: "Pakaian Atasan",
              color: "White",
              rating: 4.6,
              image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
              images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
              description: "Kaos katun 100% berkualitas tinggi untuk penggunaan harian.",
              stock: 50, brand: "Lumina Basic", material: "Combed Cotton", gender: "Unisex"
            },
            {
              id: "d12",
              name: "Formal Slim Black Suit",
              price: 3800000,
              category: "Pakaian Atasan",
              color: "Black",
              rating: 4.9,
              image: "https://images.unsplash.com/photo-1594932224828-b4b059b6ffc0?w=800",
              images: ["https://images.unsplash.com/photo-1594932224828-b4b059b6ffc0?w=800"],
              description: "Setelan jas slim fit untuk acara formal dan profesional.",
              stock: 5, brand: "Lumina Tailored", material: "Fine Wool", gender: "Men"
            },
            {
              id: "d13",
              name: "Basic White Socks",
              price: 49000,
              category: "Aksesoris",
              color: "White",
              rating: 4.5,
              image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800",
              images: ["https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800"],
              description: "Kaos kaki katun yang nyaman untuk penggunaan harian.",
              stock: 100, brand: "Lumina Basic", material: "Cotton Blend", gender: "Unisex"
            },
            {
              id: "d14",
              name: "Streetwear Bandana",
              price: 85000,
              category: "Aksesoris",
              color: "Black",
              rating: 4.4,
              image: "https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=800",
              images: ["https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=800"],
              description: "Bandana gaya jalanan dengan bahan breathable.",
              stock: 40, brand: "Lumina Street", material: "Polyester", gender: "Unisex"
            },
            {
              id: "lux-1",
              name: "Rolex Submariner Date",
              price: 285000000,
              category: "Aksesoris",
              rating: 5.0,
              image: "https://images.rolex.com/2024/media/watches/submariner/m126610ln-0001/m126610ln-0001_drp-upright.png?impolicy=upright-majesty",
              images: ["https://images.rolex.com/2024/media/watches/submariner/m126610ln-0001/m126610ln-0001_drp-upright.png?impolicy=upright-majesty"],
              description: "Ikon jam tangan mewah yang tak lekang oleh waktu dengan presisi luar biasa.",
              stock: 1, brand: "Rolex", material: "Oystersteel", gender: "Men"
            },
            {
              id: "lux-2",
              name: "Gucci Jackie 1961 Bag",
              price: 48000000,
              category: "Tas",
              rating: 4.9,
              image: "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1602690903/636703_HUHHG_8565_001_100_0000_Light-Jackie-1961-small-shoulder-bag.jpg",
              images: ["https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1602690903/636703_HUHHG_8565_001_100_0000_Light-Jackie-1961-small-shoulder-bag.jpg"],
              description: "Tas tangan mewah dengan desain klasik yang elegan dan detail horsebit ikonik.",
              stock: 2, brand: "Gucci", material: "Canvas & Leather", gender: "Women"
            },
            {
              id: "lux-3",
              name: "Prada Leather Jacket",
              price: 65000000,
              category: "Baju",
              rating: 4.9,
              image: "https://www.prada.com/content/dam/pradabkg_products/S/SGV/SGV126/1ZCYF0002/SGV126_1ZCY_F0002_S_222_SLF.jpg/_jcr_content/renditions/cq5dam.web.hf-low.800.800.at.jpg",
              images: ["https://www.prada.com/content/dam/pradabkg_products/S/SGV/SGV126/1ZCYF0002/SGV126_1ZCY_F0002_S_222_SLF.jpg/_jcr_content/renditions/cq5dam.web.hf-low.800.800.at.jpg"],
              description: "Jaket kulit premium dengan finishing mewah dan potongan yang sangat elegan.",
              stock: 2, brand: "Prada", material: "Genuine Leather", gender: "Unisex"
            },
            {
              id: "lux-4",
              name: "Louis Vuitton Keepall 55",
              price: 35000000,
              category: "Tas",
              rating: 4.8,
              image: "https://images.louisvuitton.com/is/image/louisvuitton/M41414_PM2_Front%20view?wid=800&hei=800",
              images: ["https://images.louisvuitton.com/is/image/louisvuitton/M41414_PM2_Front%20view?wid=800&hei=800"],
              description: "Tas travel mewah untuk gaya hidup jetset dengan kanvas monogram legendaris.",
              stock: 3, brand: "Louis Vuitton", material: "Monogram Canvas", gender: "Unisex"
            },
            {
              id: "new-1",
              name: "ZARA Oversized Wool Blazer",
              price: 2499000,
              category: "Baju",
              rating: 4.8,
              image: "https://static.pullandbear.net/2/photos//2024/V/0/1/p/4711/534/800/4711534800_2_1_8.jpg?t=1706271253456",
              images: ["https://static.pullandbear.net/2/photos//2024/V/0/1/p/4711/534/800/4711534800_2_1_8.jpg?t=1706271253456"],
              description: "Blazer wol oversized terbaru dengan potongan modern.",
              stock: 10, brand: "ZARA", material: "Wool", gender: "Women"
            },
            {
              id: "new-2",
              name: "H&M Premium Cotton Tee",
              price: 349000,
              category: "Baju",
              rating: 4.6,
              image: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fbc%2F8a%2Fbc8a4d4a8e3d0d5d6d6d4d1d2d3d4d5d6d7d8d9d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeved%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
              images: ["https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fbc%2F8a%2Fbc8a4d4a8e3d0d5d6d6d4d1d2d3d4d5d6d7d8d9d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeved%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D"],
              description: "Kaos katun premium dengan kenyamanan maksimal.",
              stock: 20, brand: "H&M", material: "Cotton", gender: "Unisex"
            },
            {
              id: "new-3",
              name: "Streetwear Cargo Pants",
              price: 899000,
              category: "Celana",
              rating: 4.7,
              image: "https://static.pullandbear.net/2/photos//2024/V/0/2/p/5688/511/400/5688511400_2_1_8.jpg?t=1705658145678",
              images: ["https://static.pullandbear.net/2/photos//2024/V/0/2/p/5688/511/400/5688511400_2_1_8.jpg?t=1705658145678"],
              description: "Celana cargo dengan gaya streetwear modern.",
              stock: 15, brand: "Pull & Bear", material: "Cotton", gender: "Unisex"
            },
            {
              id: "new-4",
              name: "Minimalist Hoodie",
              price: 599000,
              category: "Baju",
              rating: 4.5,
              image: "https://lp2.hm.com/hmgoepprod?set=source%5B%2F09%2F78%2F0978931a238618f3a38d6f698371391e65893d6e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
              images: ["https://lp2.hm.com/hmgoepprod?set=source%5B%2F09%2F78%2F0978931a238618f3a38d6f698371391e65893d6e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D"],
              description: "Hoodie minimalis dengan bahan fleece lembut.",
              stock: 12, brand: "H&M", material: "Fleece", gender: "Unisex"
            }
          ];

          const found = fashionDummyProducts.find((p) => p.id === String(id));
          if (found) {
            setProduct(found);
            setActiveImage(found.image);
          } else {
            // Check original featuredProducts list if not found in new ones
            const oldFeatured = [
              {
                id: "1",
                name: "Nike Luka 5 PF",
                description: "Sepatu basket performa tinggi.",
                price: 2500000,
                image: "https://i.pinimg.com/1200x/8f/a2/04/8fa2048afc1152b77f5ffed6e6201e9c.jpg",
                images: ["https://i.pinimg.com/1200x/8f/a2/04/8fa2048afc1152b77f5ffed6e6201e9c.jpg"],
                rating: 4.9, stock: 42, category: "Sportswear", brand: "Nike"
              }
            ];
            const oldFound = oldFeatured.find(p => p.id === String(id));
            if (oldFound) {
               setProduct(oldFound);
               setActiveImage(oldFound.image);
            } else {
              setProduct({
                name: "Lumina Fashion Item",
                price: 1000000,
                description: "Item fashion berkualitas tinggi dari Lumina.",
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
                images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"],
                stock: 10,
                rating: 4.5
              });
              setActiveImage("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800");
            }
          }
        } else {
          setProduct(data);
          setActiveImage(data.image || (data.images && data.images[0]));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id, router]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Silakan Login", {
        description: "Anda harus login untuk menambahkan produk ke keranjang.",
      });
      router.push("/sign-in");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || activeImage,
      quantity: quantity,
    });

    toast.success("Berhasil ditambahkan", {
      description: `${product.name} telah masuk ke keranjang.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Sticky Top Bar */}
      <div
        className={`fixed top-16 left-0 w-full bg-white border-b border-zinc-100 z-40 transition-transform duration-300 transform ${showStickyBar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeImage}
              className="w-8 h-8 object-cover rounded-md"
              alt=""
            />
            <span className="font-bold text-black text-sm">{product.name}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-zinc-800 transition active:scale-95"
          >
            Beli Sekarang
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition">
            Store
          </Link>
          <ChevronRight size={8} />
          <span className="text-zinc-300">{product.category}</span>
          <ChevronRight size={8} />
          <span className="text-black font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="bg-[#f9f9f9] rounded-2xl aspect-[4/3] flex items-center justify-center group relative p-8 border border-zinc-50 overflow-visible">
              <img
                src={activeImage}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                alt={product.name}
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl flex-shrink-0 bg-white p-2 border-2 transition-all ${activeImage === img ? "border-black shadow-sm" : "border-zinc-100 hover:border-zinc-300"}`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-contain"
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="space-y-8">
            <div className="border-b border-zinc-100 pb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {product.brand || "Lumina Exclusive"}
                </span>
                <div className="flex gap-4 text-zinc-400">
                  <button className="hover:text-black transition">
                    <Share2 size={16} />
                  </button>
                  <button className="hover:text-black transition">
                    <Heart size={16} />
                  </button>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-medium text-black mb-3 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-xs mb-6">
                <div className="flex items-center gap-1 text-black font-bold">
                  <Star size={12} fill="black" />
                  {product.rating || "4.8"}
                </div>
                <span className="text-zinc-300">|</span>
                <div className="text-zinc-500">1.2k Reviews</div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-black">
                  {formatIDR(product.price)}
                </span>
                <span className="text-zinc-300 line-through text-xs">
                  {formatIDR(product.price * 1.5)}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-black uppercase tracking-widest">
                  Pilih Ukuran
                </h3>
                <button className="text-[10px] text-zinc-400 underline hover:text-black transition">
                  Panduan Ukuran
                </button>
              </div>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg text-xs font-bold transition flex items-center justify-center border-2 ${selectedSize === size ? "bg-black text-white border-black" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-black uppercase tracking-widest">
                Pilih Warna
              </h3>
              <div className="flex gap-3">
                {["#000000", "#ffffff", "#4a5568"].map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(color)}
                    className={`w-8 h-8 rounded-full border-2 transition ${selectedVariant === color ? "border-black" : "border-zinc-200"} p-0.5`}
                  >
                    <div
                      className="w-full h-full rounded-full border border-black/5"
                      style={{ background: color }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6 py-6 border-t border-zinc-100">
              <div className="flex items-center bg-zinc-50 rounded-lg p-1 border border-zinc-100">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black transition"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black transition"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                Stok: {product.stock || 24}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-[2] bg-black text-white h-14 rounded-xl font-bold text-sm hover:bg-zinc-800 transition active:scale-[0.98] shadow-lg shadow-black/10"
              >
                Beli Sekarang
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-zinc-100 text-black h-14 rounded-xl font-bold text-sm hover:bg-zinc-50 transition flex items-center justify-center"
              >
                <ShoppingCart size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                <Truck size={14} /> Gratis Ongkir
              </div>
              <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                <ShieldCheck size={14} /> Produk Original
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <div className="flex gap-8 border-b border-zinc-100 mb-8">
            <button
              onClick={() => setActiveTab("deskripsi")}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "deskripsi" ? "text-black" : "text-zinc-300"}`}
            >
              Deskripsi
              {activeTab === "deskripsi" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("detail")}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "detail" ? "text-black" : "text-zinc-300"}`}
            >
              Detail Produk
              {activeTab === "detail" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("ulasan")}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "ulasan" ? "text-black" : "text-zinc-300"}`}
            >
              Ulasan
              {activeTab === "ulasan" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
              )}
            </button>
          </div>

          <div
            className={`min-h-[200px] ${activeTab === "ulasan" ? "w-full" : "max-w-2xl"}`}
          >
            {activeTab === "deskripsi" && (
              <p className="text-zinc-500 leading-relaxed text-sm animate-in fade-in duration-500">
                {product.description}
              </p>
            )}

            {activeTab === "detail" && (
              <div className="grid grid-cols-2 gap-y-4 gap-x-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {[
                  {
                    label: "Kategori",
                    value: product.category || "Pakaian Atasan",
                  },
                  {
                    label: "Bahan",
                    value: product.material || "Premium Cotton",
                  },
                  { label: "Ukuran", value: "S, M, L, XL" },
                  { label: "Warna", value: "Hitam, Putih, Abu" },
                  { label: "Gender", value: product.gender || "Unisex" },
                  {
                    label: "Style",
                    value: product.style || "Modern Streetwear",
                  },
                  { label: "Brand", value: product.brand || "Lumina" },
                  { label: "Stok", value: product.stock || 24 },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-black">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "ulasan" && (
              <div className="animate-in fade-in duration-500 py-6">
                <div className="flex items-center justify-between mb-10 border-b border-zinc-50 pb-6">
                  {!showAllReviews && allReviews.length > 4 && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="text-xs font-black text-black bg-zinc-50 px-5 py-2.5 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest group shadow-sm"
                    >
                      Lihat Semua ({allReviews.length})
                      <ChevronRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  )}
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${showAllReviews ? "mb-12" : ""}`}
                >
                  {displayedReviews.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-[28px] p-6 flex flex-col gap-5 border border-zinc-100 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
                    >
                      {/* QUOTE ICON */}
                      <div className="absolute top-6 right-6 text-orange-400 opacity-20">
                        <svg
                          width="20"
                          height="16"
                          viewBox="0 0 14 12"
                          fill="currentColor"
                        >
                          <path d="M3.5 0C5.433 0 7 1.567 7 3.5C7 5.433 5.433 7 3.5 7C2.96667 7 2.46667 6.86667 2.03333 6.66667C2.33333 8.3 3.73333 9.66667 5.5 10.3333L4.5 12C2.16667 11 0 8.66667 0 5.5V5.5C0 2.46667 2.46667 0 5.5 0H3.5ZM10.5 0C12.433 0 14 1.567 14 3.5C14 5.433 12.433 7 10.5 7C9.96667 7 9.46667 6.86667 9.03333 6.66667C9.33333 8.3 10.7333 9.66667 12.5 10.3333L11.5 12C9.16667 11 7 8.66667 7 5.5V5.5C7 2.46667 9.46667 0 12.5 0H10.5Z" />
                        </svg>
                      </div>

                      <div className="flex gap-4 items-center">
                        {/* PROFILE IMAGE */}
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-50 shrink-0 border border-zinc-100 shadow-inner">
                          <img
                            src={r.avatar}
                            alt={r.user}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col justify-center flex-1">
                          <h3 className="text-xs font-black text-black leading-tight mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {r.user}
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* STARS */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, k) => (
                              <Star
                                key={k}
                                size={12}
                                className={
                                  k < r.rating
                                    ? "text-orange-400 fill-orange-400"
                                    : "text-zinc-100"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs font-black text-zinc-300">
                            {r.rating}.0
                          </span>
                        </div>

                        {/* PRODUCT ATTRIBUTES (SIZE/COLOR) */}
                        <div className="flex gap-2 text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
                          <span className="bg-zinc-50 px-2 py-0.5 rounded-md">
                            {r.color}
                          </span>
                          <span className="bg-zinc-50 px-2 py-0.5 rounded-md">
                            {r.size}
                          </span>
                        </div>

                        <p className="text-zinc-600 text-[13px] font-medium leading-relaxed italic">
                          "{r.comment}"
                        </p>

                        <div className="pt-2 border-t border-zinc-50">
                          <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">
                            {r.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {showAllReviews && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setShowAllReviews(false)}
                      className="px-8 py-3 bg-white border border-zinc-200 text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:border-black transition-all shadow-sm active:scale-95"
                    >
                      Tampilkan Lebih Sedikit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-32 border-t border-zinc-100 pt-16">
          <h2 className="text-sm font-black text-black uppercase tracking-[0.3em] mb-12 text-center">
            Produk Serupa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-zinc-50 rounded-xl mb-4 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    alt=""
                  />
                </div>
                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">
                  Lumina Edition {i}
                </h4>
                <p className="text-xs font-bold text-zinc-400">
                  {formatIDR(199000)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
