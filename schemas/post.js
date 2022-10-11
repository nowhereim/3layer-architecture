const mongoose = require("mongoose");

const posting = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: false
  },
  key: {
    type: String,
    required: true,
    unique: false
  },
  description: {
    type: String,
    required: true,
    unique: false
  },

  like: {
    type: Number,
    default: 0,
    required: false
  },
  likekey: {
    type: Array,
    default: [],
    required: false
  },
  // pw: {
  //   type: Number,
  //   required: true
  // },

  date: {
    type: Date,
    default: Date.now,
    required: true

  }
});

module.exports = mongoose.model("Posting", posting);