'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  Printer,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { DEMO_PRODUCTS, assetUrl } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

export default function CreateOrderPOSPage() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<{ id: string; name: string; price: number; qty: number; image: string }[]>([
    { id: '1', name: DEMO_PRODUCTS[0].name, price: DEMO_PRODUCTS[0].price, qty: 2, image: DEMO_PRODUCTS[0].image },
  ]);
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'qpay' | 'cash' | 'card' | 'bank'>('qpay');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Add product to cart ticket
  const handleAddProduct = (product: typeof DEMO_PRODUCTS[0]) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, image: product.image }];
    });
  };

  const handleQtyChange = (id: string, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemove = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryFee = orderType === 'delivery' && subtotal < 80000 ? 5000 : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    setIsSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#A8841B]" />
            <span>Гараар захиалга бүртгэх (POS / Касс)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Утас, салон эсвэл салбар дээр ирсэн захиалгыг гараар бүртгэж баталгаажуулах
          </p>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-white border border-emerald-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Захиалга амжилттай бүртгэгдлээ!</h2>
            <p className="text-xs text-stone-500 mt-2">
              Захиалгын дугаар:{' '}
              <strong className="text-slate-900 font-mono bg-[#FBF6E9] px-2 py-0.5 rounded-md border border-[#C9A227]/30">EST-9402</strong>
            </p>
            <p className="text-sm font-black text-slate-900 mt-2">Нийт дүн: {formatPrice(total)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-3 bg-white hover:bg-stone-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-stone-200 transition-colors no-underline"
            >
              <Printer className="w-4 h-4" />
              <span>Баримт хэвлэх</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setSelectedItems([]);
                setCustomerName('');
                setCustomerPhone('');
                setAddress('');
              }}
              className="flex-1 py-3 bg-gradient-to-r from-[#C9A227] to-[#B8921F] hover:from-[#B8921F] hover:to-[#A8841B] text-white font-bold rounded-xl text-xs shadow-md shadow-[#C9A227]/25 transition-all"
            >
              Дахин захиалга үүсгэх
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Selector (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">1. Бүтээгдэхүүн сонгох</h2>
              <span className="text-xs text-stone-500">{DEMO_PRODUCTS.length} бараа бэлэн байна</span>
            </div>

            {/* Product Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Барааны нэрээр хайх..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
              />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
              {DEMO_PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="bg-stone-50/70 border border-stone-200 hover:border-[#C9A227]/50 rounded-2xl p-3 cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square bg-white rounded-xl overflow-hidden mb-2 relative border border-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{product.name}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-200">
                    <span className="text-xs font-extrabold text-slate-900">{formatPrice(product.price)}</span>
                    <span className="p-1 rounded-lg bg-[#FBF6E9] text-[#A8841B] group-hover:bg-gradient-to-br group-hover:from-[#C9A227] group-hover:to-[#B8921F] group-hover:text-white transition-all">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {DEMO_PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <div className="text-center py-8 text-stone-400 text-xs">
                Тохирох бараа олдсонгүй.
              </div>
            )}
          </div>

          {/* Right Column: Customer Info & Cart Ticket (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleSubmitOrder} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>2. Захиалгын хуудас & Тооцоо</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FBF6E9] text-[#8A6D14] border border-[#C9A227]/30">
                  {selectedItems.length} сонгосон
                </span>
              </h2>

              {/* Selected Items Ticket */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/80 border border-stone-200 text-xs">
                    <div className="flex-1 overflow-hidden pr-2">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500 font-semibold">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleQtyChange(item.id, -1)} className="p-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-slate-600 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-slate-900 w-4 text-center">{item.qty}</span>
                      <button type="button" onClick={() => handleQtyChange(item.id, 1)} className="p-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-slate-600 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button type="button" onClick={() => handleRemove(item.id)} className="p-1 text-stone-400 hover:text-rose-600 ml-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {selectedItems.length === 0 && (
                  <div className="text-center py-6 text-stone-400 text-xs border border-dashed border-stone-300 rounded-xl">
                    Зүүн талаас бүтээгдэхүүн сонгоно уу
                  </div>
                )}
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Захиалагчийн нэр"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Утасны дугаар"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Delivery vs Pickup */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 rounded-xl border transition-all ${orderType === 'delivery'
                      ? 'bg-gradient-to-r from-[#C9A227] to-[#B8921F] text-white font-bold border-transparent shadow-sm'
                      : 'bg-white border-stone-200 text-slate-500 hover:text-slate-900'}`}
                  >
                    Хүргэлтээр
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 rounded-xl border transition-all ${orderType === 'pickup'
                      ? 'bg-gradient-to-r from-[#C9A227] to-[#B8921F] text-white font-bold border-transparent shadow-sm'
                      : 'bg-white border-stone-200 text-slate-500 hover:text-slate-900'}`}
                  >
                    Салбараас авах
                  </button>
                </div>

                {orderType === 'delivery' && (
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Дэлгэрэнгүй хаяг (Дүүрэг, Хороо, Байр, Орц, Тоот)..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all resize-none"
                    />
                  </div>
                )}

                {/* Payment Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Төлбөрийн хэлбэр
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                    {[
                      { key: 'qpay', label: 'QPay' },
                      { key: 'cash', label: 'Бэлнээр' },
                      { key: 'card', label: 'Пос / Карт' },
                      { key: 'bank', label: 'Дансаар' },
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setPaymentMethod(m.key as any)}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          paymentMethod === m.key
                            ? 'bg-gradient-to-r from-[#C9A227] to-[#B8921F] text-white border-transparent shadow-sm'
                            : 'bg-white border-stone-200 text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount input */}
                <div className="flex items-center justify-between text-xs pt-1 gap-2">
                  <span className="text-slate-600 whitespace-nowrap">Хөнгөлөлт (Салон / VIP %):</span>
                  <select
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#C9A227] cursor-pointer"
                  >
                    <option value={20}>20%</option>
                    <option value={15}>15%</option>
                    <option value={10}>10%</option>
                    <option value={5}>5%</option>
                  </select>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 pt-3 border-t border-stone-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Барааны дүн:</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Хөнгөлөлт ({discountPercent}%):</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Хүргэлт:</span>
                    <span className="font-mono">{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-stone-100">
                  <span>Нийт төлөх:</span>
                  <span className="text-lg text-slate-900 font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={selectedItems.length === 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#C9A227] to-[#B8921F] hover:from-[#B8921F] hover:to-[#A8841B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-[#C9A227]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Захиалга баталгаажуулах</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
