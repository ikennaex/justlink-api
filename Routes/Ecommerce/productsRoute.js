const express = require('express');
const { authToken } = require('../../middleware/auth');
const { postProduct, getProducts, getProductById, getProductByVendorId } = require('../../Controllers/Ecommerce/productsController');
const upload = require('../../middleware/multer');
const router = express.Router()

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/vendor/products', authToken, getProductByVendorId);
router.post('/vendor/new-product', authToken, upload.array("imgs", 3), postProduct);

module.exports = router 