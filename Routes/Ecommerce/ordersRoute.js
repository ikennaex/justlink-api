const express = require('express');
const { authToken } = require('../../middleware/auth');
const { getUserOrders } = require('../../Controllers/Ecommerce/ordersController');
const router = express.Router()

router.get('/user-orders', authToken, getUserOrders);

module.exports = router