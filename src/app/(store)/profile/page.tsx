import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, Package, Settings, LogOut, User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl tracking-tight text-slate-900 mb-2">Profil Saya</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-md text-sm font-medium">
            <User className="w-4 h-4" />
            Detail Akun
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-zinc-50 rounded-md text-sm font-medium transition-colors">
            <Package className="w-4 h-4" />
            Pesanan Saya
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-zinc-50 rounded-md text-sm font-medium transition-colors">
            <MapPin className="w-4 h-4" />
            Alamat
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-zinc-50 rounded-md text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
          <div className="pt-4 mt-4 border-t border-zinc-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          <Card className="p-8 border-zinc-200">
            <h3 className="text-xl text-slate-900 mb-6">Informasi Pribadi</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-slate-500 mb-1">Nama Depan</p>
                <p className="font-medium text-slate-900">Jane</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Nama Belakang</p>
                <p className="font-medium text-slate-900">Doe</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Alamat Email</p>
                <p className="font-medium text-slate-900">jane.doe@example.com</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Nomor Telepon</p>
                <p className="font-medium text-slate-900">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <Button variant="outline" className="border-zinc-200 text-slate-900 hover:bg-zinc-50">
              Edit Detail
            </Button>
          </Card>

          <Card className="p-8 border-zinc-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-slate-900">Pesanan Terbaru</h3>
              <Button variant="link" className="text-slate-600 hover:text-slate-900 p-0">Lihat Semua</Button>
            </div>
            
            <div className="text-center py-12 bg-zinc-50 rounded-md border border-dashed border-zinc-200">
              <Package className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">Anda belum pernah melakukan pemesanan.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
