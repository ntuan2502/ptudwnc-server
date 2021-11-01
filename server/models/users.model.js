const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  googleId: String,
  facebookId: String,
  type : {
    type: Number,
    default: 1   // 0: Admin | 1: User
  }
}, {
  timestamps: true
});

//userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;