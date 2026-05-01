"use client";
import { useState } from 'react';
import {
  BarChart3,
  Package,
  TrendingUp,
  AlertCircle,
  CloudRain,
  Sun,
  Cloud,
  Calendar,
  Search,
  Settings,
  LogOut,
  Home,
  ShoppingBag,
  Users,
  ChevronRight,
} from 'lucide-react';
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
    weather: 'sunny',
    holiday: null,
  },
  {
    date: '2026-04-16',
    sales: 11200,
    predicted: 11500,
    weather: 'cloudy',
    holiday: null,
  },
  {
    date: '2026-04-17',
    sales: 9800,
    predicted: 10200,
    weather: 'rainy',
    holiday: null,
  },
  {
    date: '2026-04-18',
    sales: 14500,
    predicted: 14200,
    weather: 'sunny',
    holiday: null,
  },
  {
    date: '2026-04-19',
    sales: 15800,
    predicted: 15500,
    weather: 'sunny',
    holiday: 'Easter Weekend',
  },
  {
    date: '2026-04-20',
    sales: 16200,
    predicted: 16800,
    weather: 'sunny',
    holiday: 'Easter Monday',
  },
  {
    date: '2026-04-21',
    sales: null,
    predicted: 13500,
    weather: 'cloudy',
    holiday: null,
  },
  {
    date: '2026-04-22',
    sales: null,
    predicted: 11800,
    weather: 'rainy',
    holiday: null,
  },
  {
    date: '2026-04-23',
    sales: null,
    predicted: 12200,
    weather: 'cloudy',
    holiday: null,
  },
];

const INVENTORY_ALERTS = [
  { id: 1, product: 'Dompet Kulit Minimalis', stock: 5, threshold: 10, severity: 'high' },
  { id: 2, product: 'Kemeja Oxford Klasik', stock: 12, threshold: 15, severity: 'medium' },
  { id: 3, product: 'Koleksi Syal Sutra', stock: 0, threshold: 10, severity: 'critical' },
];

const WEATHER_ICON_MAP: Record<string, React.ReactNode> = {
  sunny: <Sun className="w-4 h-4 text-amber-500" />,
  cloudy: <Cloud className="w-4 h-4 text-slate-400" />,
  rainy: <CloudRain className="w-4 h-4 text-blue-500" />,
};

export default function AdminDasbor() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);

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
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari... (⌘K)"
                className="pl-10 pr-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-zinc-200">
              <CardHeader className="pb-3">
                <CardDescription>Total Pendapatan</CardDescription>
                <CardTitle className="text-3xl">$89,247</CardTitle>
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
                <CardTitle className="text-3xl">1,429</CardTitle>
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
                <CardTitle className="text-3xl">$62.48</CardTitle>
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
                <CardTitle className="text-3xl text-red-900">3</CardTitle>
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
                    Prakiraan penjualan yang didukung AI dengan data cuaca dan liburan
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
                        Berdasarkan prakiraan cuaca (hujan diperkirakan 22-23 Apr) dan liburan mendatang, kami merekomendasikan:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-emerald-700">
                        <li>• Isi ulang Dompet Kulit pada 21 Apr (+45 unit)</li>
                        <li>• Tingkatkan inventaris Kemeja Oxford (+30 unit)</li>
                        <li>• Syal Sutra kritis - pengisian stok segera diperlukan</li>
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
                                {WEATHER_ICON_MAP[data.weather]}
                                <span className="text-xs text-slate-600 capitalize">{data.weather}</span>
                                {data.holiday && (
                                  <>
                                    <Calendar className="w-3 h-3 text-purple-500 ml-2" />
                                    <span className="text-xs text-purple-600">{data.holiday}</span>
                                  </>
                                )}
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

              {/* Weather and Holiday Markers */}
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-600">Cerah (Penjualan Tinggi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600">Hujan (Penjualan Lebih Rendah)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-slate-600">Liburan (Puncak Penjualan)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventaris Alerts */}
          <Card className="border-zinc-200">
            <CardHeader>
              <CardTitle>Inventaris Alerts</CardTitle>
              <CardDescription>Produk yang membutuhkan pengisian stok segera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {INVENTORY_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical'
                            ? 'bg-red-500'
                            : alert.severity === 'high'
                            ? 'bg-orange-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <div>
                        <h4 className="text-sm text-slate-900">{alert.product}</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Saat ini: {alert.stock} unit / Ambang Batas: {alert.threshold} unit
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {alert.severity}
                      </Badge>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                        Pesan Ulang
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

