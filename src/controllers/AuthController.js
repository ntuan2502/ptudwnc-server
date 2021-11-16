const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");
const User = require("../models/User");
module.exports = {
  postLogin: async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          console.log("password match");
          const token = authenticate.getToken(user);
          res.setHeader("Content-Type", "application/json");
          res
            .status(200)
            .json({ success: true, currentUser: user, accessToken: token });
        } else {
          console.log("password dont");
          res.setHeader("Content-Type", "application/json");
          res
            .status(401)
            .json({ success: false, message: "User or password incorrect!" });
        }
      });
    } else {
      console.log("password dont");
      res.setHeader("Content-Type", "application/json");
      res
        .status(401)
        .json({ success: false, message: "User or password incorrect!" });
    }
  },

  postRegister: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.setHeader("Content-Type", "application/json");
      res
        .status(406)
        .json({ success: false, message: "User already existed!" });
    } else {
      const newUser = new User(req.body);
      newUser.password = bcrypt.hashSync(req.body.password, 10);
      await newUser.save();
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ success: true, message: "Signup successful" });
    }
  },

  socialLogin: (req, res) => {
    if (req.user) {
      const token = authenticate.getToken(req.user);
      res.setHeader("Content-type", "application/json");
      res
        .status(200)
        .json({ success: true, currentUser: req.user, accessToken: token });
    } else {
      res.setHeader("Content-type", "application/json");
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  },
};
