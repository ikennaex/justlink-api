const express = require('express');
// const { refreshTokenHandler } = require('../controllers/refreshTokenController');
// const { getLoggedUserProfile } = require('../controllers/getProfileController');
// const { authToken } = require('../middleware/auth');
const { login } = require('../../Controllers/Ecommerce/loginController');
const { register } = require('../../Controllers/Ecommerce/registerController');
const { refreshTokenHandler } = require('../../Controllers/Ecommerce/refreshTokenController');
const { authToken } = require('../../middleware/auth');
const { getLoggedUserProfile } = require('../../Controllers/Ecommerce/getProfileController');
const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshTokenHandler);
router.get('/profile', authToken, getLoggedUserProfile);

// refresh token and user profile 
// router.get('/profile', authToken, getLoggedUserProfile);

// router.post('/logout', authToken, logout);

module.exports = router