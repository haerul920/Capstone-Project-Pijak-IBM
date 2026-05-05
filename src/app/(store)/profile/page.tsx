"use client";
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, Package, LogOut, User, Star } from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { formatIDR } from '../../components/ui/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ratedOrders, setRatedOrders] = useState<Record<number, number>>({});

  // Profile Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone((user.unsafeMetadata.phone as string) || '');
      setAddress((user.unsafeMetadata.address as string) || '');
      fetchOrders();
    }
  }, [isLoaded, user]);

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await user.update({
        firstName,
        lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phone,
          address
        }
      });
      setIsEditing(false);
      toast.success('Profil berhasil diperbarui');
    } catch (error: any) {
      toast.error('Gagal memperbarui profil', { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkDelivered = async (orderId: number) => {
    const { error } = await supabase.from('orders').update({ status: 'delivered' }).eq('id', orderId);
    if (!error) {
      fetchOrders();
      toast.success('Pesanan ditandai sebagai Terkirim');
    }
  };

  const handleRateOrder = (orderId: number, rating: number) => {
    setRatedOrders(prev => ({ ...prev, [orderId]: rating }));
    toast.success('Terima kasih!', { description: `Ulasan ${rating} bintang Anda telah disimpan.` });
  };

  if (!isLoaded || !user) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Memuat profil...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl tracking-tight text-slate-900 mb-2">Profil Saya</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'account' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-zinc-50'
            }`}
          >
            <User className="w-4 h-4" />
            Detail Akun
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-zinc-50'
            }`}
          >
            <Package className="w-4 h-4" />
            Pesanan Saya
          </button>
          <div className="pt-4 mt-4 border-t border-zinc-200">
            <button 
              onClick={() => signOut({ redirectUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          {activeTab === 'account' && (
            <Card className="p-8 border-zinc-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-slate-900">Informasi Pribadi & Alamat</h3>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="border-zinc-200 text-slate-900 hover:bg-zinc-50">
                    Edit Detail
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nama Depan</label>
                      <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nama Belakang</label>
                      <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <input type="email" value={user.primaryEmailAddress?.emailAddress || ''} disabled className="w-full px-3 py-2 border border-zinc-200 rounded-md bg-zinc-50 text-slate-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nomor Telepon</label>
                      <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
                      <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isSaving} className="bg-slate-900 text-white">
                      {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="border-zinc-200">
                      Batal
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nama Lengkap</p>
                    <p className="font-medium text-slate-900">{firstName} {lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Alamat Email</p>
                    <p className="font-medium text-slate-900">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nomor Telepon</p>
                    <p className="font-medium text-slate-900">{phone || '-'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-500 mb-1">Alamat Lengkap</p>
                    <p className="font-medium text-slate-900">{address || 'Belum ada alamat'}</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card className="p-8 border-zinc-200">
              <h3 className="text-xl text-slate-900 mb-6">Pesanan Saya</h3>
              
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-zinc-200 rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-zinc-100 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Order #{order.id} • {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                        <p className="font-medium text-slate-900 mt-1">Total: {formatIDR(order.total_amount)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-800 text-xs font-medium rounded-full capitalize">
                          {order.status}
                        </span>
                        {order.status === 'pending' && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkDelivered(order.id)}>
                            Tandai Terkirim
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img src={item.images?.[0] || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.category}</p>
                          </div>
                          {order.status === 'delivered' && (
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  onClick={() => !ratedOrders[order.id] && handleRateOrder(order.id, star)}
                                  className={`w-5 h-5 cursor-pointer transition-all ${
                                    (ratedOrders[order.id] || 0) >= star 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : ratedOrders[order.id] ? 'text-zinc-200' : 'text-slate-300 hover:text-yellow-400'
                                  }`} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {orders.length === 0 && (
                  <div className="text-center py-12 bg-zinc-50 rounded-md border border-dashed border-zinc-200">
                    <Package className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">Anda belum pernah melakukan pemesanan.</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
