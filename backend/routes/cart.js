import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], total: 0 });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.available || product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product not available or insufficient quantity'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], total: 0 });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();

    cart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update cart item quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    const product = await Product.findById(productId);
    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient product quantity'
      });
    }

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
