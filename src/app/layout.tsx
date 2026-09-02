import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import './wrap.css';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { getStorefrontMenuTaxons } from '@/lib/storefront-products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'ESTEL Professional Mongolia',
  description: 'ESTEL Professional Mongolia - Мэргэжлийн үс арчилгааны бүтээгдэхүүн',
  icons: {
    icon: '/images/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const taxons = await getStorefrontMenuTaxons('consumer');
  return (
    <html lang="mn">
      <head>
        <link rel="icon" href="/images/favicon.svg" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&subset=cyrillic,latin" />
      </head>
      <body>
        <ClientLayout taxons={taxons}>{children}</ClientLayout>
      </body>
    </html>
  );
}
