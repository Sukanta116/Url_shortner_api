//depandencies

const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const User = require("../models/User");

const loginValidator = [
  check("email")
    .notEmpty()
    .isEmail()
    .withMessage("Valid Email required")
    .trim()
    .custom(async (value) => {
      try {
        const userEmail = await User.findOne({ email: value });
        if (!userEmail) {
          throw createError("User email not registerd..");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol",
    ),
];

const loginValidationHandler = (req, res, next) => {
  const error = validationResult(req);
  const mappedError = error.mapped();

  if (Object.keys(mappedError) == 0) {
    return next();
  }

  if (mappedError.email || (mappedError.email && mappedError.password)) {
    res.status(400).json({
      message: mappedError.email.msg,
    });
  } else {
    res.status(400).json({
      message: mappedError.email.msg,
    });
  }
};

module.exports = { loginValidator, loginValidationHandler };
