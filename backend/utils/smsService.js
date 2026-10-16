/**
 * سرویس ارسال پیامک اطلاع‌رسانی و احراز هویت
 * پشتیبانی از لاگ کنسول تستی و آماده برای وب‌سرویس کاوه‌نگار یا فراز اس‌ام‌اس
 */

const https = require('https');

class SmsService {
  constructor() {
    this.apiKey = process.env.SMS_API_KEY || 'mock_sms_api_key';
    this.sender = process.env.SMS_SENDER || '10008585';
    this.isProduction = process.env.NODE_ENV === 'production' && this.apiKey !== 'mock_sms_api_key';
  }

  /**
   * لاگ زیبای پیامک در محیط توسعه
   */
  _logMockSms(type, recipient, text) {
    const divider = '━'.repeat(55);
    console.log('\n' + divider);
    console.log(`📱 [سامانه پیامکی قنادی خانگی] - نوع: ${type}`);
    console.log(`👤 گیرنده: ${recipient}`);
    console.log(`💬 متن پیام:\n${text}`);
    console.log(divider + '\n');
  }

  /**
   * ارسال کد تایید یکبار مصرف (OTP)
   * @param {string} phone 
   * @param {string} code 
   */
  async sendOTP(phone, code) {
    const text = `کد ورود به قنادی خانگی:\n${code}\nاعتبار: ۲ دقیقه\nشیرینی لحظات شما با طعم خانگی`;

    if (!this.isProduction) {
      this._logMockSms('کد یکبار مصرف (OTP)', phone, text);
      return { success: true, mock: true, code, phone };
    }

    try {
      // ارسال واقعی از طریق کاوه‌نگار (در صورت تنظیم کلید)
      const encodedText = encodeURIComponent(text);
      const url = `https://api.kavenegar.com/v1/${this.apiKey}/sms/send.json?receptor=${phone}&sender=${this.sender}&message=${encodedText}`;
      
      return await this._makeRequest(url);
    } catch (error) {
      console.error('خطا در ارسال پیامک OTP:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * ارسال وضعیت سفارش به مشتری
   * @param {string} phone 
   * @param {string} status 
   * @param {string} orderId 
   */
  async sendOrderStatus(phone, status, orderId) {
    const text = `مشتری عزیز،\nوضعیت سفارش شما (${orderId}) تغییر کرد:\n«${status}»\nقنادی و نانوایی خانگی آبادان و خرمشهر`;

    if (!this.isProduction) {
      this._logMockSms('به‌روزرسانی سفارش', phone, text);
      return { success: true, mock: true, status, orderId };
    }

    try {
      const encodedText = encodeURIComponent(text);
      const url = `https://api.kavenegar.com/v1/${this.apiKey}/sms/send.json?receptor=${phone}&sender=${this.sender}&message=${encodedText}`;
      return await this._makeRequest(url);
    } catch (error) {
      console.error('خطا در ارسال پیامک وضعیت سفارش:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * ارسال اطلاع‌رسانی لیست انتظار به مشتری
   * @param {string} phone 
   * @param {string} message 
   */
  async sendWaitlistNotification(phone, message) {
    const text = `همراه گرامی قنادی خانگی،\n${message}\nجهت تکمیل و ثبت سفارش به وب‌سایت مراجعه فرمایید.`;

    if (!this.isProduction) {
      this._logMockSms('اطلاع‌رسانی لیست انتظار', phone, text);
      return { success: true, mock: true };
    }

    try {
      const encodedText = encodeURIComponent(text);
      const url = `https://api.kavenegar.com/v1/${this.apiKey}/sms/send.json?receptor=${phone}&sender=${this.sender}&message=${encodedText}`;
      return await this._makeRequest(url);
    } catch (error) {
      console.error('خطا در ارسال پیامک لیست انتظار:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * درخواست HTTP استاندارد بدون نیاز به کتابخانه خارجی
   */
  _makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ success: res.statusCode === 200, data: parsed });
          } catch (e) {
            resolve({ success: res.statusCode === 200, raw: data });
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = new SmsService();
