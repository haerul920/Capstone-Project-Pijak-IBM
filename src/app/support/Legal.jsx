"use client";
import SupportLayout from "../../components/SupportLayout";

export default function Legal() {
  const articles = [{ title: "Privacy Policy", desc: "Kebijakan privasi" }];

  return <SupportLayout title="Legal" articles={articles} />;
}
