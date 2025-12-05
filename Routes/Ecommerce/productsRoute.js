const express = require('express');
const { authToken } = require('../../middleware/auth');
const { postProduct, getProducts, getProductById, getProductByVendorId, bookmarkProduct, deleteBookmark, getBookmarks, rateProduct, getProductRatings } = require('../../Controllers/Ecommerce/productsController');
const upload = require('../../middleware/multer');
const router = express.Router()

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/vendor/products', authToken, getProductByVendorId);
router.post('/vendor/new-product', authToken, upload.array("imgs", 3), postProduct);
router.post('/bookmark/:id', authToken, bookmarkProduct);
router.delete('/bookmark/:id', authToken, deleteBookmark);
router.get('/bookmark', authToken, getBookmarks);
router.post('/rating/:id', authToken, rateProduct);
router.get('/rating/:id', getProductRatings);


module.exports = router 