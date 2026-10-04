// Depansecies
const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  longLink: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  shortLink: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;
