import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'أرز بسمتي',
    description: 'أرز بسمتي عالي الجودة، 5 كيلو جرام',
    price: 45,
    quantity: 100,
    category: 'مواد تموينية',
    image: 'https://images.unsplash.com/photo-1586201375761-66c64acf0b44?w=400',
    available: true
  },
  {
    name: 'زيت زيتون',
    description: 'زيت زيتون بكر ممتاز، 1 لتر',
    price: 85,
    quantity: 50,
    category: 'مواد تموينية',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    available: true
  },
  {
    name: 'سكر أبيض',
    description: 'سكر أبيض ناعم، 2 كيلو جرام',
    price: 18,
    quantity: 200,
    category: 'مواد تموينية',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7d62?w=400',
    available: true
  },
  {
    name: 'مكنسة كهربائية',
    description: 'مكنسة كهربائية قوية 2000 واط',
    price: 350,
    quantity: 15,
    category: 'أدوات منزلية',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
    available: true
  },
  {
    name: 'طقم أواني',
    description: 'طقم أواني طبخ 10 قطع ستانلس ستيل',
    price: 280,
    quantity: 25,
    category: 'أدوات منزلية',
    image: 'https://images.unsplash.com/photo-1584990940036-0e7b0f69f726?w=400',
    available: true
  },
  {
    name: 'كريم مرطب',
    description: 'كريم مرطب للبشرة الجافة، 100 مل',
    price: 65,
    quantity: 80,
    category: 'مستحضرات تجميل',
    image: 'https://images.unsplash.com/photo-1556228720-195a158d9fe9?w=400',
    available: true
  },
  {
    name: 'شامبو',
    description: 'شامبو للشعر الجاف والتالف، 400 مل',
    price: 35,
    quantity: 120,
    category: 'مستحضرات تجميل',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4252?w=400',
    available: true
  },
  {
    name: 'معجون أسنان',
    description: 'معجون أسنان بالنعناع، 150 مل',
    price: 12,
    quantity: 300,
    category: 'مستحضرات تجميل',
    image: 'https://images.unsplash.com/photo-1609841311876-723d35f5d3e9?w=400',
    available: true
  }
];

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if products exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Sample products inserted successfully');
    } else {
      console.log('Products already exist, skipping seed');
    }

    // Create admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD,
        isAdmin: true
      });
      console.log('Admin user created successfully');
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
