import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('madar_admin_token');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        return config;
      }

      const authData = localStorage.getItem('madar_auth_storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // ignore json parse error
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Friendly Persian Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      'خطایی در برقراری ارتباط با کارگاه کیک رخ داد. لطفاً دوباره تلاش کنید.';

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.');
      }
    } else if (error.response?.status >= 500) {
      toast.error('خطای سرور. تیم فنی کارگاه در حال بررسی هستند.');
    }

    return Promise.reject(error);
  }
);

// TypeScript Interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'cake' | 'bread' | 'cookie';
  basePrice: number; // in Tomans
  images: string[];
  rating: number;
  reviewCount: number;
  available: boolean;
  remainingCount?: number;
  deliveryCities: ('آبادان' | 'خرمشهر')[];
  prepTimeHours: number;
  availableWeights?: { weight: string; multiplier: number }[];
  fillings?: string[];
  ribbonColors?: { name: string; hex: string }[];
  ingredients?: string[];
  isSpecial?: boolean;
}

export interface User {
  phone: string;
  fullName?: string;
  city?: 'آبادان' | 'خرمشهر';
  address?: string;
  postalCode?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  weight?: string;
  filling?: string;
  customText?: string;
  ribbonColor?: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  phone: string;
  customerName: string;
  city: 'آبادان' | 'خرمشهر';
  address: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  status: 'pending' | 'baking' | 'out_for_delivery' | 'delivered';
  createdAt: string;
}

export interface WaitlistSubmission {
  phone: string;
  name: string;
  city: 'آبادان' | 'خرمشهر';
  cakeType: string;
  notes?: string;
}

// Mock & Initial Data for Abadan / Khorramshahr Cake Workshop
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'cake-arvand-velvet',
    title: 'کیک خامه‌ای کارامل و نوتلا اروند',
    description: 'کیک اسفنجی وانیلی لطیف با فیلینگ کرم کارامل کارگاهی، شکلات نوتلا اصل و گردوی تست شده خوزستان',
    category: 'cake',
    basePrice: 580000,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 38,
    available: true,
    remainingCount: 4,
    deliveryCities: ['آبادان', 'خرمشهر'],
    prepTimeHours: 24,
    availableWeights: [
      { weight: '۱ کیلوگرم (۴ تا ۶ نفر)', multiplier: 1 },
      { weight: '۱.۵ کیلوگرم (۸ تا ۱۰ نفر)', multiplier: 1.5 },
      { weight: '۲ کیلوگرم (۱۲ تا ۱۵ نفر)', multiplier: 2.0 },
      { weight: '۳ کیلوگرم (۲۰ تا ۲۵ نفر)', multiplier: 2.9 },
    ],
    fillings: ['خامه قنادی اعلا و مغز گردو', 'شکلات نوتلا بلژیکی و فندق', 'موز و گردو و کارامل لوتوس', 'توت‌فرنگی تازه و خامه'],
    ribbonColors: [
      { name: 'رز گلد براق', hex: '#E0A99E' },
      { name: 'طلایی متالیک', hex: '#D4AF37' },
      { name: 'کرم ابریشمی', hex: '#FDFBF7' },
      { name: 'زرشکی اروند', hex: '#881337' },
    ],
    ingredients: ['آرد سبوس‌دار گندم محلی', 'شیر تازه روز', 'کره حیوانی اعلا', 'تخم‌مرغ محلی', 'وانیل ماداگاسکار'],
    isSpecial: true,
  },
  {
    id: 'bread-south-date',
    title: 'نان خرمایی اصیل جنوب (دست‌پخت مادر)',
    description: 'نان سنتی تهیه شده با خرمای دشتستان و استعمران جنوب، آغشته به هل سبز، گلاب دوآتشه و کنجد بوداده',
    category: 'bread',
    basePrice: 220000,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop',
    ],
    rating: 5.0,
    reviewCount: 64,
    available: true,
    remainingCount: 8,
    deliveryCities: ['آبادان', 'خرمشهر'],
    prepTimeHours: 12,
    availableWeights: [
      { weight: 'بسته نیم کیلویی (۱۰ عدد)', multiplier: 1 },
      { weight: 'بسته یک کیلویی (۲۰ عدد)', multiplier: 1.9 },
    ],
    fillings: ['مغز خرمای کبکاب با گردو و زنجبیل', 'خرمای ساده با کنجد و رازیانه'],
    ribbonColors: [
      { name: 'روبان نخی سنتی کرم', hex: '#EDE0C3' },
      { name: 'سبز کهربایی', hex: '#065F46' },
    ],
    ingredients: ['خرمای شیرین جنوب', 'آرد مرغوب', 'روغن حیوانی', 'هل معطر', 'کنجد سفید و سیاه'],
    isSpecial: true,
  },
  {
    id: 'cookie-zafaran-koluche',
    title: 'کلوچه خانگی زعفرانی شوشتری-آبادانی',
    description: 'کلوچه‌های ترد و خوش‌عطر سنتی با زیره، شکر قهوه‌ای و شهد زعفران اعلا، پخت صبح زود کارگاه مادر',
    category: 'cookie',
    basePrice: 190000,
    images: [
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 42,
    available: true,
    remainingCount: 5,
    deliveryCities: ['آبادان', 'خرمشهر'],
    prepTimeHours: 12,
    availableWeights: [
      { weight: 'بسته ۶۰۰ گرمی (۱۲ عددی)', multiplier: 1 },
      { weight: 'بسته ۱.۲ کیلوگرمی (۲۴ عددی)', multiplier: 1.9 },
    ],
    fillings: ['ساده سنتی با رومال زرده و زعفران', 'مغز پسته و شکر قهوه‌ای'],
    ribbonColors: [
      { name: 'طلایی زعفرانی', hex: '#F59E0B' },
      { name: 'قرمز یاقوتی', hex: '#BE123C' },
    ],
    ingredients: ['زعفران قائنات', 'آرد ستاره', 'شیر', 'زیره سبز کوهی', 'گلاب'],
    isSpecial: true,
  },
  {
    id: 'cake-pistachio-rose',
    title: 'کیک اسفنجی پسته و هل با گلاب اعلا',
    description: 'طعم بهشتی شیرینی سنتی با پودر پسته تازه و بافت فوق‌العاده نرم اسفنجی، تزیین شده با گلبرگ رز محمدی',
    category: 'cake',
    basePrice: 620000,
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800&auto=format&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 29,
    available: true,
    remainingCount: 3,
    deliveryCities: ['آبادان', 'خرمشهر'],
    prepTimeHours: 24,
    availableWeights: [
      { weight: '۱ کیلوگرم', multiplier: 1 },
      { weight: '۱.۵ کیلوگرم', multiplier: 1.5 },
      { weight: '۲ کیلوگرم', multiplier: 2.0 },
    ],
    fillings: ['کرم پسته دست‌ساز با خامه ارگانیک', 'خامه سفید با تکه‌های شکلات سفید'],
    ribbonColors: [
      { name: 'سبز پسته', hex: '#10B981' },
      { name: 'صورتی ملایم', hex: '#FB7185' },
    ],
    ingredients: ['پسته تازه جنوب', 'گلاب دوآتشه کاشان', 'تخم‌مرغ', 'آرد گندم', 'هل'],
    isSpecial: false,
  },
  {
    id: 'bread-sesame-simit',
    title: 'نان صبحانه کنجدی داغ تنوری',
    description: 'نان لطیف صبحگاهی با بافت پنیری، رومال شهد خرما و کنجد برشته فراوان، پخت اول صبح کارگاه',
    category: 'bread',
    basePrice: 150000,
    images: [
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    ],
    rating: 4.7,
    reviewCount: 31,
    available: true,
    remainingCount: 12,
    deliveryCities: ['آبادان', 'خرمشهر'],
    prepTimeHours: 6,
    availableWeights: [
      { weight: 'بسته ۴ عددی', multiplier: 1 },
      { weight: 'بسته ۸ عددی', multiplier: 1.9 },
    ],
    fillings: ['ساده کنجدی', 'مغزدار با پنیر محلی و سیاهدانه'],
    ribbonColors: [
      { name: 'کنفی روستیک', hex: '#D5BDA9' },
    ],
    ingredients: ['آرد سبوس‌دار', 'کنجد بو داده خوزستان', 'شیره خرما', 'مایه خمیر طبیعی'],
    isSpecial: false,
  },
  {
    id: 'cookie-choc-hazelnut',
    title: 'کوکی دبل چاکلت خانگی با فندق تفت‌داده',
    description: 'کوکی‌های ترد از بیرون و لایه نرم شکلاتی مذاب از داخل، همراه با فندق‌های درشت برشته',
    category: 'cookie',
    basePrice: 240000,
    images: [
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop',
    ],
    rating: 5.0,
    reviewCount: 53,
    available: true,
    remainingCount: 7,
    deliveryCities: ['آبادان', 'خرمشهر'],
    prepTimeHours: 12,
    availableWeights: [
      { weight: 'جعبه ۶ عددی ویژه', multiplier: 1 },
      { weight: 'جعبه ۱۲ عددی کادویی', multiplier: 1.95 },
    ],
    fillings: ['شکلات شیری و فندق', 'شکلات تلخ ۷۲٪ با نمک دریایی'],
    ribbonColors: [
      { name: 'شکلاتی قهوه‌ای', hex: '#5A4526' },
      { name: 'طلایی', hex: '#F59E0B' },
    ],
    ingredients: ['شکلات خالص بلژیکی', 'فندق درجه یک', 'کره پاستوریزه محلی', 'شکر قهوه‌ای'],
    isSpecial: false,
  },
];
