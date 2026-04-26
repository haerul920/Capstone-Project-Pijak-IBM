"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { addNotification } from "../utils/notification";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    (u) =>
      (identifier === u.username || identifier === u.email) &&
      password === u.password
  );

  // ❌ LOGIN GAGAL
  if (!foundUser) {
    setError("Username atau password salah");

    // 🔥 HANYA ADMIN YANG DICATAT
    // tapi karena gagal, kita gak tahu ini admin atau bukan
    // jadi kita cek username/email dulu
    const maybeAdmin = users.find(
      (u) =>
        (identifier === u.username || identifier === u.email) &&
        u.role === "admin"
    );

    if (maybeAdmin) {
      addNotification("Admin login gagal", "security");
    }

    return;
  }

  // ✅ LOGIN BERHASIL
  if (foundUser.role === "admin") {
    addNotification(`Admin berhasil login: ${foundUser.username}`, "info");
  }

  const loggedInUser = {
    ...foundUser,
    isLogin: true,
  };

  localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

  window.dispatchEvent(new Event("userUpdated"));

  if (loggedInUser.role === "admin") {
    router.push("/admin/dashboard");
  } else {
    router.push("/user/landingpages");
  }
};

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-[380px]">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-gray-400 text-center mb-8">
            Sign in to your account
          </p>

          {/* EMAIL */}
          <label className="text-sm text-gray-300">Email/Username</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-4 mt-1">
            <Mail size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Email or username"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <label className="text-sm text-gray-300">Password</label>
          <div className="flex items-center bg-[#111] border border-[#333] rounded-xl px-3 py-3 mb-2 mt-1">
            <Lock size={18} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Masukkan Password Anda"
              className="bg-transparent outline-none w-full text-white"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold mb-4"
          >
            Sign in
          </button>

          {/* SIGNUP */}
          <p className="text-center mt-4 text-gray-400">
            Don't have an account?
            <Link href="/signup" className="text-red-500 ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}