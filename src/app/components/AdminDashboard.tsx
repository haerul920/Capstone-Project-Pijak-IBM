"use client";
import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart3,
  Package,
  TrendingUp,
  AlertCircle,
  Calendar,
  Search,
  Settings,
  LogOut,
  Home,
  ShoppingBag,
  Users,
  ChevronRight,
  Trash2,
  Star,
  Zap,
} from 'lucide-react';
import { formatIDR, formatAbbreviatedIDR } from './ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { toast } from 'sonner';

const SALES_DATA = [
  {
    date: '2026-04-15',
    sales: 12500,
    predicted: 12800,
    factor: 'Reguler',
    icon: 'users',
  },
  {
    date: '2026-04-16',
    sales: 11200,
    predicted: 11500,
    factor: 'Rating Tinggi',
    icon: 'star',
  },
  {
    date: '2026-04-17',
    sales: 9800,
    predicted: 10200,
    factor: 'Reguler',
    icon: 'users',
  },
  {
    date: '2026-04-18',
    sales: 14500,
    predicted: 14200,
    factor: 'Trafik Gen-Z',
    icon: 'users',
  },
  {
    date: '2026-04-19',
    sales: 15800,
    predicted: 15500,
    factor: 'Liburan Nasional',
    icon: 'calendar',
  },
  {
    date: '2026-04-20',
    sales: 16200,
    predicted: 16800,
    factor: 'Liburan Nasional',
    icon: 'calendar',
  },
  {
    date: '2026-04-21',
    sales: null,
    predicted: 23500,
    factor: 'Flash Sale',
    icon: 'zap',
  },
  {
    date: '2026-04-22',
    sales: null,
    predicted: 11800,
    factor: 'Reguler',
    icon: 'users',
  },
  {
    date: '2026-04-23',
    sales: null,
    predicted: 12200,
    factor: 'Reguler',
    icon: 'users',
  },
];

const METRIC_ICON_MAP: Record<string, React.ReactNode> = {
  star: <Star className="w-4 h-4 text-yellow-500" />,
  users: <Users className="w-4 h-4 text-blue-500" />,
  calendar: <Calendar className="w-4 h-4 text-purple-500" />,
  zap: <Zap className="w-4 h-4 text-amber-500" />,
};

export default function AdminDasbor() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const runAiPrediction = () => {
    toast.info('Analisis AI Dimulai', {
      description: 'Menghasilkan prediksi pengisian stok cerdas berdasarkan data cuaca dan liburan...',
    });

    setTimeout(() => {
      setAiAnalysisComplete(true);
      toast.success('Analisis AI Selesai', {
        description: 'Rekomendasi pengisian stok cerdas siap ditinjau.',
      });
    }, 2000);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const imageFiles = formData.getAll('images') as File[];
    
    if (imageFiles.length > 5) {
      toast.error('Maksimal 5 gambar diperbolehkan');
      setIsSubmitting(false);
      return;
    }

    const uploadedImageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file.size === 0) continue;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        toast.error('Gagal mengunggah gambar', { description: uploadError.message });
        setIsSubmitting(false);
        return;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      uploadedImageUrls.push(data.publicUrl);
    }

    const newProduct = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      images: uploadedImageUrls,
      in_stock: formData.get('in_stock') === 'on'
    };

    const { error } = await supabase.from('products').insert([newProduct]);

    if (error) {
      toast.error('Gagal menambahkan produk', { description: error.message });
    } else {
      toast.success('Produk berhasil ditambahkan!');
      (e.target as HTMLFormElement).reset();
      fetchProducts();
    }
    setIsSubmitting(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Gagal menghapus produk', { description: error.message });
    } else {
      toast.success('Produk berhasil dihapus');
      fetchProducts();
    }
  };

  const renderDashboard = () => (
    <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-zinc-200">
          <CardHeader className="pb-3">
            <CardDescription>Total Pendapatan</CardDescription>
            <CardTitle className="text-2xl">{formatAbbreviatedIDR(1383328500)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% dari minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-3">
            <CardDescription>Pesanan</CardDescription>
            <CardTitle className="text-2xl">1,429</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8.2% dari minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-3">
            <CardDescription>Rata-rata Nilai Pesanan</CardDescription>
            <CardTitle className="text-2xl">{formatAbbreviatedIDR(968440)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span>+3.1% dari minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-red-900">Peringatan Stok Habis</CardDescription>
            <CardTitle className="text-2xl text-red-900">{products.filter((p) => !p.in_stock).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Membutuhkan perhatian segera</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediksi Pengisian Stok Cerdas Chart */}
      <Card className="border-zinc-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prediksi Pengisian Stok Cerdas</CardTitle>
              <CardDescription className="mt-1">
                Prakiraan penjualan didukung AI dengan data demografi, rating, dan event promo
              </CardDescription>
            </div>
            <Button
              onClick={runAiPrediction}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {aiAnalysisComplete ? 'Segarkan Analisis' : 'Jalankan Analisis AI'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiAnalysisComplete && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-emerald-900 mb-1">Analisis Selesai</h4>
                  <p className="text-sm text-emerald-700">
                    Berdasarkan trafik Gen-Z dan event Flash Sale mendatang, kami merekomendasikan:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-700">
                    <li>• Siapkan stok Kemeja Oxford untuk trafik tinggi (+45 unit)</li>
                    <li>• Promosikan Jaket Biker ke segmen pria (+30 unit)</li>
                    <li>• Gaun Musim Panas sangat diminati - pastikan stok tersedia</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-zinc-200 rounded-md shadow-lg p-3">
                          <p className="text-sm text-slate-900 mb-2">
                            {new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                          </p>
                          {data.sales && (
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span className="text-xs text-slate-600">Penjualan Aktual:</span>
                              <span className="text-sm text-slate-900">${data.sales.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="text-xs text-slate-600">Prediksi:</span>
                            <span className="text-sm text-blue-600">${data.predicted.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-zinc-200">
                            {METRIC_ICON_MAP[data.icon as keyof typeof METRIC_ICON_MAP]}
                            <span className="text-xs text-slate-600 capitalize">{data.factor}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#0f172a"
                  strokeWidth={2}
                  fill="url(#colorSales)"
                  name="Actual Sales"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorPredicted)"
                  name="AI Prediction"
                />
                <ReferenceLine x="2026-04-20" stroke="#9333ea" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Demographics and Event Markers */}
          <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-slate-600">Rating Tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-slate-600">Trafik Gen-Z</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600">Flash Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-slate-600">Event Liburan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventaris Alerts moved to Dashboard */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle>Inventaris Alerts</CardTitle>
          <CardDescription>Produk yang membutuhkan pengisian stok segera</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.filter((p) => !p.in_stock).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div>
                    <h4 className="text-sm text-slate-900">{product.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Kategori: {product.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="capitalize">
                    Habis
                  </Badge>
                  <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                    Pesan Ulang
                  </Button>
                </div>
              </div>
            ))}
            {products.filter((p) => !p.in_stock).length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">Semua produk saat ini tersedia.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderInventory = () => (
    <>
      <Card className="border-zinc-200 mb-8">
        <CardHeader>
          <CardTitle>Tambah Produk Baru</CardTitle>
          <CardDescription>Tambahkan produk baru ke dalam inventaris database</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">Nama Produk</label>
              <input required type="text" id="name" name="name" className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Kemeja Oxford" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-slate-700">Harga ($)</label>
              <input required type="number" step="0.01" id="price" name="price" className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="129.99" />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-slate-700">Kategori</label>
              <select required id="category" name="category" className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900">
                <option value="Pakaian Pria">Pakaian Pria</option>
                <option value="Pakaian Wanita">Pakaian Wanita</option>
                <option value="Aksesoris">Aksesoris</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="images" className="text-sm font-medium text-slate-700">Unggah Gambar (Maks 5)</label>
              <input required type="file" id="images" name="images" multiple accept="image/*" className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="in_stock" name="in_stock" defaultChecked className="w-4 h-4 text-slate-900 focus:ring-slate-900 rounded" />
              <label htmlFor="in_stock" className="text-sm font-medium text-slate-700">Tersedia (In Stock)</label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-4">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Kelola produk yang tersedia di toko Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">{product.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{product.category}</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{formatIDR(product.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={product.in_stock ? 'secondary' : 'destructive'} className="capitalize">
                    {product.in_stock ? 'Tersedia' : 'Habis'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-8">Belum ada produk yang ditambahkan.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <h1 className="text-xl tracking-tight text-slate-900">LUMINA</h1>
          <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <button
            onClick={() => setActiveNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeNav === 'dashboard'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-zinc-100'
            }`}
          >
            <Home className="w-4 h-4" />
            Dasbor
          </button>
          <button
            onClick={() => setActiveNav('inventory')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeNav === 'inventory'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-zinc-100'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventaris
          </button>
          <button
            onClick={() => setActiveNav('orders')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeNav === 'orders'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-zinc-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Pesanan
          </button>
          <button
            onClick={() => setActiveNav('predictions')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeNav === 'predictions'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-zinc-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Prediksi AI
          </button>
          <button
            onClick={() => setActiveNav('customers')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeNav === 'customers'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-zinc-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Pelanggan
          </button>

          <Separator className="my-4" />

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-zinc-100 transition-colors">
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
        </nav>

        <div className="p-3 border-t border-zinc-200">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-zinc-100 transition-colors">
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl text-slate-900">Dasbor</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
              <span>Beranda</span>
              <ChevronRight className="w-3 h-3" />
              <span>Dasbor</span>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {activeNav === 'dashboard' && renderDashboard()}
          {activeNav === 'inventory' && renderInventory()}
          {activeNav !== 'dashboard' && activeNav !== 'inventory' && (
             <div className="text-center py-20 text-slate-500">
               Fitur {activeNav} sedang dalam pengembangan.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

