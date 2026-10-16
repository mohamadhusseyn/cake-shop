const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/products
 * @desc    دریافت لیست محصولات با فیلتر دسته‌بندی، جستجو و مرتب‌سازی
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, available, sort } = req.query;
    const filter = {};

    // فیلتر دسته‌بندی
    if (category && ['cake', 'bread', 'cookie', 'pastry'].includes(category)) {
      filter.category = category;
    }

    // فیلتر موجودی
    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    }

    // جستجوی متنی در نام، توضیحات یا برچسب‌ها
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    // گزینه‌های مرتب‌سازی
    let sortOptions = { createdAt: -1 }; // پیش‌فرض: جدیدترین‌ها
    if (sort === 'price_asc') {
      sortOptions = { basePrice: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { basePrice: -1 };
    } else if (sort === 'popular') {
      sortOptions = { currentOrders: -1 };
    }

    const products = await Product.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('خطا در دریافت لیست محصولات:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات'
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    دریافت اطلاعات تکمیلی یک محصول
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول مورد نظر یافت نشد'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'شناسه محصول نامعتبر است یا مشکلی در سرور رخ داده است'
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    افزودن محصول جدید به منو
 * @access  Private (Admin Only)
 */
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      pricePerKg,
      images,
      isAvailable,
      maxOrders,
      weightOptions,
      fillingOptions,
      leadTimeHours,
      tags,
      isSpecialOffer
    } = req.body;

    if (!name || !description || !basePrice) {
      return res.status(400).json({
        success: false,
        message: 'نام محصول، توضیحات و قیمت پایه الزامی هستند'
      });
    }

    const product = new Product({
      name,
      description,
      category: category || 'cake',
      basePrice,
      pricePerKg: pricePerKg || 0,
      images: images || [],
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      maxOrders: maxOrders || 10,
      weightOptions: weightOptions || [1, 1.5, 2, 3],
      fillingOptions: fillingOptions || ['موز و گردو', 'شکلات چیپسی', 'کارامل و بادام'],
      leadTimeHours: leadTimeHours || 24,
      tags: tags || [],
      isSpecialOffer: isSpecialOffer || false
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'محصول با موفقیت افزوده شد',
      product
    });
  } catch (error) {
    console.error('خطا در ثبت محصول:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'خطا در ثبت محصول جدید'
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    ویرایش اطلاعات محصول
 * @access  Private (Admin Only)
 */
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    const fieldsToUpdate = [
      'name',
      'description',
      'category',
      'basePrice',
      'pricePerKg',
      'images',
      'isAvailable',
      'maxOrders',
      'weightOptions',
      'fillingOptions',
      'leadTimeHours',
      'tags',
      'isSpecialOffer'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: 'محصول با موفقیت ویرایش شد',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی محصول'
    });
  }
});

/**
 * @route   PATCH /api/products/:id/toggle
 * @desc    فعال/غیرفعال کردن موجودی محصول
 * @access  Private (Admin Only)
 */
router.patch('/:id/toggle', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: product.isAvailable ? 'محصول فعال و در دسترس شد' : 'محصول به حالت ناموجود تغییر یافت',
      isAvailable: product.isAvailable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در تغییر وضعیت محصول'
    });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    حذف محصول
 * @access  Private (Admin Only)
 */
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    res.status(200).json({
      success: true,
      message: 'محصول با موفقیت حذف شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در حذف محصول'
    });
  }
});

/**
 * @route   POST /api/products/:id/rating
 * @desc    ثبت نظر و امتیاز برای محصول
 * @access  Private
 */
router.post('/:id/rating', verifyToken, async (req, res) => {
  try {
    const { score, comment } = req.body;
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'امتیاز باید عددی بین ۱ تا ۵ باشد'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    product.ratings.push({
      userId: req.user._id,
      userName: req.user.name || 'مشتری عزیز',
      score: Number(score),
      comment: comment || ''
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'دیدگاه شما با تشکر ثبت شد',
      averageRating: product.averageRating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت امتیاز محصول'
    });
  }
});

module.exports = router;
