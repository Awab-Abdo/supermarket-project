# سوبرماركت سيد أحمد

مشروع متجر إلكتروني كامل لعرض المنتجات وإضافتها إلى السلة.

## هيكل المشروع

```
project/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/      # صفحات التطبيق
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── admin/  # صفحات لوحة التحكم
│   │   └── utils/      # أدوات المساعدة
│   └── ...
│
└── backend/           # Node.js + Express + MongoDB
    ├── models/        # نماذج قاعدة البيانات
    ├── routes/        # مسارات API
    ├── middleware/    # الوسائط
    ├── uploads/       # مجلد الصور المرفوعة
    └── server.js      # نقطة البداية
```

## التثبيت والتشغيل

### 1. Backend (الخادم)

```bash
cd backend
npm install
npm start
```

### 2. Frontend (الواجهة)

```bash
npm install
npm run dev
```

## بيانات المدير

- البريد الإلكتروني: `admin@supermarket.com`
- كلمة المرور: `admin123`

## الميزات

### للمستخدمين
- تسجيل حساب جديد
- تسجيل الدخول
- تصفح المنتجات
- البحث عن المنتجات
- تصفية حسب الفئات
- إضافة المنتجات للسلة
- تعديل الكميات في السلة
- حذف المنتجات من السلة

### للمدير
- لوحة تحكم كاملة
- إضافة منتجات جديدة
- تعديل المنتجات
- حذف المنتجات
- تغيير الأسعار والكميات
- تغيير حالة المنتج (متوفر/غير متوفر)
- رفع الصور من الجهاز أو استخدام روابط

## الفئات

1. مواد تموينية
2. أدوات منزلية
3. مستحضرات تجميل

## النشر

- Frontend على Netlify
- Backend على Render

## التقنيات المستخدمة

- Frontend: React, JavaScript, Tailwind CSS, Vite
- Backend: Node.js, Express.js, MongoDB Atlas
- Auth: JWT, bcryptjs
