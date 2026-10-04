// Depandencies
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    default: 587964,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
