const ShipmentModel = require("../../Models/Logistics/Shipment");

const postShipment = async (req, res) => {
  try {
    const { sender, receiver, package, pickup } = req.body;

    if (!sender || !receiver || !package || !pickup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Auto-generate tracking numbers
    const generateTrackingNumber = () => {
      const prefix = "JSL"; // JustLink (or your company code)
      const random = Math.floor(100000000 + Math.random() * 900000000);
      return `${prefix}${random}`;
    };

    const shipment = await ShipmentModel.create({
      sender,
      receiver,
      package,
      pickup,
      trackingNumber: generateTrackingNumber(),
    });

    res.status(200).json({ message: "Shipment created successfully", shipment })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error posting shipment" });
  }
};

module.exports = { postShipment };
