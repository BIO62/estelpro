import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import './wrap.css';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { ASSET_BASE } from '@/lib/constants';
import { storefrontMenuTaxons } from '@/lib/storefront-products';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'ESTEL Professional Mongolia',
  description: 'ESTEL Professional Mongolia - Мэргэжлийн үс арчилгааны бүтээгдэхүүн',
  icons: {
    icon: `${ASSET_BASE}/images/favicon.svg`,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const taxons = storefrontMenuTaxons('consumer');
  return (
    <html lang="mn">
      <head>
        <link rel="icon" href={`${ASSET_BASE}/images/favicon.svg`} />
      </head>
      <body className={montserrat.className}>
        <ClientLayout taxons={taxons}>{children}</ClientLayout>
      </body>
    </html>
  );
}
