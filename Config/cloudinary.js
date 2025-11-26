// cloudinary
const cloudinary = require('cloudinary').v2
require('dotenv').config();

// cloudinary config
cloudinary.config({
  cloud_name: 'dxn8v3pj0',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET  
})

module.exports = cloudinary;  