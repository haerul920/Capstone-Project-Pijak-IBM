"use client";
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Badge } from './ui/badge';
import { useCart } from '../../lib/CartContext';

export default function Header() {
  const { cart } = useCart();

  return (
    <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button className="lg:hidden">
              <Menu className="w-6 h-6 text-slate-900" />
            </button>
            <Link href="/">
              <h1 className="text-2xl tracking-tight text-slate-900">LUMINA</h1>
            </Link>
            <div className="hidden lg:flex gap-6">
              <Link href="/new-arrivals" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Kedatangan Baru</Link>
              <Link href="/category/pria" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pria</Link>
              <Link href="/category/wanita" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Wanita</Link>
              <Link href="/category/aksesoris" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Aksesoris</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
              <User className="w-5 h-5 text-slate-600" />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-zinc-50 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-slate-900 text-white text-xs">
                  {cart.length}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
