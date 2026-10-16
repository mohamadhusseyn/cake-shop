'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CakeIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { api, INITIAL_PRODUCTS } from '@/lib/api';
import { formatPersianCurrency, formatPersianNumber } from '@/store/adminStore';

interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  category: 'cake' | 'bread' | 'cookie' | 'pastry';
  basePrice: number;
  pricePerKg?: number;
  images: string[];
  isAvailable: boolean;
  maxOrders: number;
  currentOrders?: number;
  weightOptions?: number[];
  fillingOptions?: string[];
  leadTimeHours?: number;
  isSpecialOffer?: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'cake' | 'bread' | 'cookie' | 'pastry'>('cake');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(500000);
  const [pricePerKg, setPricePerKg] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [maxOrders, setMaxOrders] = useState<number>(10);
  const [leadTimeHours, setLeadTimeHours] = useState<number>(24);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isSpecialOffer, setIsSpecialOffer] = useState<boolean>(false);
  const [fillingsInput, setFillingsInput] = useState('موز و گردو, شکلات نوتلا, کارامل لوتوس');

  // Convert INITIAL_PRODUCTS to ProductItem format
  const mappedInitial = INITIAL_PRODUCTS.map((p) => ({
    _id: p.id,
    id: p.id,
    name: p.title,
    description: p.description,
    category: (p.category === 'cake' || p.category === 'bread' || p.category === 'cookie') ? p.category : 'cake',
    basePrice: p.basePrice,
    pricePerKg: 0,
    images: p.images || [],
    isAvailable: p.available,
    maxOrders: p.remainingCount ? p.remainingCount + 5 : 15,
    currentOrders: 5,
    fillingOptions: p.fillings || ['موز و گردو'],
    leadTimeHours: p.prepTimeHours || 24,
    isSpecialOffer: p.isSpecial || false,
  }));

  // Fetch Products from Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products').catch(() => null);

      if (res && res.data?.success && Array.isArray(res.data.products) && res.data.products.length > 0) {
        setProducts(res.data.products);
      } else {
        setProducts(mappedInitial);
      }
    } catch {
      setProducts(mappedInitial);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open Modal for Add
  const handleAddNew = () => {
    setEditingProduct(null);
    setName('');
    setCategory('cake');
    setDescription('');
    setBasePrice(500000);
    setPricePerKg(0);
    setImageUrl(
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'
    );
    setMaxOrders(15);
    setLeadTimeHours(24);
    setIsAvailable(true);
    setIsSpecialOffer(false);
    setFillingsInput('موز و گردو, شکلات نوتلا, کارامل و بادام');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEdit = (prod: ProductItem) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setDescription(prod.description);
    setBasePrice(prod.basePrice);
    setPricePerKg(prod.pricePerKg || 0);
    setImageUrl(prod.images?.[0] || '');
    setMaxOrders(prod.maxOrders || 10);
    setLeadTimeHours(prod.leadTimeHours || 24);
    setIsAvailable(prod.isAvailable);
    setIsSpecialOffer(prod.isSpecialOffer || false);
    setFillingsInput(
      prod.fillingOptions?.join(', ') || 'موز و گردو, شکلات نوتلا'
    );
    setIsModalOpen(true);
  };

  // Toggle Availability Switch
  const handleToggleAvailability = async (product: ProductItem) => {
    const prodId = product._id || product.id;
    if (!prodId) return;

    const newStatus = !product.isAvailable;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        (p._id === prodId || p.id === prodId) ? { ...p, isAvailable: newStatus } : p
      )
    );

    try {
      await api.patch(`/products/${prodId}/toggle`).catch(() => null);
      toast.success(
        newStatus
          ? `محصول «${product.name}» فعال و موجود شد.`
          : `محصول «${product.name}» به وضعیت ناموجود تغییر یافت.`
      );
    } catch {
      toast.error('خطا در به‌روزرسانی وضعیت محصول');
    }
  };

  // Delete Product
  const handleDelete = async (prodId?: string, prodName?: string) => {
    if (!prodId) return;
    if (!confirm(`آیا از حذف محصول «${prodName}» اطمینان دارید؟`)) return;

    try {
      await api.delete(`/products/${prodId}`).catch(() => null);
      setProducts((prev) => prev.filter((p) => p._id !== prodId && p.id !== prodId));
      toast.success(`محصول «${prodName}» با موفقیت حذف شد.`);
    } catch {
      toast.error('خطا در حذف محصول');
    }
  };

  // Save (Create or Update) Product
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !basePrice) {
      toast.error('لطفاً نام، توضیحات و قیمت پایه را وارد فرمایید.');
      return;
    }

    setSaving(true);

    const fillingsArray = fillingsInput
      .split(/[,،]/)
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      basePrice: Number(basePrice),
      pricePerKg: Number(pricePerKg),
      images: imageUrl ? [imageUrl] : [],
      maxOrders: Number(maxOrders),
      leadTimeHours: Number(leadTimeHours),
      isAvailable,
      isSpecialOffer,
      fillingOptions: fillingsArray,
    };

    try {
      if (editingProduct && (editingProduct._id || editingProduct.id)) {
        const id = editingProduct._id || editingProduct.id;
        const res = await api.put(`/products/${id}`, payload).catch(() => null);
        const updated = res?.data?.product || { ...editingProduct, ...payload };

        setProducts((prev) =>
          prev.map((p) => (p._id === id || p.id === id ? updated : p))
        );
        toast.success('محصول با موفقیت ویرایش شد.');
      } else {
        const res = await api.post('/products', payload).catch(() => null);
        const created = res?.data?.product || {
          _id: `prod_${Date.now()}`,
          id: `prod_${Date.now()}`,
          ...payload,
        };

        setProducts((prev) => [created, ...prev]);
        toast.success('محصول جدید با موفقیت به منو اضافه شد.');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'خطا در ذخیره اطلاعات محصول');
    } finally {
      setSaving(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesCat =
      categoryFilter === 'all' || prod.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      prod.name.toLowerCase().includes(q) ||
      prod.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100 flex items-center gap-2">
            <CakeIcon className="w-7 h-7 text-amber-400" />
            <span>مدیریت محصولات کارگاه</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            کنترل منوی کیک‌های سفارشی، نان محلی جنوب، قیمت‌گذاری و سقف سفارش هر نوبت پخت
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all self-start md:self-auto"
        >
          <PlusIcon className="w-5 h-5" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'همه منو' },
            { id: 'cake', label: 'کیک‌ها' },
            { id: 'bread', label: 'نان‌های سنتی' },
            { id: 'cookie', label: 'کلوچه‌ها' },
            { id: 'pastry', label: 'شیرینی‌ها' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categoryFilter === tab.id
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام یا مواد اولیه..."
            className="w-full pl-4 pr-11 py-2 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const prodId = product._id || product.id;
          const mainImage =
            product.images?.[0] ||
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop';

          return (
            <motion.div
              layout
              key={prodId}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-[#141210] border border-stone-800/90 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all"
            >
              <div>
                {/* Product Image Cover */}
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/40" />

                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        product.isAvailable
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800'
                      }`}
                    >
                      {product.isAvailable ? 'موجود' : 'ناموجود'}
                    </span>

                    {product.isSpecialOffer && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold shadow-md">
                        ویژه
                      </span>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 text-stone-300 text-[11px] font-semibold border border-stone-700/60">
                      {product.category === 'cake'
                        ? 'کیک خانگی'
                        : product.category === 'bread'
                        ? 'نان سنتی جنوب'
                        : 'کلوچه محلی'}
                    </span>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-base text-stone-100 group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price & Capacity Metrics */}
                  <div className="pt-2 flex items-center justify-between border-t border-stone-800/80">
                    <div>
                      <span className="text-[11px] text-stone-500 block">قیمت پایه:</span>
                      <span className="text-base font-extrabold text-amber-400">
                        {formatPersianCurrency(product.basePrice)}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[11px] text-stone-500 block">سقف سفارش:</span>
                      <span className="text-xs font-bold text-stone-300 font-mono">
                        {formatPersianNumber(product.maxOrders || 10)} عدد
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Controls & Actions */}
              <div className="p-4 bg-stone-900/60 border-t border-stone-800/80 flex items-center justify-between">
                {/* Quick Toggle Switch for موجود / ناموجود */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(product)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      product.isAvailable ? 'bg-amber-500' : 'bg-stone-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        product.isAvailable ? '-translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-semibold text-stone-400">
                    {product.isAvailable ? 'موجود' : 'ناموجود'}
                  </span>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-amber-400 transition-colors"
                    title="ویرایش محصول"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prodId, product.name)}
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
                    title="حذف محصول"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#141210] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <h3 className="text-xl font-black text-stone-100 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-amber-400" />
                  <span>
                    {editingProduct ? 'ویرایش مشخصات محصول' : 'افزودن محصول جدید به منو'}
                  </span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-4">
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      نام کامل محصول *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثلاً کیک شکلاتی ویژه اروند"
                      required
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      دسته‌بندی *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="cake">کیک خانگی</option>
                      <option value="bread">نان سنتی جنوب</option>
                      <option value="cookie">کلوچه محلی</option>
                      <option value="pastry">شیرینی و تارت</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    توضیحات و مواد تشکیل‌دهنده *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="شرح طعم، مواد ارگانیک، اسفنج کیک و روش پخت..."
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                {/* Prices & Capacities */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      قیمت پایه (تومان) *
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      required
                      min={0}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      افزایش هر کیلو اضافه‌تر (تومان)
                    </label>
                    <input
                      type="number"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(Number(e.target.value))}
                      min={0}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      حداکثر سقف سفارش در هر پخت
                    </label>
                    <input
                      type="number"
                      value={maxOrders}
                      onChange={(e) => setMaxOrders(Number(e.target.value))}
                      min={1}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    آدرس تصویر محصول (URL)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    dir="ltr"
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono text-left focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Fillings */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    فیلینگ‌های قابل انتخاب (با کاما جدا کنید)
                  </label>
                  <input
                    type="text"
                    value={fillingsInput}
                    onChange={(e) => setFillingsInput(e.target.value)}
                    placeholder="موز و گردو, نوتلا, کارامل و بادام"
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-300">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-stone-900 border-stone-700 focus:ring-amber-500"
                    />
                    <span>محصول در حال حاضر موجود است</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-300">
                    <input
                      type="checkbox"
                      checked={isSpecialOffer}
                      onChange={(e) => setIsSpecialOffer(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-stone-900 border-stone-700 focus:ring-amber-500"
                    />
                    <span>نشان پیشنهاد ویژه کارگاه (ستاره‌دار)</span>
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>در حال ذخیره...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>ذخیره تغییرات</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
