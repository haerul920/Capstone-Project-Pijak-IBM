"use client";
import Link from 'next/link';
import { CATEGORIES, PRODUCTS } from '../../lib/data';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function StorefrontHome() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative h-[500px] bg-zinc-50 rounded-sm overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
            <div className="max-w-xl px-12">
              <h2 className="text-5xl tracking-tight text-white mb-4">
                Koleksi Musim Semi 2026
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Keanggunan abadi berpadu dengan minimalisme kontemporer
              </p>
              <Link href="/new-arrivals">
                <Button className="bg-white text-slate-900 hover:bg-white/90 px-8">
                  Jelajahi Koleksi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl tracking-tight text-slate-900 mb-8">Belanja Berdasarkan Kategori</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.name}
              className="group relative h-80 bg-zinc-50 rounded-sm overflow-hidden block"
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-end p-8">
                <h4 className="text-2xl text-white">{category.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
        <h3 className="text-2xl tracking-tight text-slate-900 mb-8">Produk Unggulan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
