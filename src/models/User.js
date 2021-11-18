const mongoose = require("mongoose");
//const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    student: {
      type: String,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    type: {
      type: Number,
      default: 1, // 0: Admin | 1: User
    },
  },
  {
    timestamps: true,
  }
);

//userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
