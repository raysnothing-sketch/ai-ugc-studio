import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-ugc-studio-liard.vercel.app'),
  title: 'AI UGC Studio — Personal Edition',
  description: 'Your all-in-one AI creative studio for marketing, content and business. Studio privé de production marketing et création vidéo UGC.',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
  openGraph: {
    title: 'AI UGC Studio — Personal Edition',
    description: 'Plan. Create. Grow. Your all-in-one AI creative studio for marketing, content and business.',
    images: [
      {
        url: '/banner.jpg',
        width: 1200,
        height: 480,
        alt: 'AI UGC Studio — Personal Edition'
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[#07080a] text-[#f5f5f3] antialiased min-h-screen selection:bg-[#d4af37]/30 selection:text-gold-200">
        {children}
      </body>
    </html>
  );
}
