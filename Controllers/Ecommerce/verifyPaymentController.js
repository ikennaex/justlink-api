const { default: axios } = require("axios");
const TransactionModel = require("../../Models/Ecommerce/Transactions");
const OrderModel = require("../../Models/Ecommerce/Orders");

const verifyPayment = async (req, res) => {
  const { reference, cartItems } = req.body;

  try {
    // Verify payment on Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const data = response.data.data;

    if (data.status !== "success") {
      return res
        .status(400)
        .json({ success: false, message: "Payment failed" });
    }

    // Save the transaction
    const transaction = await TransactionModel.create({
      userId: req.user.id,
      amount: data.amount / 100,
      reference: data.reference,
      status: data.status,
    });

    const formattedItems = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
      vendorId: item.vendor,
    }));

    // Create ONE general order (admin will split manually)
    const order = await OrderModel.create({
      userId: req.user.id,
      transactionId: transaction._id,
      products: formattedItems,
      status: "Pending",
    });

    // Notify ADMIN only
    // const admin = await Admin.find();

    // if (admin?.email) {
    //   await sendEmail({
    //     to: admin.email,
    //     subject: "New Order Received",
    //     text: `A user has placed a new order with ${cartItems.length} product(s). Please assign them to vendors.`,
    //   });
    // }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.log(err.response?.data || err);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
};

module.exports = { verifyPayment };
