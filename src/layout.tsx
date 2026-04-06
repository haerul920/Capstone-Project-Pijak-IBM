import type { Metadata } from "next";
import "./globals.css"; // Pastikan path file CSS Anda benar
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  title: "SalesForecast AI Dashboard",
  description: "AI Sales Forecasting Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
