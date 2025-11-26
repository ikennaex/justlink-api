const UserModel = require("../../Models/Ecommerce/User");

const becomeAVendor = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await UserModel.findOne({ _id: id });

    const { businessName, phoneNumber, address, storeDescription } = req.body;
    if (!businessName || !phoneNumber || !address || !storeDescription) {
      return res.status(400).json({ message: "All details are required" }); 
    }

    user.businessName = businessName; 
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.storeDescription = storeDescription;
    user.role = "Vendor";

    await user.save();

    res.status(200).json({ message: "You are now a vendor" });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error occured during registration"});
  }
};

module.exports = {becomeAVendor}
