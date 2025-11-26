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
  const {id} = req.user
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

module.exports = {
  postProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductByVendorId
};
