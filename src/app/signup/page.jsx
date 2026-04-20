"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Key, Phone } from "lucide-react";

export default function Signup() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
  if (!fullName || !phone || !username || !email || !password) {
    setError("Semua field wajib diisi");
    setSuccess("");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        phone,
        username,
        email,
        password,
        code,
      }),
    });

    const data = await res.json();

    // 🔥 DEBUG BIAR KAMU LIAT RESPONSE BACKEND
    console.log("RESPONSE:", data);

    if (!res.ok) {
      setError(data.error || "Signup gagal");
      setSuccess("");
      return;
    }

    // ✅ SUCCESS
    setError("");
    setSuccess(data.message || "Akun berhasil dibuat");

   const role = code === "admin123" ? "admin" : "customer";

const users = JSON.parse(localStorage.getItem("users")) || [];

users.push({
  fullName,
  phone,
  username,
  email,
  password,
  role,
  isNew: true, // 🔥 INI PENTING
});

localStorage.setItem("users", JSON.stringify(users));

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch (err) {
    console.error(err);
    setError("Server tidak aktif / backend belum jalan");
  }
};

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup(); // ✅ FIX (tadi kamu salah handleLogin)
      }}
    >
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-[380px]">
          <h1 className="text-3xl font-bold text-center mb-2">
            Create account
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Sign up to get started
          </p>

          {/* FULL NAME */}
          <label className="text-sm text-gray-300">Full Name</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-4 mt-1">
            <User size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Your full name"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* PHONE */}
          <label className="text-sm text-gray-300">Phone Number</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-4 mt-1">
            <Phone size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Masukkan nomor telepon"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* USERNAME */}
          <label className="text-sm text-gray-300">Username</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-4 mt-1">
            <User size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="your username"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <label className="text-sm text-gray-300">Email</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-4 mt-1">
            <Mail size={18} className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="you@example.com"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <label className="text-sm text-gray-300">Password</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-4 mt-1">
            <Lock size={18} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="••••••••"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CODE */}
          <label className="text-sm text-gray-300">Code (optional)</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-2 mt-1">
            <Key size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Masukkan Kode (optional)"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="text-green-500 text-sm mb-3 text-center">
              {success}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold mb-4"
          >
            Sign up
          </button>

          {/* LOGIN */}
          <p className="text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-red-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
