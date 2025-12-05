const BookmarkModel = require("../../Models/Ecommerce/Bookmarks");
const ProductModel = require("../../Models/Ecommerce/Products");
const uploadToCloudinary = require("../../Utils/Cloudinary/cloudinary");

const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id).populate(
      "vendor",
      "name email businessName"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product" });
  }
};

const getProductByVendorId = async (req, res) => {
  const { id } = req.user;
  try {
    const products = await ProductModel.find({ vendor: id });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products for vendor" });
  }
};

const postProduct = async (req, res) => {
  try {
    const { name, desc, price, category, location } = req.body;

    if (!name || !desc || !price || !category || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one media file is required" });
    }

    // Upload all media in parallel
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, "/products");
        return result.secure_url;
      })
    );

    // Save to database
    const productDoc = await ProductModel.create({
      name,
      desc,
      price,
      category,
      imgUrl: uploadedImages,
      location,
      vendor: req.user.id,
    });

    res.status(200).json(productDoc);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Error posting product" });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, desc, price, category, location } = req.body;
  let updatedFields = { name, desc, price, category, location };

  try {
    // try to find product
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the vendor of the product
    if (req.user.id !== product.vendor.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this product" });
    }

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newImg = path + "." + ext;
      fs.renameSync(path, newImg);

      // Add new image to updated fields
      updatedFields.imgUrl = [newImg];
    }

    // updated product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );
    res.status(200).json(updatedProduct); // return the updates product
  } catch (err) {
    console.error(err);
    res.status(500).json("server error ");
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is authorized:
    // If the user is vendor and owns the product, allow
    if (
      req.user.role !== "admin" &&
      product.vendor.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this product" });
    }

    // OPTIONAL: Delete product image from uploads/ if exists
    if (product.imgUrl && product.imgUrl.length > 0) {
      const fs = require("fs");
      product.imgUrl.forEach((imgPath) => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath); // delete image file
        }
      });
    }
    // Delete product from database
    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("server error");
  }
};

const bookmarkProduct = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  try {
    const bookmark = await BookmarkModel.create({ userId, productId });
    res.status(200).json({ message: "Bookmark added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error Adding product to bookmark");
  }
};

const deleteBookmark = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  try {
    const bookmark = await BookmarkModel.findOneAndDelete({
      userId,
      productId,
    });
    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error removing product from bookmark");
  }
};

const getBookmarks = async (req, res) => {
  try {
    const bookmark = await BookmarkModel.find({ userId: req.user.id });
    res.status(200).json(bookmark);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching bookmarks");
  }
};

const rateProduct = async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  const userId = req.user.id;

  try {
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the user already rated
    const existingRatingIndex = product.rating.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      product.rating[existingRatingIndex].rating = rating;
      product.rating[existingRatingIndex].review = review;
      product.rating[existingRatingIndex].createdAt = Date.now();
    } else {
      // Add new rating
      product.rating.push({ userId, rating, review });
    }

    // Recalculate average rating
    product.ratingCount = product.rating.length;
    product.averageRating =
      product.rating.reduce((acc, r) => acc + r.rating, 0) /
      product.ratingCount;

    await product.save();

    res
      .status(200)
      .json({ message: "Rating saved", averageRating: product.averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductRatings = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("ratings.userId", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      ratings: product.ratings,
      averageRating: product.averageRating,
      ratingCount: product.ratingCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  postProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductByVendorId,
  bookmarkProduct,
  deleteBookmark,
  getBookmarks,
  rateProduct,
  getProductRatings
};
