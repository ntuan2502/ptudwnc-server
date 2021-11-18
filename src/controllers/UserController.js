const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");
const User = require("../models/User");

class UserController {
  // [GET] /users
  index(req, res, next) {
    User.find({})
      .then((users) => {
        res.json({
          code: res.statusCode,
          success: true,
          users,
        });
      })
      .catch(next);
  }

  // [GET] /user/:id
  show(req, res, next) {
    User.findById(req.params.id)
      .then((user) => {
        res.json({
          code: res.statusCode,
          success: true,
          user,
        });
      })
      .catch(next);
  }

  // [PUT] /user/:id
  update(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body)
      .then((user) => {
        res.json({
          code: res.statusCode,
          success: true,
          user,
        });
      })
      .catch(next);
  }
}

module.exports = new UserController();
