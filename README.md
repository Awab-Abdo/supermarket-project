# سوبرماركت سيد أحمد

مشروع ويب متكامل لعرض منتجات السوبرماركت مع سلة مشتريات ولوحة تحكم إدارية.

## الميزات

- **تسجيل الدخول والتسجيل** باستخدام JWT و bcrypt
- **عرض المنتجات** حسب الفئات (مواد تموينية، أدوات منزلية، مستحضرات تجميل)
- **بحث** عن المنتجات بالاسم
- **سلة مشتريات** مع تعديل الكميات وحذف المنتجات
- **لوحة تحكم إدارية** لإضافة وتعديل وحذف المنتجات

## هيكلة المشروع

```
├── server/          # Backend (Node.js + Express + MongoDB)
│   ├── models/      # User, Product, Cart
│   ├── routes/      # Auth, Products, Cart, Admin
│   ├── middleware/  # JWT Authentication
│   └── uploads/     # Uploaded images
└── src/             # Frontend (React + Tailwind CSS)
    ├── pages/       # Home, Cart, Login, Register, Admin
    ├── components/  # Navbar, ProtectedRoute
    └── context/     # AuthContext
```

## التثبيت

### 1. تثبيت حزم Frontend
```bash
npm install
```

### 2. تثبيت حزم Backend
```bash
cd server && npm install
```

### 3. إعداد MongoDB Atlas
- قم بإنشاء قاعدة بيانات على MongoDB Atlas
- انسخ رابط الاتصال
- عدل ملف `server/.env` وأضف الرابط:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/supermarket?retryWrites=true&w=majority
```

### 4. تشغيل المشروع

**Backend:**
```bash
cd server
npm run dev
```

**Frontend (في نافذة أخرى):**
```bash
npm run dev
```

## الوصول للوحة الإدارة

1. أنشئ مستخدمًا عاديًا
2. عدّل المستخدم في MongoDB Atlas واجعل `isAdmin: true`
3. سجّل الدخول باستخدام `/admin/login`

## الاعتمادات

- React
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- JWT
- bcryptjs
