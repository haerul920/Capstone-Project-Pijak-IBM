"use client";
import AdminDashboard from '../components/AdminDashboard';
import { Toaster } from '../components/ui/sonner';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push('/sign-in');
        return;
      }
      
      const publicRole = user.publicMetadata?.role as string;
      const unsafeRole = user.unsafeMetadata?.role as string;
      const role = publicRole || unsafeRole;
      
      if (role?.toLowerCase() !== 'admin') {
        router.push('/');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || (user?.publicMetadata?.role !== 'admin' && user?.unsafeMetadata?.role !== 'admin')) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50">Memuat dashboard...</div>;
  }

  return (
    <div className="size-full">
      <AdminDashboard />
      <Toaster position="top-right" />
    </div>
  );
}
