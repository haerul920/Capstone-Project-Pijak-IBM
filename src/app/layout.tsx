import '../styles/index.css';

export const metadata = {
  title: 'Toko Lumina',
  description: 'Dibuat dengan Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
