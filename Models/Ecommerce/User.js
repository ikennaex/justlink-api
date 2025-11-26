const mongooose = require("mongoose");
const { Schema } = mongooose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, index: true },
  password: { type: String, required: true, select: false },
  refreshToken: { type: String, select: false },
  role: {type: String, default: "User"},
   
  
  businessName: { type: String, index: true },
  phoneNumber: { type: String, index: true },
  address: { type: String, index: true },
  storeDescription: { type: String, index: true },
}, { timestamps: true });

const UserModel = mongooose.model("User", userSchema);
module.exports = UserModel;