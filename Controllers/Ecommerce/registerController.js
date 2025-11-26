const UserModel = require("../../Models/Ecommerce/User");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(500).json({ message: "All field are required" });
    }

    // check if email already exists
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      fullName,
      email,
      password: hashPass,
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ message: "An error occurred during registration" });
  }
};

module.exports = {register}
