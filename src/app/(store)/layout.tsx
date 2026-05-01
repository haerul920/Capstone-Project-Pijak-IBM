import Header from '../components/Header';
import { CartProvider } from '../../lib/CartContext';
import { Toaster } from '../components/ui/sonner';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}
