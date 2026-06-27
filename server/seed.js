const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/supermarket';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const admin = await User.create({
      name: 'مدير النظام',
      email: 'admin@supermarket.com',
      password: adminPassword,
      isAdmin: true
    });
    console.log('Admin user created:', admin.email);

    // Create sample products
    const products = [
      {
        name: 'أرز مصري',
        description: 'أرز مصري عالي الجودة، 1 كجم',
        price: 25.00,
        quantity: 100,
        category: 'مواد تموينية',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'سكر أبيض',
        description: 'سكر أبيض نقي، 1 كجم',
        price: 18.50,
        quantity: 150,
        category: 'مواد تموينية',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'زيت طعام',
        description: 'زيت طعام نقي، 1 لتر',
        price: 35.00,
        quantity: 80,
        category: 'مواد تموينية',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'مقلاة غير لاصقة',
        description: 'مقلاة عالية الجودة بمقبض مريح',
        price: 120.00,
        quantity: 30,
        category: 'أدوات منزلية',
        image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'مجموعة أطباق',
        description: 'مجموعة 6 أطباق زجاجية أنيقة',
        price: 85.00,
        quantity: 25,
        category: 'أدوات منزلية',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'مكنسة كهربائية',
        description: 'مكنسة كهربائية قوية وسهلة الاستخدام',
        price: 450.00,
        quantity: 10,
        category: 'أدوات منزلية',
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'شامبو مرطب',
        description: 'شامبو للشعر الجاف، 400 مل',
        price: 55.00,
        quantity: 60,
        category: 'مستحضرات تجميل',
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'كريم وجه',
        description: 'كريم مرطب للوجه، 50 مل',
        price: 75.00,
        quantity: 40,
        category: 'مستحضرات تجميل',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        available: true
      },
      {
        name: 'عطر فاخر',
        description: 'عطر فاخر بروائح زهرية، 100 مل',
        price: 250.00,
        quantity: 20,
        category: 'مستحضرات تجميل',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        available: true
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created:', products.length);

    console.log('\nSeed completed successfully!');
    console.log('Admin credentials:');
    console.log('  Email: admin@supermarket.com');
    console.log('  Password: admin123');
    console.log('\nNormal user credentials:');
    console.log('  You can register a new user at /register');
    
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
