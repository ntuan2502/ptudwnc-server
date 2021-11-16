const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");
const User = require("../models/User");
const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../util/mongoose");

class UserController {
  // [GET] /users
  index(req, res) {
    User.find({})
      .then((course) => {
        res.json({ course: multipleMongooseToObject(course) });
      })
      .catch(next);
  }

  // getAllUsers: async (req, res) => {
  //   const users = await User.find({});
  //   if (users) {
  //     res.setHeader("Content-type", "application/json");
  //     res.status(200).json(users);
  //   } else {
  //     res.setHeader("Content-type", "application/json");
  //     res.status(401).json({ message: "No users found" });
  //   }
  // },

  // [GET] /courses/:slug
  show(req, res) {
    Course.findById(req.params.id)
      .then((course) => {
        res.json({ course: mongooseToObject(course) });
      })
      .catch(next);
  }

  // getUserById: async (req, res) => {
  //   const userId = req.params.id;
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     res.setHeader("Content-type", "application/json");
  //     res.status(404).json({ success: false, message: "User not found" });
  //   } else {
  //     res.setHeader("Content-type", "application/json");
  //     res.status(200).json(user);
  //   }
  // },

  // [PUT] /courses/:id
  update(req, res) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then((course) => {
        res.json({ course: mongooseToObject(course) });
      })
      .catch(next);
  }

  // updateUser: async (req, res) => {
  //   const userId = req.params.id;
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     res.setHeader("Content-type", "application/json");
  //     res.status(404).json({ success: false, message: "User not found" });
  //     return;
  //   }
  //   if (req.body.studentId) {
  //     const matchedUser = await User.findOne({ studentId: req.body.studentId });
  //     if (matchedUser) {
  //       res.setHeader("Content-type", "application/json");
  //       res
  //         .status(406)
  //         .json({ success: false, message: "Student Id already existed" });
  //       return;
  //     }
  //     user.studentId = req.body.studentId;
  //   }
  //   if (req.body.fullName) {
  //     user.fullName = req.body.fullName;
  //   }
  //   if (req.body.email) {
  //     const matchedUser = await User.findOne({ email: req.body.email });
  //     if (matchedUser) {
  //       res.setHeader("Content-type", "application/json");
  //       res
  //         .status(406)
  //         .json({ success: false, message: "Email already existed" });
  //       return;
  //     }
  //     user.email = req.body.email;
  //   }
  //   try {
  //     const updatedUser = await user.save();
  //     res.setHeader("Content-type", "application/json");
  //     res
  //       .status(200)
  //       .json({ success: true, message: "Update successful", updatedUser });
  //   } catch (err) {
  //     res.setHeader("Content-type", "application/json");
  //     res.status(500).json({ success: false, message: "Update failed" });
  //   }
  // },
}

module.exports = new UserController();
