'use client';

import { useEffect, useState } from 'react';
import NewProducts from '@/components/sections/NewProducts';
import SaleProducts from '@/components/sections/SaleProducts';
import BestsellerSlider from '@/components/sections/BestsellerSlider';
import type { CatalogProduct } from '@/lib/products';

const ROTATE_MS = 2 * 60 * 1000;

export default function HomePicks({
  newProducts,
  saleProducts,
  bestsellers = [],
}: {
  newProducts: CatalogProduct[];
  saleProducts: CatalogProduct[];
  bestsellers?: CatalogProduct[];
}) {
  const [news, setNews] = useState(newProducts);
  const [sale, setSale] = useState(saleProducts);

  useEffect(() => {
    const rotate = async () => {
      try {
        const res = await fetch('/api/home-picks', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { newProducts?: CatalogProduct[]; saleProducts?: CatalogProduct[] };
        if (data.newProducts?.length) setNews(data.newProducts);
        if (data.saleProducts?.length) setSale(data.saleProducts);
      } catch {
        /* keep current cards */
      }
    };

    const id = window.setInterval(rotate, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <NewProducts key={news.map((item) => item.id).join('-')} products={news} />
      <BestsellerSlider products={bestsellers.length ? bestsellers : (sale.length ? sale : news).slice(0, 3)} />
      <SaleProducts key={sale.map((item) => item.id).join('-')} products={sale} />
    </>
  );
}
