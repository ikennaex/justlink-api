const express = require('express');
const { becomeAVendor } = require('../../Controllers/Ecommerce/becomeAVendorController');
const { authToken } = require('../../middleware/auth');
const router = express.Router()

router.post('/', authToken, becomeAVendor);

module.exports = router