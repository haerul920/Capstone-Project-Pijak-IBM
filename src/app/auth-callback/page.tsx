"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
        return;
      }
      
      const publicRole = user.publicMetadata?.role as string;
      const unsafeRole = user.unsafeMetadata?.role as string;
      const role = publicRole || unsafeRole;
      
      if (role?.toLowerCase() === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="animate-pulse text-slate-500 font-medium">Memverifikasi akses...</div>
    </div>
  );
}
