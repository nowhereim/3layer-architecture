const mongoose = require("mongoose");

const user = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  pw: {
    type: String,
    required: true,
    unique: false
  },

  date: {
    type: Date,
    default: Date.now,
    required: true

  }
});

module.exports = mongoose.model("users", user);