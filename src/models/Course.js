const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
// const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;
mongoose.plugin(slug);

const Course = new Schema(
  {
    className: {
      type: String,
      required: true,
    },
    slug: { type: String, slug: "className", unique: true },
    description: {
      type: String,
    },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    teachers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    joinId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Course.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model("Course", Course);
