// server/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
  addProduct,
  fetchAllProducts
} = require('../controllers/productController');

// Route to scrape a single product by ASIN
router.post('/add', addProduct);

// Route to fetch all products from products.json and scrape
router.get('/fetch', fetchAllProducts);

module.exports = router;
