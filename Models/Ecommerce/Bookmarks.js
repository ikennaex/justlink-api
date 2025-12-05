const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
}, {timestamps: true});

// Index for faster lookups
BookmarkSchema.index({ userId: 1, productId: 1 }, { unique: true });

const BookmarkModel = mongoose.model("Bookmark", BookmarkSchema)

module.exports = BookmarkModel;
