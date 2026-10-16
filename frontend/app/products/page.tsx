'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ProductCard } from '@/components/ProductCard';
import { INITIAL_PRODUCTS, Product } from '@/lib/api';

type CategoryFilter = 'all' | 'cake' | 'bread' | 'cookie';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const categories = [
    { id: 'all', label: 'همه محصولات (پخت روز)' },
    { id: 'cake', label: 'کیک تولد و مجلسی 🎂' },
    { id: 'bread', label: 'نان سنتی جنوب 🍞' },
    { id: 'cookie', label: 'کلوچه و شیرینی خانگی 🍪' },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-roseBakery-100/80 text-roseBakery-700 text-xs font-bold mb-3">
            <SparklesIcon className="w-4 h-4 text-amberWarm-500 animate-spin" />
            <span>محصولات پخت روزانه کارگاه مادر</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-bakeryBrown-900 mb-3">
            منوی کامل کیک و شیرینی
          </h1>
          <p className="text-sm sm:text-base text-bakeryBrown-600 leading-relaxed">
            تمامی موارد با مواد اولیه تازه و بدون اسانس تهیه می‌شوند. امکان شخصی‌سازی وزن، فیلینگ، و متن روی کیک در صفحه هر محصول فراهم است.
          </p>
        </div>

        {/* Filter and Search Bar Container */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 mb-10 border border-cream-200 shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام کیک، نان، کلوچه..."
                className="w-full pl-4 pr-11 py-2.5 rounded-2xl glass-input text-sm text-bakeryBrown-900 placeholder-bakeryBrown-400"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-bakeryBrown-400 absolute right-3.5 top-3" />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-roseBakery-500 text-white shadow-md shadow-roseBakery-500/25'
                      : 'bg-white/70 text-bakeryBrown-700 hover:bg-roseBakery-50 hover:text-roseBakery-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-bakeryBrown-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="مرتب‌سازی محصولات"
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-bakeryBrown-800 font-semibold cursor-pointer"
              >
                <option value="default">مرتب‌سازی: پیشنهادی</option>
                <option value="rating">بیشترین امتیاز مشتریان</option>
                <option value="price-asc">ارزان‌ترین قیمت</option>
                <option value="price-desc">گران‌ترین قیمت</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid with Staggered Animations */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 rounded-3xl glass-card max-w-md mx-auto p-8">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-lg font-bold text-bakeryBrown-900 mb-2">
              محصولی با این مشخصات یافت نشد
            </h3>
            <p className="text-sm text-bakeryBrown-600 mb-6">
              می‌توانید عبارت دیگری را جستجو کرده یا فیلتر دسته‌بندی را روی همه محصولات بگذارید.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2 rounded-xl bg-roseBakery-500 text-white text-sm font-semibold hover:bg-roseBakery-600 transition-colors"
            >
              مشاهده تمام محصولات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
