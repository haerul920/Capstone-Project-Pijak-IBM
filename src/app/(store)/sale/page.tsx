"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCart } from "../../../lib/CartContext";
import { toast } from "sonner";
import { 
  ChevronRight, 
  ShoppingBag, 
  Clock, 
  Timer, 
  TrendingDown, 
  Zap,
  ArrowRight,
  Eye,
  ShoppingCart
} from "lucide-react";
import { formatIDR } from "../../components/ui/utils";

export default function FlashSalePage() {
  const { user, isLoaded } = useUser();
  const { addToCart } = useCart();
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 5
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              clearInterval(interval);
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBuyNow = (product: any) => {
    if (!isLoaded) return;
    
    if (!user) {
      toast.error("Silakan Login", {
        description: "Anda harus login untuk melakukan pembelian.",
      });
      router.push("/sign-in");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: product.image,
      quantity: 1,
    });

    toast.success("Berhasil ditambahkan", {
      description: "Produk berhasil ditambahkan ke keranjang",
    });
    
    router.push("/cart");
  };

  const flashSaleProducts = [
    {
      id: "4",
      name: "Nike Advantage",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
      original_price: 1200000,
      discount_price: 850000,
      discount_percent: 29
    },
    {
      id: "5",
      name: "Nike Pegasus 42",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      original_price: 1500000,
      discount_price: 950000,
      discount_percent: 36
    },
    {
      id: "6",
      name: "Nike Tech Fleece",
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
      original_price: 990000,
      discount_price: 650000,
      discount_percent: 34
    },
    {
      id: "7",
      name: "Nike Sportswear",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      original_price: 990000,
      discount_price: 650000,
      discount_percent: 34
    }
  ];

  const heroProduct = {
    id: "8",
    name: "Nike Air Max 90",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000",
    original_price: 1800000,
    discount_price: 1200000,
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-black text-black tracking-tighter">Flash <span className="text-red-500">Sale</span></h1>
              <div className="bg-red-500 text-white p-2 rounded-xl animate-pulse">
                <Zap size={24} fill="currentColor" />
              </div>
            </div>
            <p className="text-zinc-500 font-medium">Penawaran spesial dengan diskon terbatas untuk waktu yang singkat.</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex gap-4">
            {[
              { label: "JAM", value: timeLeft.hours },
              { label: "MENIT", value: timeLeft.minutes },
              { label: "DETIK", value: timeLeft.seconds }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center bg-[#fcfcfc] border border-zinc-100 rounded-[24px] w-20 py-4 shadow-xl shadow-zinc-100/50">
                <span className="text-2xl font-black text-black tabular-nums">
                  {unit.value.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-black text-zinc-300 tracking-widest mt-1">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Featured Product */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-zinc-100 shadow-2xl shadow-zinc-200/40 mb-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-50/50 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Image Side */}
            <Link href="/product/8" className="bg-white rounded-[32px] aspect-[4/3] flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-700 cursor-pointer">
              <img 
                src={heroProduct.image} 
                className="w-full h-full object-contain" 
                alt="Main Featured" 
              />
            </Link>

            {/* Content Side */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200">
                <TrendingDown size={14} />
                Limited Offer
              </div>

              <div className="space-y-4">
                <Link href="/product/8">
                  <h2 className="text-5xl md:text-6xl font-black text-black tracking-tight leading-tight hover:text-red-500 transition-colors cursor-pointer">{heroProduct.name}</h2>
                </Link>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-md">
                  Produk premium dengan penawaran terbaik dan kualitas unggulan untuk performa harian Anda.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-4xl font-black text-red-500">{formatIDR(heroProduct.discount_price)}</span>
                <span className="text-2xl font-bold text-zinc-300 line-through decoration-zinc-200">{formatIDR(heroProduct.original_price)}</span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleBuyNow(heroProduct)}
                  className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-800 transition-all shadow-2xl shadow-black/20 active:scale-95 group"
                >
                  Buy Now
                  <ShoppingCart size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <Link 
                  href="/product/8"
                  className="inline-flex items-center gap-4 bg-white border-2 border-zinc-100 text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-50 transition-all active:scale-95 group"
                >
                  Show Details
                  <Eye size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flashSaleProducts.map((p) => (
            <div key={p.id} className="group">
              <div className="bg-white rounded-[32px] p-4 border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                <Link href={`/product/${p.id}`} className="bg-zinc-50 rounded-[24px] aspect-[4/5] flex items-center justify-center p-6 mb-6 relative overflow-hidden cursor-pointer">
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-100">
                    -{p.discount_percent}%
                  </div>
                  <img 
                    src={p.image} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                    alt={p.name} 
                  />
                </Link>
                
                <div className="text-center space-y-4 px-2 pb-2 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${p.id}`}>
                      <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-black transition-colors cursor-pointer mb-2">{p.name}</h3>
                    </Link>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-red-500">{formatIDR(p.discount_price)}</span>
                      <span className="text-xs font-bold text-zinc-300 line-through">{formatIDR(p.original_price)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-4 border-t border-zinc-50">
                    <button 
                      onClick={() => handleBuyNow(p)}
                      className="w-full py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} />
                      Buy Now
                    </button>
                    <Link 
                      href={`/product/${p.id}`}
                      className="w-full py-3 bg-zinc-50 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
