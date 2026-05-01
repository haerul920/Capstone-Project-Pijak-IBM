import { CATEGORIES, PRODUCTS } from '../../../../lib/data';
import ProductCard from '../../../components/ProductCard';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = CATEGORIES.find(c => c.slug === resolvedParams.slug);
  
  if (!category) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter(p => p.category === category.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl tracking-tight text-slate-900 mb-2">{category.name}</h2>
        <p className="text-slate-600">Jelajahi pilihan {category.name.toLowerCase()} pilihan kami.</p>
      </div>
      
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-600">
          Tidak ada produk yang ditemukan dalam kategori ini.
        </div>
      )}
    </div>
  );
}
