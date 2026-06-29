# سوبرماركت سيد أحمد

مشروع متجر إلكتروني كامل لعرض المنتجات وإضافتها إلى السلة.

## هيكل المشروع

```
project/
├── src/                    # Frontend (React + Vite + Tailwind)
│   ├── pages/              # صفحات التطبيق
│   │   ├── WelcomeScreen.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   └── admin/          # صفحات لوحة التحكم
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminAddProduct.jsx
│   │       └── AdminEditProduct.jsx
│   └── utils/              # أدوات المساعدة
│       └── api.js
│
└── backend/                # Backend (Node.js + Express + MongoDB)
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Cart.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── cart.js
    │   └── admin.js
    ├── middleware/
    │   └── auth.js
    ├── uploads/            # مجلد الصور المرفوعة
    └── server.js
```

## التثبيت والتشغيل

### 1. تثبيت وتشغيل Backend

```bash
cd backend
npm install
npm start
```

الخادم سيعمل على: `http://localhost:5000`

### 2. تثبيت وتشغيل Frontend

في مجلد مشروع آخر:

```bash
npm install
npm run dev
```

الواجهة ستعمل على: `http://localhost:3000`

## بيانات المدير

- البريد الإلكتروني: `admin@supermarket.com`
- كلمة المرور: `admin123`

## الميزات

### للمستخدمين
- تسجيل حساب جديد
- تسجيل الدخول
- تصفح المنتجات
- البحث عن المنتجات
- تصفية حسب الفئات (3 فئات)
- إضافة المنتجات للسلة
- تعديل الكميات في السلة
- حذف المنتجات من السلة

### للمدير
- لوحة تحكم كاملة `/admin/login`
- إضافة منتجات جديدة
- تعديل المنتجات
- حذف المنتجات
- تغيير الأسعار والكميات
- تغيير حالة المنتج (متوفر/غير متوفر)
- رفع الصور من الجهاز أو استخدام روابط

## الفئات (3 فقط)

1. مواد تموينية
2. أدوات منزلية
3. مستحضرات تجميل

## التقنيات المستخدمة

### Frontend
- React 18
- JavaScript (بدون TypeScript)
- Tailwind CSS
- Vite
- React Router DOM
- Lucide React (للأيقونات)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (للمصادقة)
- bcryptjs (لتشفير كلمات المرور)
- Multer (لرفع الصور)

## النشر

- Frontend على Netlify
- Backend على Render

رابط Backend: `https://supermarket-api-w79n.onrender.com`

## ملاحظات مهمة

1. تأكد من أن MongoDB Atlas يعمل وقابل للاتصال
2. تأكد من تحديث رابط API في ملف `src/utils/api.js`
3. الصور المرفوعة تُخزن في مجلد `backend/uploads/`
