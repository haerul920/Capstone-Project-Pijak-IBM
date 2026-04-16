"use client";

import SupportLayout from "../../components/SupportLayout";

export default function Billing() {
  const articles = [
    { title: "Metode pembayaran", desc: "Cara bayar" },
    { title: "Refund", desc: "Pengembalian dana" },
  ];

  return <SupportLayout title="Billing & Payments" articles={articles} />;
}
