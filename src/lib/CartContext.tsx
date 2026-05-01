"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './data';
import { toast } from 'sonner';

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('Barang Habis', {
        description: 'Barang ini sedang tidak tersedia. Kami akan memberitahu Anda ketika barang kembali tersedia.',
      });
      return;
    }

    setCart(prev => [...prev, product]);
    toast.success('Ditambahkan ke Keranjang', {
      description: `${product.name} telah ditambahkan ke keranjang belanja Anda.`,
      action: {
        label: 'Batal',
        onClick: () => {
          setCart(prev => prev.filter(item => item.id !== product.id));
          toast.info('Barang dihapus dari keranjang');
        },
      },
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
