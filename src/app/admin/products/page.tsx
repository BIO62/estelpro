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
  Upload,
  Sparkles,
  Layers
} from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface AdminProduct {
  id: string;
  code: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  stock: number;
  inStock: boolean;
  image: string;
  variants?: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(
    DEMO_PRODUCTS.map((p, idx) => ({
      ...p,
      code: `EST-${1000 + idx}`,
      category: idx % 2 === 0 ? 'Үс арчилгаа' : 'Үсний будаг',
      stock: 24 - idx * 5,
      inStock: true,
    }))
  );
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
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
    const newItem = {
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Бүтээгдэхүүн & Үлдэгдлийн Удирдлага</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Барааны үнэ, үлдэгдэл тоо ширхэг, нөөцийг хянах болон шинэ бараа нэмэх
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Шинэ бүтээгдэхүүн нэмэх</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, код, ангиллаар хайх..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Нийт <strong className="text-white">{filteredProducts.length}</strong> бүтээгдэхүүн
          </span>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-950/40">
                <th className="py-3.5 px-4 rounded-l-xl">Зураг / Код</th>
                <th className="py-3.5 px-4">Бүтээгдэхүүний нэр</th>
                <th className="py-3.5 px-4">Ангилал</th>
                <th className="py-3.5 px-4">Нэгж Үнэ</th>
                <th className="py-3.5 px-4">Үлдэгдэл</th>
                <th className="py-3.5 px-4">Төлөв</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                  {/* Image & Code */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://alphalabs.mn/nextstore-html/estel/${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-mono text-[11px] text-amber-400 font-bold">{p.code}</span>
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-bold text-white max-w-xs">
                    {p.name}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-black text-amber-400 text-sm font-mono">
                    {formatPrice(p.price)}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span className={`font-bold ${p.stock <= 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {p.stock} ш
                    </span>
                    {p.stock <= 5 && (
                      <span className="block text-[9px] text-rose-400 font-bold">Үлдэгдэл бага!</span>
                    )}
                  </td>

                  {/* InStock Toggle */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                        p.inStock
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {p.inStock ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3" />}
                      <span>{p.inStock ? 'Борлуулагдаж буй' : 'Дууссан'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-2">
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Шинэ бүтээгдэхүүн нэмэх</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Барааны нэр</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Жишээ: ESTEL Curex Шампунь 250мл"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Барааны код / SKU</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="EST-2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Ангилал</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Үс арчилгаа">Үс арчилгаа</option>
                    <option value="Үсний будаг">Үсний будаг</option>
                    <option value="Арьс & Бие">Арьс & Бие</option>
                    <option value="Хэлбэржүүлэлт">Хэлбэржүүлэлт</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Үнэ (₮)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Нөөцийн тоо (ш)</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="20"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
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
