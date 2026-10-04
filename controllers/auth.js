//Depandencies

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const registerController = async (req, res) => {
  try {
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
    };

    await User.create(user);

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Authentication Error",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Invalida ID or Password",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({
        message: "Invalida ID or Password",
      });
    }

    const newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = jwt.sign(newUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });

    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.COOKIE_MAX_AGE,
      httpOnly: true,
      signed: true,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({
      message: "Authentication Error",
      error: err.message,
    });
  }
};

const logoutController = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("LogOut");
};

module.exports = { loginController, registerController, logoutController };
