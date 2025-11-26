const OrderModel = require("../../Models/Ecommerce/Orders");

const getUserOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await OrderModel.find({ userId }).populate('products.productId');
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user orders" });
    }
}

module.exports = { getUserOrders };