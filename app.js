// Depandencies

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

const {
  loginValidator,
  loginValidationHandler,
} = require("./midlewares/loginValidation");
const {
  loginController,
  registerController,
  logoutController,
} = require("./controllers/auth");
const {
  userValidator,
  userValidationHandler,
} = require("./midlewares/userValidation");

const authenticate = require("./midlewares/authenticate");

const { urlShortner, allLink, urlRedirect } = require("./controllers/urlMaker");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.static(path.join(__dirname, "views")));

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("Database Connected....."))
  .catch((err) => console.log(err.message));

// !Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.post("/login", loginValidator, loginValidationHandler, loginController);
app.get("/dashboard", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});
app.get("/me", authenticate, (req, res) => {
  res.json({
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  });
});
app.post("/register", userValidator, userValidationHandler, registerController);
app.post("/shortner", authenticate, urlShortner);
app.get("/showAll", authenticate, allLink);
app.get("/:shortLink", urlRedirect);
app.post("/logout", logoutController);

app.listen(process.env.PORT, () => {
  console.log(`Application running on ${process.env.PORT}`);
});
