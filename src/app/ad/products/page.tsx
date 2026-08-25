'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Edit2, Package, Search, XCircle } from 'lucide-react';

import { formatPrice } from '@/lib/utils';

type ProductItem = {
  id: string;
  code: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  inStock: boolean;
  image: string;
  brand?: string;
};

export default function AdProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [taxons, setTaxons] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [source, setSource] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({
      taxons: '1',
      limit: '500',
    });
    if (search.trim()) params.set('q', search.trim());
    if (categoryFilter !== 'ALL') params.set('taxon', categoryFilter);

    const t = window.setTimeout(() => {
      fetch(`/api/ad/products?${params}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => {
          setSource(data.source || '');
          setTotal(data.total || 0);
          setTaxons(data.taxons || []);
          setProducts(
            (data.results || []).map((p: ProductItem & { category: string }) => ({
              id: p.id,
              code: p.code,
              sku: p.sku || p.code,
              name: p.name,
              price: Number(p.price) || 0,
              category: p.category || '—',
              stock: Number(p.stock) || 0,
              inStock: Boolean(p.inStock ?? (Number(p.stock) || 0) > 0),
              image: p.image || '',
              brand: p.brand,
            })),
          );
          setError(
            data.source === 'empty' || (data.total === 0 && !(data.results || []).length)
              ? 'Бүтээгдэхүүн алга. supabase/products.sql ажиллуулаад npm run import:products -- --enrich-price'
              : '',
          );
        })
        .catch((e) => {
          if (e.name !== 'AbortError') setError('Ачаалж чадсангүй');
        })
        .finally(() => setLoading(false));
    }, 200);

    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [search, categoryFilter]);

  const categoryTabs = useMemo(() => ['ALL', ...taxons.slice(0, 12)], [taxons]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Бүтээгдэхүүн & Үлдэгдэл
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Нийт {total || products.length} бараа
            {source ? ` · эх: ${source}` : ''}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, кодоор хайх..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  categoryFilter === cat
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat === 'ALL' ? 'Бүх ангилал' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 py-8 text-center">Ачаалж байна...</p>
        ) : error ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Бүтээгдэхүүн</th>
                  <th className="py-3 px-4">Код / SKU</th>
                  <th className="py-3 px-4">Ангилал</th>
                  <th className="py-3 px-4">Нэгж Үнэ</th>
                  <th className="py-3 px-4">Үлдэгдэл</th>
                  <th className="py-3 px-4">Төлөв</th>
                  <th className="py-3 px-4 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-gray-900 line-clamp-2">{p.name}</span>
                          {p.brand ? <span className="block text-[10px] text-gray-400">{p.brand}</span> : null}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600 font-bold">{p.code}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-gray-900 font-mono text-xs">
                      {p.price > 0 ? formatPrice(p.price) : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-gray-800'}`}>
                        {p.stock} ширхэг
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}
                      >
                        {p.inStock ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {p.inStock ? 'Борлуулагдаж буй' : 'Дууссан'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Засах">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
