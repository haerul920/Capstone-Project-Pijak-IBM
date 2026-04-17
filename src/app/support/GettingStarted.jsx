"use client";
import SupportLayout from "../../components/SupportLayout";

export default function GettingStarted() {
  const articles = [
    { title: "Cara membuat akun", desc: "Langkah registrasi akun" },
    { title: "Cara login", desc: "Masuk ke sistem" },
  ];

  return <SupportLayout title="Getting Started" articles={articles} />;
}
