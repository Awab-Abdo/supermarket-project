import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, isAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Images only!');
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const adminUser = await User.findOne({ email }) || await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        isAdmin: true
      });

      const jwt = (await import('jsonwebtoken')).default;
      const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      return res.json({
        success: true,
        data: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          isAdmin: true,
          token
        }
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid admin credentials'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// All routes below require admin access
router.use(protect);
router.use(isAdmin);

// Get all products (including unavailable)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add product
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity, category, imageUrl } = req.body;

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      image: req.file ? `/uploads/${req.file.filename}` : imageUrl || ''
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update product
router.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity, category, available, imageUrl } = req.body;

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      available: available === 'true' || available === true
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      updateData.image = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
