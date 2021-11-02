const Class = require('../models/class.model');
const { nanoid } = require('nanoid');

module.exports = {
  notAllowMethod: (req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    res.status(402).json({
      status: 'error',
      message: 'The method is not allowed'
    });
  },

  getAllClasses: async (req, res, next) => {
    const allClass = await Class.find({})
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(allClass);
  },

  createClass: async (req, res, next) => {
    const newClass = new Class({
      className: req.body.className,
      description: req.body.description,
      listStudent: [],
      teacher : req.user.id,
      joinId : nanoid(8)
    });

    newClass.save()
      .then(() => {
        res.setHeader('Content-type', 'application/json');
        res.status(201).json(newClass);
      }).catch(err => {
        res.setHeader('Content-type', 'application/json');
        res.status(500).json({
          status: 'error',
          message: err.message
        });
      });
  },

  getClass: async (req, res, next) => {
    const classId = req.params.id;
    const matchedClass = await Class.findById(classId);
    if(matchedClass) {
      res.setHeader('Content-type', 'application/json');
      res.status(200).json(matchedClass);
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }
  },

  updateClass: async (req, res, next) => {
    const classId = req.params.id;
    const matchedClass = await Class.findById(classId);
    if(matchedClass) {
      matchedClass.className = req.body.className;
      matchedClass.description = req.body.description;
      matchedClass.listStudent = req.body.listStudent;
      matchedClass.teacher = req.user.id;
      matchedClass.joinId = req.body.joinId;
      matchedClass.save()
        .then(() => {
          res.setHeader('Content-type', 'application/json');
          res.status(200).json({
            status: 'success',
            message: 'Class updated successfully'
          });
        }).catch(err => {
          res.setHeader('Content-type', 'application/json');
          res.status(500).json({
            status: 'error',
            message: err.message
          });
        });
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }
  },

  deleteClass: (req, res, next) => {
    const classId = req.params.id;
    Class.findByIdAndDelete(classID)
      .then(() => {
        res.setHeader('Content-type', 'application/json');
        res.status(200).json({
          status: 'success',
          message: 'Class deleted successfully'
      }).catch((err) => {
        res.setHeader('Content-type', 'application/json');
        res.status(500).json({
          status: 'error',
          message: err.message
        });
      });
      })
  }
}