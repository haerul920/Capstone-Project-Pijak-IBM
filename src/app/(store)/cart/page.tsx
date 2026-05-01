"use client";
import { useCart } from '../../../lib/CartContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl tracking-tight text-slate-900 mb-2">Keranjang Belanja</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-lg">
          <p className="text-lg text-slate-600 mb-6">Keranjang Anda saat ini kosong.</p>
          <Link href="/">
            <Button className="bg-slate-900 hover:bg-slate-800">
              Lanjutkan Belanja
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, index) => (
              <Card key={`${item.id}-${index}`} className="p-6 flex items-center justify-between border-zinc-200">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg text-slate-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-slate-500 mb-2">{item.category}</p>
                    <p className="font-medium text-slate-900">${item.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-zinc-50 p-8 rounded-lg sticky top-24">
              <h3 className="text-xl tracking-tight text-slate-900 mb-6">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 mb-6 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-medium">${total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman</span>
                  <span className="text-slate-900 font-medium">Gratis</span>
                </div>
              </div>
              
              <div className="border-t border-zinc-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-base text-slate-900">Total</span>
                  <span className="text-2xl text-slate-900 font-medium">${total}</span>
                </div>
              </div>
              
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-lg py-6">
                Lanjut ke Pembayaran
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
