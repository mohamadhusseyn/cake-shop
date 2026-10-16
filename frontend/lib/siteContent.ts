export interface LayerContent {
  id: string;
  number: string;
  name: string;
  tagline: string;
  depth: string;
  thickness: string;
  icon: string;
  story: string;
  motherSecret: string;
  pairWith: string;
  caloriesNote: string;
}

export interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export interface SiteContent {
  general: {
    brandNameFa: string;
    brandNameEn: string;
    brandFullName: string;
    tagline: string;
    cityCoverage: string;
    phone: string;
    phoneDisplay: string;
    mobile: string;
    instagram: string;
    address: string;
    workingHours: string;
  };
  navbar: {
    logoTitle: string;
    logoSubtitle: string;
    orderBtnText: string;
  };
  hero: {
    pillBadge: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    primaryBtnText: string;
    secondaryBtnText: string;
    scrollIndicatorText: string;
  };
  cakeDive: {
    badgeText: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    layers: LayerContent[];
  };
  countdown: {
    badge: string;
    title: string;
    subtitle: string;
    dailyLimitText: string;
  };
  featured: {
    badge: string;
    title: string;
    subtitle: string;
    viewAllBtnText: string;
  };
  story: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    experienceYears: string;
    experienceLabel: string;
    quoteText: string;
    quoteLocation: string;
    feature1: string;
    feature2: string;
    readMoreBtnText: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: FAQItem[];
  };
  guarantee: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  footer: {
    aboutTitle: string;
    aboutText: string;
    badgeText: string;
    copyrightText: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  general: {
    brandNameFa: 'ثمین کیک',
    brandNameEn: 'Smin Cake',
    brandFullName: 'کارگاه کیک و شیرینی خانگی ثمین کیک (Smin Cake)',
    tagline: 'عطر اصالت خانگی و طعم به یادماندنی با دستان پر مهر مادر در جنوب',
    cityCoverage: 'پخت روزانه خانگی • توزیع اختصاصی در تمام مناطق آبادان و خرمشهر',
    phone: '06153224490',
    phoneDisplay: '۰۶۱-۵۳۲۲۴۴۹۰',
    mobile: '09163319082',
    instagram: 'smin_cake',
    address: 'خوزستان، آبادان، خیابان امیری، نبش کوچه نسترن، کارگاه تخصصی ثمین کیک',
    workingHours: 'همه‌روزه از ۹ صبح الی ۲۲ شب (سفارش کیک‌های مجلسی با هماهنگی قبلی)',
  },
  navbar: {
    logoTitle: 'ثمین کیک',
    logoSubtitle: 'Smin Cake • پخت روزانه در آبادان و خرمشهر',
    orderBtnText: 'سفارش آنلاین',
  },
  hero: {
    pillBadge: 'پخت روزانه خانگی ثمین کیک • توزیع اختصاصی در آبادان و خرمشهر',
    titlePrefix: 'کارگاه تخصصی کیک',
    titleHighlight: 'ثمین کیک',
    subtitle:
      'عطر نان داغ محلی و طعم به یاد ماندنی کیک‌های لطیف اسفنجی ثمین کیک با دستان پر مهر مادر. تهیه شده از تازه‌ترین مواد ارگانیک جنوب.',
    primaryBtnText: 'مشاهده محصولات و رزرو نوبت پخت',
    secondaryBtnText: 'داستان دست‌پخت مادر',
    scrollIndicatorText: 'کشف لایه‌های طعم و اصالت ثمین کیک',
  },
  cakeDive: {
    badgeText: 'تجربه تعاملی • غوطه‌وری در لایه‌های طعم خانگی ثمین کیک',
    titlePrefix: 'سفر به درون کیک‌های شاهکار',
    titleHighlight: 'ثمین کیک (Smin Cake)',
    subtitle:
      'صفحه را اسکرول کنید یا روی هر لایه ضربه بزنید تا بافت کیک باز شده و جزئیات فیلینگ‌ها، عطرهای اصیل جنوبی و رازهای ۱۵ ساله مادر آشکار گردد.',
    layers: [
      {
        id: 'layer-top-cream',
        number: '۱',
        name: 'تاج کیک: خامه ابریشمی و توت‌فرنگی تازه کارون',
        tagline: 'سبک مثل نسیم اروند، با ماندگاری لطیف روی زبان',
        depth: 'سطح فوقانی (۰ تا ۲ سانتی‌متر)',
        thickness: '۱۸ میلی‌متر خامه قنادی خالص',
        icon: '🍓',
        story:
          'مادر در کارگاه ثمین کیک معتقد است اولین تماس لب با کیک، باید حس ابریشمین و طراوت داشته باشد. خامه‌ای حیوانی بدون ذره‌ای پالم یا چربی گیاهی که با کمترین شکر ممکن و همراه با توت‌فرنگی‌های دست‌چین بهمن‌شیر فرم می‌گیرد.',
        motherSecret:
          '«زدن خامه حیوانی تازه فقط در دمای دقیق ۴ درجه سانتی‌گراد و خواباندن توت‌فرنگی‌ها به مدت یک ساعت در افشره گل سرخ محمدی پیش از چیدمان.»',
        pairWith: 'چای بهارنارنج داغ یا قهوه اسپرسو لایت',
        caloriesNote: 'فوق‌العاده سبک، کمتر از ۷۰ کیلوکالری در هر برش خامه',
      },
      {
        id: 'layer-filling-caramel',
        number: '۲',
        name: 'فیلینگ میانی: کارامل لوتوس دست‌ساز و گاناش بلژیکی',
        tagline: 'روان، براق، با طعم عمیق تافی کره‌ای و گاناش ۶۰٪',
        depth: 'عمق ۲ تا ۳.۵ سانتی‌متر',
        thickness: '۱۵ میلی‌متر لایه فیلینگ متمرکز',
        icon: '🍯',
        story:
          'قلب تپنده طعم ثمین کیک؛ جایی که کارامل تافی دست‌ساز که ساعت‌ها با کره اعلا و شکر قهوه‌ای جوشیده با شکلات غلیظ نوتلا و بیسکویت کرانچ لوتوس ترکیب می‌شود تا هر گازی از کیک، انفجاری از لذت باشد.',
        motherSecret:
          '«سوزاندن کنترل‌شده شکر قهوه‌ای با کره محلی و افزودن یک پر نمک دریایی خلیج فارس برای ایجاد هارمونی کارامل شور شگفت‌انگیز.»',
        pairWith: 'شیر قهوه کاراملی یا چای سیلان دارچینی',
        caloriesNote: 'انرژی‌بخش و نشاط‌آور ویژه عصرانه‌های صمیمی',
      },
      {
        id: 'layer-sponge-vanilla',
        number: '۳',
        name: 'بافت اسفنجی: کیک اسفنج پنبه‌ای با عطر هل و بهارنارنج',
        tagline: 'مانند ابر پنبه‌ای، مرطوب‌شده با شربت زعفران',
        depth: 'عمق ۳.۵ تا ۶ سانتی‌متر',
        thickness: '۲۵ میلی‌متر اسفنج پنبه‌ای دست‌بافت',
        icon: '🥞',
        story:
          'اسفنج کیک ثمین، راز شهرت ۱۵ ساله مادر است. کیکی که هیچ‌گاه خشک نمی‌شود؛ چرا که بلافاصله پس از خروج از فر سنتی، با افشره ملایم زعفران قائنات، دانه‌های کوبیده هل سبز هندی و وانیل ماداگاسکار سیراب می‌گردد.',
        motherSecret:
          '«زدن زرده و سفیده تخم‌مرغ محلی در دو ظرف کاملاً مجزا به مدت ۱۲ دقیقه تا رسیدن به حالت فوم برفی و عدم استفاده از حتی یک گرم بیکینگ‌پودر صنعتی.»',
        pairWith: 'چای سیاه قندپهلوی دبش آبادانی',
        caloriesNote: 'فاقد هرگونه گلوتن سنگین صنعتی و فوق‌العاده زودهضم',
      },
      {
        id: 'layer-nuts-base',
        number: '۴',
        name: 'مغز و پایه کرانچ: گردوی برشته خوزستان، خلال پسته و خرمای برحی',
        tagline: 'تردی مقاومت‌ناپذیر با شهد غلیظ خرمای نخلستان‌های اروند',
        depth: 'پایه کیک (۶ تا ۸ سانتی‌متر)',
        thickness: '۲۰ میلی‌متر مغز خالص و پایه کره‌ای',
        icon: '🥜',
        story:
          'پایه این کیک تداعی‌گر اصالت اقلیم جنوب است. گردوهای پرچرب نوبرانه که در فر ملایم برشته شده‌اند، خلال پسته رفسنجان و تکه‌های شهدین خرمای برحی، کرانچی شگفت‌انگیز را در زیر لایه‌های نرم کیک به رخ می‌کشند.',
        motherSecret:
          '«تفت دادن مغز گردو با چند قطره گلاب در تابه مسی قبل از اضافه کردن به لایه پایه، تا چربی مفید گردو آزاد شده و طعم گسی آن کاملاً از بین برود.»',
        pairWith: 'قهوه سنتی عربی (دله) یا دمنوش گل‌گاوزبان',
        caloriesNote: 'سرشار از امگا ۳، فسفر، منیزیم و مواد معدنی مغزها',
      },
    ],
  },
  countdown: {
    badge: 'سهمیه پخت روزانه ثمین کیک',
    title: 'ظرفیت سفارش امروز کارگاه ثمین کیک',
    subtitle: 'برای حفظ کیفیت، نهایت طراوت و تازگی مواد، روزانه تعداد مشخصی کیک پخته می‌شود.',
    dailyLimitText: 'ظرفیت کل روزانه: ۲۵ عدد کیک اختصاصی',
  },
  featured: {
    badge: 'برگزیده‌های پرطرفدار ثمین کیک',
    title: 'دست‌پخت‌های شاخص این هفته',
    subtitle: 'سفارش دهید و در ساعت دلخواه در هر کجای آبادان و خرمشهر تحویل بگیرید.',
    viewAllBtnText: 'مشاهده منوی کامل (کیک، نان، کلوچه)',
  },
  story: {
    badge: 'داستان شکل‌گیری برند ثمین کیک (Smin Cake)',
    title: 'از یک فر کوچک در آشپزخانه تا لبخند رضایت مردم آبادان و خرمشهر',
    paragraph1:
      'همه چیز از بوی خوش نان خرمایی و کیک اسفنجی عصر جمعه آغاز شد؛ وقتی بوی شیرینی خانگی تمام کوچه را پر می‌کرد و همسایه‌ها را به درب خانه می‌کشاند. مادر معتقد بود هر کیکی که از دست فر بیرون می‌آید، تکه‌ای از قلب قناد است.',
    paragraph2:
      'امروز در ثمین کیک (Smin Cake)، این رسم دیرین را حفظ کرده‌ایم: بدون افزودنی، بدون رنگ‌های شیمیایی غیرمجاز و فقط با سفارش روز، تا طعم واقعی دست‌پخت یک مادر جنوبی را روی میز مهمانی‌های شما بیاوریم.',
    experienceYears: '۱۵+',
    experienceLabel: 'بیش از ۱۵ سال سابقه پخت خانگی در جنوب',
    quoteText: '«طعم واقعی کیک یعنی یادآور گرمای سفره‌های مادری»',
    quoteLocation: 'کارگاه پخت ثمین کیک در محله امیری آبادان',
    feature1: '۱۰۰٪ کره حیوانی و تخم‌مرغ روز',
    feature2: 'حمل با باکس عایق اختصاصی در گرما',
    readMoreBtnText: 'خواندن داستان کامل و عکس‌های کارگاه',
  },
  faq: {
    badge: 'پاسخ به سوالات پرتکرار مشتریان ثمین کیک',
    title: 'پرسش‌های متداول سفارش کیک و نان در آبادان و خرمشهر',
    subtitle: 'همه چیز درباره روند پخت روزانه، زمان‌بندی تحویل، فیلینگ‌ها و کیفیت مواد ارگانیک',
    items: [
      {
        id: 'faq-1',
        q: 'هزینه و شرایط ارسال کیک و نان خانگی ثمین کیک به شهرهای آبادان و خرمشهر چقدر است؟',
        a: 'ارسال با باکس‌های عایق خنک مخصوص و پیک اختصاصی کارگاه ثمین کیک در آبادان و خرمشهر با هزینه ثابت ۲۵,۰۰۰ تومان انجام می‌شود. سفارش‌های بالای ۱ میلیون تومان به صورت کاملاً رایگان تحویل داده می‌شوند.',
      },
      {
        id: 'faq-2',
        q: 'چقدر قبل از مراسم باید سفارش کیک تولد یا نامزدی را در ثمین کیک ثبت کنیم؟',
        a: 'به دلیل تعهد مادر به تازگی اسفنج و خامه، حداقل ۲۴ الی ۴۸ ساعت قبل از روز مراسم سفارش خود را نهایی کنید تا در نوبت پخت قرار گیرد. نان خرمایی و کلوچه‌ها در صورت باز بودن سهمیه همان روز عصر قابل تحویل هستند.',
      },
      {
        id: 'faq-3',
        q: 'آیا امکان نوشتن متن دلخواه روی کیک و انتخاب رنگ روبان وجود دارد؟',
        a: 'بله، در مرحله انتخاب مشخصات محصول در سایت، می‌توانید فیلد «متن دست‌نویس روی کیک» را با جملات دلخواهتان پر کرده و از میان رنگ‌های متنوع، روبان کادویی جعبه را انتخاب فرمایید.',
      },
      {
        id: 'faq-4',
        q: 'آیا در ثمین کیک از اسانس شیمیایی یا مواد نگه‌دارنده استفاده می‌شود؟',
        a: 'خیر، به هیچ وجه. مادر فقط از آرد گندم تازه، تخم‌مرغ محلی روز، کره حیوانی مرغوب، خرمای تازه نخلستان‌های جنوب، هل سبز هندی و زعفران خالص قائنات استفاده می‌کند.',
      },
      {
        id: 'faq-5',
        q: 'چگونه در صورت تکمیل ظرفیت نوبت پخت در لیست انتظار ثمین کیک ثبت‌نام کنیم؟',
        a: 'در صفحه اول سایت و زیر هر محصول با کلیک روی گزینه «عضویت در لیست انتظار»، با وارد کردن شماره موبایل خود به محض باز شدن سهمیه جدید فرها، پیامک اطلاع‌رسانی دریافت خواهید کرد.',
      },
    ],
  },
  guarantee: {
    title: 'ارسال گرم و تازه ثمین کیک به تمام مناطق آبادان و خرمشهر',
    subtitle:
      'برای جلوگیری از افت کیفیت کیک در گرمای جنوب، تمام سفارش‌ها در باکس‌های عایق خنک با پیک اختصاصی کارگاه تحویل داده می‌شوند.',
    ctaText: 'ثبت سفارش آنلاین کیک',
  },
  footer: {
    aboutTitle: 'کارگاه شیرینی و کیک خانگی ثمین کیک (Smin Cake)',
    aboutText:
      'عطر نان داغ، طعم کیک‌های تازه و نوستالژی کلوچه‌های محلی در قلب آبادان و خرمشهر. تمامی محصولات به صورت روزانه و بدون استفاده از اسانس‌های صنعتی یا نگهدارنده با عشق و مهارت دست‌پخت مادر در ثمین کیک تهیه می‌شوند.',
    badgeText: 'پخت روزانه فقط با سفارش قبلی جهت تضمین نهایت تازگی',
    copyrightText: 'تمامی حقوق برای کارگاه خانگی ثمین کیک (Smin Cake) محفوظ است.',
  },
};

const STORAGE_KEY = 'smin_cake_site_content_v1';

export function getStoredSiteContent(): SiteContent {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONTENT;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    // Deep merge with default to guarantee all fields exist
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      general: { ...DEFAULT_SITE_CONTENT.general, ...(parsed.general || {}) },
      navbar: { ...DEFAULT_SITE_CONTENT.navbar, ...(parsed.navbar || {}) },
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
      cakeDive: { ...DEFAULT_SITE_CONTENT.cakeDive, ...(parsed.cakeDive || {}) },
      countdown: { ...DEFAULT_SITE_CONTENT.countdown, ...(parsed.countdown || {}) },
      featured: { ...DEFAULT_SITE_CONTENT.featured, ...(parsed.featured || {}) },
      story: { ...DEFAULT_SITE_CONTENT.story, ...(parsed.story || {}) },
      faq: { ...DEFAULT_SITE_CONTENT.faq, ...(parsed.faq || {}) },
      guarantee: { ...DEFAULT_SITE_CONTENT.guarantee, ...(parsed.guarantee || {}) },
      footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent('smin_content_updated', { detail: content }));
  } catch (err) {
    console.error('Error saving site content:', err);
  }
}

export function resetSiteContent(): SiteContent {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('smin_content_updated', { detail: DEFAULT_SITE_CONTENT }));
    } catch (err) {
      console.error('Error resetting site content:', err);
    }
  }
  return DEFAULT_SITE_CONTENT;
}
