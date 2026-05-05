"use client";
import { Product } from '../../lib/data';
import { useCart } from '../../lib/CartContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatIDR } from './ui/utils';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const hasStock = product.stock !== undefined ? product.stock > 0 : (product.in_stock ?? product.inStock ?? false);

  return (
    <Card className="group border-zinc-200 overflow-hidden">
      <div className="relative h-80 bg-zinc-50 overflow-hidden">
        <ImageWithFallback
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!hasStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">Habis Terjual</Badge>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="mb-2">
          <p className="text-xs text-slate-500 uppercase tracking-wide">{product.category}</p>
        </div>
        <h4 className="text-lg text-slate-900 mb-2">{product.name}</h4>
        <div className="flex items-center justify-between">
          <p className="text-lg text-slate-900">{formatIDR(product.price)}</p>
          <Button
            onClick={() => addToCart(product)}
            disabled={!hasStock}
            variant={hasStock ? 'default' : 'secondary'}
            className={hasStock ? 'bg-slate-900 hover:bg-slate-800' : ''}
          >
            {hasStock ? 'Tambah ke Keranjang' : 'Tidak Tersedia'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
