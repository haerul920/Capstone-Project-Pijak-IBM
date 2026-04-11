import type { Metadata } from "next";
import "../styles/index.css";
import { ClientLayout } from "./ClientLayout";

export const metadata: Metadata = {
  title: "AI Sales Forecasting Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
