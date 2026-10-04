// Depandencies
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const token = req.signedCookies[process.env.COOKIE_NAME];

    if (!token) {
      res.status(401).json({
        message: "Login required",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
