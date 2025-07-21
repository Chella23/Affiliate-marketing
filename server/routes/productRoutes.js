// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { addProduct } = require('../controllers/productController');

router.post('/add', addProduct);

module.exports = router;
