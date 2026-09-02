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
import { DEMO_PRODUCTS, assetUrl } from '@/lib/constants';
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
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#A8841B]" />
            <span>Бүтээгдэхүүн & Үлдэгдлийн Удирдлага</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Барааны үнэ, үлдэгдэл тоо ширхэг, нөөцийг хянах болон шинэ бараа нэмэх
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#B8921F] hover:from-[#B8921F] hover:to-[#A8841B] text-white font-bold text-xs shadow-md shadow-[#C9A227]/25 flex items-center gap-2 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Шинэ бүтээгдэхүүн нэмэх</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, код, ангиллаар хайх..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
            />
          </div>
          <span className="text-xs font-semibold text-stone-500">
            Нийт <strong className="text-slate-900">{filteredProducts.length}</strong> бүтээгдэхүүн
          </span>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-bold bg-[#FBF6E9]/60">
                <th className="py-3.5 px-4 rounded-l-xl">Зураг / Код</th>
                <th className="py-3.5 px-4">Бүтээгдэхүүний нэр</th>
                <th className="py-3.5 px-4">Ангилал</th>
                <th className="py-3.5 px-4">Нэгж Үнэ</th>
                <th className="py-3.5 px-4">Үлдэгдэл</th>
                <th className="py-3.5 px-4">Төлөв</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* Image & Code */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-mono text-[11px] text-slate-900 font-bold">{p.code}</span>
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                    {p.name}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 text-[11px] font-semibold">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-black text-slate-900 text-sm font-mono">
                    {formatPrice(p.price)}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {p.stock} ш
                    </span>
                    {p.stock <= 5 && (
                      <span className="block text-[9px] text-rose-600 font-bold">Үлдэгдэл бага!</span>
                    )}
                  </td>

                  {/* InStock Toggle */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                        p.inStock
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}
                    >
                      {p.inStock ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{p.inStock ? 'Борлуулагдаж буй' : 'Дууссан'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-2">
                    <button className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-stone-400">
            <Package className="w-7 h-7 mx-auto mb-1.5 opacity-40" />
            <p>Тохирох бүтээгдэхүүн олдсонгүй.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#A8841B]" />
                <span>Шинэ бүтээгдэхүүн нэмэх</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-slate-900 hover:bg-stone-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Барааны нэр</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Жишээ: ESTEL Curex Шампунь 250мл"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Барааны код / SKU</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="EST-2026"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Ангилал</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#C9A227] cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Үнэ (₮)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Нөөцийн тоо (ш)</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="20"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 bg-white text-slate-600 hover:bg-stone-50 hover:text-slate-900 text-xs font-semibold transition-colors"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#B8921F] hover:from-[#B8921F] hover:to-[#A8841B] text-white text-xs font-bold shadow-md shadow-[#C9A227]/25 transition-all"
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
