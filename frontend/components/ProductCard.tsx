'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, SparklesIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { Product } from '@/lib/api';
import { formatPrice, toPersianDigits } from '@/store/cartStore';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { BorderBeam } from '@/components/ui/BorderBeam';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.reviewCount || 12);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative h-full flex flex-col justify-between"
    >
      <SpotlightCard
        spotlightColor="rgba(244, 63, 94, 0.15)"
        className="h-full flex flex-col justify-between p-3.5 sm:p-5 border-roseBakery-200/70 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
      >
        {product.isSpecial && (
          <BorderBeam duration={8} colorFrom="#f43f5e" colorTo="#fbbf24" />
        )}
        <div>
          {/* Image Container with Badges */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream-200">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bakeryBrown-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Availability Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/85 text-bakeryBrown-800 shadow-sm border border-white/60">
              {product.available ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {product.remainingCount
                      ? `${toPersianDigits(product.remainingCount)} سهمیه باقیمانده`
                      : 'موجود برای سفارش'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-roseBakery-500" />
                  <span className="text-roseBakery-600">تکمیل ظرفیت پخت</span>
                </>
              )}
            </div>

            {/* VibeFarsi Interactive Like Button on top left */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className={`absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-all shadow-md ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-rose-500/40'
                  : 'bg-white/85 text-bakeryBrown-700 hover:text-rose-500 border border-white/60'
              }`}
              title="علاقه‌مندی"
            >
              {isLiked ? (
                <HeartIcon className="w-3.5 h-3.5 fill-white text-white animate-[ping_0.3s_ease-out_1]" />
              ) : (
                <HeartOutlineIcon className="w-3.5 h-3.5" />
              )}
              <span className="text-[11px] font-mono">{toPersianDigits(likeCount)}</span>
            </motion.button>

            {/* Special Workshop Badge */}
            {product.isSpecial && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md bg-amberWarm-500/90 text-white shadow-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>پیشنهاد مادر</span>
              </div>
            )}

            {/* City Delivery indicator */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-medium text-white/95 backdrop-blur-sm bg-black/40 px-2.5 py-0.5 rounded-lg">
              <MapPinIcon className="w-3.5 h-3.5 text-roseBakery-300" />
              <span>ارسال آبادان و خرمشهر</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="mt-4 px-1">
            {/* Rating & Category */}
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-roseBakery-600 bg-roseBakery-50 px-2.5 py-0.5 rounded-md">
                {product.category === 'cake'
                  ? 'کیک خانگی'
                  : product.category === 'bread'
                  ? 'نان سنتی جنوب'
                  : 'کلوچه و شیرینی'}
              </span>

              <div className="flex items-center gap-1 text-amberWarm-600 font-bold">
                <StarIcon className="w-4 h-4 fill-amberWarm-400" />
                <span>{toPersianDigits(product.rating.toFixed(1))}</span>
                <span className="text-bakeryBrown-400 text-[11px]">
                  ({toPersianDigits(product.reviewCount)})
                </span>
              </div>
            </div>

            {/* Title */}
            <Link href={`/products/${product.id}`} title={`سفارش آنلاین ${product.title}`}>
              <h3 className="text-base sm:text-lg font-bold text-bakeryBrown-900 group-hover:text-roseBakery-600 transition-colors line-clamp-1 mb-2 cursor-pointer">
                {product.title}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-xs sm:text-sm text-bakeryBrown-600 line-clamp-2 leading-relaxed mb-4">
              {product.description}
            </p>
          </div>
        </div>

        {/* Footer: Price and CTA (VibeFarsi Shimmer Glow Button) */}
        <div className="pt-3 border-t border-cream-200/80 flex items-center justify-between gap-3 px-1 mt-auto">
          <div>
            <span className="block text-[11px] text-bakeryBrown-500">قیمت پایه:</span>
            <span className="text-sm sm:text-base font-extrabold text-roseBakery-600">
              {formatPrice(product.basePrice)}
            </span>
          </div>

          <Link
            href={`/products/${product.id}`}
            title={`انتخاب مشخصات و سفارش آنلاین ${product.title}`}
            className="flex-1 max-w-[130px] sm:max-w-[150px]"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group/btn relative w-full py-2.5 px-3 rounded-xl overflow-hidden bg-gradient-to-r from-roseBakery-500 via-roseBakery-600 to-amberWarm-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-roseBakery-500/25 hover:shadow-lg transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              <span>سفارش و مشخصات</span>
            </motion.button>
          </Link>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};
