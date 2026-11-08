import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI UGC Studio — Personal Edition',
  description: 'Application web privée de production marketing assistée par IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[#0c0d0f] text-[#f5f5f3] antialiased min-h-screen selection:bg-[#d4af37]/30 selection:text-gold-200">
        {children}
      </body>
    </html>
  );
}
