"use client";
import AdminDashboard from '../components/AdminDashboard';
import { Toaster } from '../components/ui/sonner';

export default function AdminPage() {
  return (
    <div className="size-full">
      <AdminDashboard />
      <Toaster position="top-right" />
    </div>
  );
}
