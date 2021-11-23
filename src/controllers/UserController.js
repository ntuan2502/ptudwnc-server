const bcrypt = require('bcrypt');
const authenticate = require('../authenticate');
const User = require('../models/User');

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

  // [GET] /users/:id
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

  // [PUT] /users/:id
  async update(req, res, next) {
    const student = req.body.student;
    if (student) {
      const matchedStudent = await User.findOne({ student });
      if (matchedStudent && matchedStudent._id.toString() !== req.params.id) {
        res.json({
          code: res.statusCode,
          success: false,
          message: 'StudentId already exists',
        });
        return;
      }
    }
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

  // [GET] /users/student/:student
  checkStudent(req, res, next) {
    User.findOne({ student: req.params.student })
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
