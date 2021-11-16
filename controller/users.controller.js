const bcrypt = require('bcrypt');
const authenticate = require('../authenticate');
const User = require('../models/users.model');
module.exports = {
  getAllUsers: async (req, res) => {
    const users = await User.find({});
    if (users) {
      res.setHeader('Content-type', 'application/json');
      res.status(200).json(users);
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(401).json({ message: 'No users found' });
    }
  },

  postLogin: async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          console.log('password match');
          const token = authenticate.getToken(user);
          res.setHeader('Content-Type', 'application/json');
          res
            .status(200)
            .json({ success: true, currentUser: user, accessToken: token });
        } else {
          console.log('password dont');
          res.setHeader('Content-Type', 'application/json');
          res
            .status(401)
            .json({ success: false, message: 'User or password incorrect!' });
        }
      });
    } else {
      console.log('password dont');
      res.setHeader('Content-Type', 'application/json');
      res
        .status(401)
        .json({ success: false, message: 'User or password incorrect!' });
    }
  },

  postSignup: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res
        .status(406)
        .json({ success: false, message: 'User already existed!' });
    } else {
      const newUser = new User(req.body);
      newUser.password = bcrypt.hashSync(req.body.password, 10);
      await newUser.save();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ success: true, message: 'Signup successful' });
    }
  },

  socialLogin: (req, res) => {
    if (req.user) {
      const token = authenticate.getToken(req.user);
      res.setHeader('Content-type', 'application/json');
      res
        .status(200)
        .json({ success: true, currentUser: req.user, accessToken: token });
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(200).json(user);
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    if (req.body.studentId) {
      const matchedUser = await User.findOne({ studentId: req.body.studentId });
      if (matchedUser) {
        res.setHeader('Content-type', 'application/json');
        res
          .status(406)
          .json({ success: false, message: 'Student Id already existed' });
        return;
      }
      user.studentId = req.body.studentId;
    }
    if (req.body.fullName) {
      user.fullName = req.body.fullName;
    }
    if (req.body.email) {
      const matchedUser = await User.findOne({ email: req.body.email });
      if (matchedUser) {
        res.setHeader('Content-type', 'application/json');
        res
          .status(406)
          .json({ success: false, message: 'Email already existed' });
        return;
      }
      user.email = req.body.email;
    }
    try {
      const updatedUser = await user.save();
      res.setHeader('Content-type', 'application/json');
      res
        .status(200)
        .json({ success: true, message: 'Update successful', updatedUser });
    } catch (err) {
      res.setHeader('Content-type', 'application/json');
      res.status(500).json({ success: false, message: 'Update failed' });
    }
  },
};
