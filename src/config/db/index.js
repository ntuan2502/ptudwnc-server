const mongoose = require("mongoose");
const { MONGODB_URL } = require("../mainConfig");
async function connect() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log("Error connecting to Mongo: ", error);
  }
}

module.exports = { connect };
