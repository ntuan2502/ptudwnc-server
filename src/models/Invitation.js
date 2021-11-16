const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Invitation = new Schema(
  {
    courseId: {
      type: String,
    },
    inviteCode: {
      type: String,
    },
    type: {
      type: Number,
      default: 1, // 0 instructor, 1 student
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invitation", Invitation);