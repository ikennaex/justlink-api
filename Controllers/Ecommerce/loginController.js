const UserModel = require("../../Models/Ecommerce/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!password || !user.password) {
      console.error("Missing password or hash:", {
        password,
        hash: user.password,
      });
      return res.status(400).json({ message: "Invalid login data" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect Password" });

    const accessToken = jwt.sign(
      { id: user._id, name:user.fullName, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET, 
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken; // if user is escort saves in escort model, if user is client saves in client model
    await user.save();

    // Send refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      accessToken,
      user: safeUser,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

module.exports = { login };
