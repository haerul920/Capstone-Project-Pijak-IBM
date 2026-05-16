"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "./data";
import { toast } from "sonner";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  appliedVoucher: { code: string; discount: number } | null;
  applyVoucher: (code: string, discount: number) => void;
  clearVoucher: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  // Load cart and voucher from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedVoucher = localStorage.getItem("appliedVoucher");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedVoucher) setAppliedVoucher(JSON.parse(savedVoucher));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedVoucher) {
      localStorage.setItem("appliedVoucher", JSON.stringify(appliedVoucher));
    } else {
      localStorage.removeItem("appliedVoucher");
    }
  }, [appliedVoucher]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    toast.success("Ditambahkan ke Keranjang", {
      description: `${product.name} telah ditambahkan ke keranjang belanja Anda.`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  const applyVoucher = (code: string, discount: number) => {
    setAppliedVoucher({ code, discount });
  };

  const clearVoucher = () => {
    setAppliedVoucher(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        appliedVoucher,
        applyVoucher,
        clearVoucher,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
