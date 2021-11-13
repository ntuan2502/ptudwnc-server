const Class = require('../models/class.model');
const Invitation = require('../models/invitation.model.js');
const { nanoid } = require('nanoid');

const createDefaultInvitation = (courseId) => {
  const newInvitation = new Invitation({
    courseId: courseId,
    inviteCode: nanoid(8),
    type: 1,
  });
  return newInvitation.save();
};

module.exports = {
  notAllowMethod: (req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    res.status(402).json({
      status: 'error',
      message: 'The method is not allowed',
    });
  },

  getAllClasses: async (req, res, next) => {
    const allClass = await Class.find({});
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(allClass);
  },

  createClass: async (req, res, next) => {
    const newClass = new Class({
      className: req.body.className,
      description: req.body.description,
      students: [],
      teachers: [req.user.id],
      owner: req.user.id,
      joinId: nanoid(8),
    });
    newClass
      .save()
      .then(async () => {
        await createDefaultInvitation(newClass._id);
        res.setHeader('Content-type', 'application/json');
        res.status(201).json(newClass);
      })
      .catch((err) => {
        res.setHeader('Content-type', 'application/json');
        res.status(500).json({
          status: 'error',
          message: err.message,
        });
      });
  },

  getClass: async (req, res, next) => {
    const classId = req.params.id;
    const matchedClass = await Class.findById(classId);
    if (matchedClass) {
      res.setHeader('Content-type', 'application/json');
      res.status(200).json(matchedClass);
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({
        status: 'error',
        message: 'Class not found',
      });
    }
  },

  updateClass: async (req, res, next) => {
    const classId = req.params.id;
    const matchedClass = await Class.findById(classId);
    if (matchedClass) {
      if (req.body.className) {
        matchedClass.className = req.body.className;
      }
      if (req.body.description) {
        matchedClass.description = req.body.description;
      }
      matchedClass
        .save()
        .then(() => {
          res.setHeader('Content-type', 'application/json');
          res.status(200).json({
            status: 'success',
            message: 'Class updated successfully',
          });
        })
        .catch((err) => {
          res.setHeader('Content-type', 'application/json');
          res.status(500).json({
            status: 'error',
            message: err.message,
          });
        });
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({
        status: 'error',
        message: 'Class not found',
      });
    }
  },

  deleteClass: (req, res, next) => {
    const classId = req.params.id;
    Class.findByIdAndDelete(classID).then(() => {
      res.setHeader('Content-type', 'application/json');
      res
        .status(200)
        .json({
          status: 'success',
          message: 'Class deleted successfully',
        })
        .catch((err) => {
          res.setHeader('Content-type', 'application/json');
          res.status(500).json({
            status: 'error',
            message: err.message,
          });
        });
    });
  },
};
