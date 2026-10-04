//depandencies

const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const User = require("../models/User");

const userValidator = [
  check("firstName")
    .notEmpty()
    .withMessage("First Name required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Firstname conatains just alphabets")
    .trim(),

  check("lastName")
    .notEmpty()
    .withMessage("First Name required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Firstname conatains just alphabets")
    .trim(),

  check("email")
    .notEmpty()
    .isEmail()
    .withMessage("Valid Email required")
    .trim()
    .custom(async (value) => {
      try {
        const userEmail = await User.findOne({ email: value });
        if (userEmail) {
          throw createError("User EMail already registerd..");
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

const userValidationHandler = (req, res, next) => {
  const error = validationResult(req);
  const mappedError = error.mapped();

  if (Object.keys(mappedError) == 0) {
    return next();
  }

  const errors = Object.values(mappedError).map((error) => error.msg);

  return res.status(400).json({
    message: errors,
  });
};

module.exports = { userValidator, userValidationHandler };
