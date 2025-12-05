const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String }, // optional review text
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    imgUrl: { type: [String], required: true },
    
    price: { type: Number, required: true, min: [0] }, //this means proce cannot be less than zero
    category:  {
      type: String,
      ref: "CategoryModel", // Reference to a Category model
      // required: true,
    },
    location: { type: String, required: true },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to a Vendor (User model)
      required: true, 
    }, 
    rating : [ratingSchema]
  },
  { timestamps: true }
); 

const ProductModel = mongoose.model("Product", ProductSchema)

module.exports = ProductModel;