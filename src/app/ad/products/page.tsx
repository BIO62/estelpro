'use client';

import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface ProductItem {
  id: string;
  code: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  inStock: boolean;
  image: string;
}

export default function AdProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(
    DEMO_PRODUCTS.map((p, idx) => ({
      id: p.id,
      code: `EST-${1000 + idx}`,
      name: p.name,
      price: p.price,
      category: idx % 2 === 0 ? 'Үс арчилгаа' : 'Үсний будаг',
      stock: 24 - idx * 5,
      inStock: true,
      image: p.image,
    }))
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Үс арчилгаа');
  const [newStock, setNewStock] = useState('20');

  const handleToggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    const newItem: ProductItem = {
      id: String(Date.now()),
      code: newCode || `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      price: Number(newPrice),
      category: newCategory,
      stock: Number(newStock) || 0,
      inStock: Number(newStock) > 0,
      image: 'images/demo/product6.jpg',
    };
    setProducts([newItem, ...products]);
    setShowAddModal(false);
    setNewName('');
    setNewCode('');
    setNewPrice('');
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Бүтээгдэхүүн & Үлдэгдэл
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Нийт {products.length} барааны үнэ, үлдэгдэл тоо ширхэг, нөөцийн удирдлага
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all w-fit"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Шинэ бүтээгдэхүүн нэмэх</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'Үс арчилгаа', 'Үсний будаг'].map((cat) => (
              <button
                key={cat}
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

        {/* Table */}
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
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://alphalabs.mn/nextstore-html/estel/${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-gray-900">{p.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-gray-600 font-bold">
                    {p.code}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-black text-gray-900 font-mono text-xs">
                    {formatPrice(p.price)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-gray-800'}`}>
                      {p.stock} ширхэг
                    </span>
                    {p.stock <= 5 && (
                      <span className="block text-[10px] text-rose-600 font-bold">Үлдэгдэл бага!</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                        p.inStock
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                      }`}
                    >
                      {p.inStock ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3" />}
                      <span>{p.inStock ? 'Борлуулагдаж буй' : 'Дууссан'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-lg space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <span>Шинэ бүтээгдэхүүн нэмэх</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Барааны нэр</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Жишээ: ESTEL Haute Couture Тосон Будаг 60мл"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Код / SKU</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="EST-2026"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ангилал</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white"
                  >
                    <option value="Үс арчилгаа">Үс арчилгаа</option>
                    <option value="Үсний будаг">Үсний будаг</option>
                    <option value="Хэлбэржүүлэлт">Хэлбэржүүлэлт</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Үнэ (₮)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Үлдэгдэл тоо (ш)</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="20"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold shadow-xs"
                >
                  Бараа нэмэх
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
