const mongoose = require("mongoose");

const comment = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    // unique: true
  },
 commentId: {
    type: Number,
    required: true,
    unique: false
  },
  comment: {
    type: String,
    required: true,
    unique: false
  },
  key: {
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

module.exports = mongoose.model("Comments", comment);