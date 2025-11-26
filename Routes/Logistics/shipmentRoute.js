const express = require('express');
const { authToken } = require('../../middleware/auth');
const { postShipment } = require('../../Controllers/Logistics/shipmentController');
const router = express.Router()

router.post('/send-package', postShipment);

module.exports = router