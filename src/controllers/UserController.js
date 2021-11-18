const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");
const User = require("../models/User");
const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../util/mongoose");

class UserController {
  // [GET] /users
  index(req, res, next) {
    User.find({})
      .then((course) => {
        res.json({ course: multipleMongooseToObject(course) });
      })
      .catch(next);
  }

  // [GET] /courses/:slug
  show(req, res, next) {
    Course.findById(req.params.id)
      .then((course) => {
        res.json({ course: mongooseToObject(course) });
      })
      .catch(next);
  }

  // [PUT] /courses/:id
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then((course) => {
        res.json({ course: mongooseToObject(course) });
      })
      .catch(next);
  }
}

module.exports = new UserController();
