const Class = require('../models/class.model');
const nodemailer = require('nodemailer');
const { email} = require('../config/mainConfig');
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
    const allClass = await Class.find({"$or": [{"students": req.user.id}, {"owner": req.user.id}, {"teachers": req.user.id}]});
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(allClass);
  },

  createClass: async (req, res, next) => {
    const newClass = new Class({
      className: req.body.className,
      description: req.body.description,
      students: [],
      teachers: [req.user.id],
      owner : req.user.id,
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
    const matchedClass = await Class.findById(classId)
      .populate('teachers')
      .populate('students')
      .populate('owner');

    if(matchedClass) {
      if(matchedClass.students.includes(req.user.id) || matchedClass.teachers.includes(req.user.id) || matchedClass.owner === req.user.id) {
        res.setHeader('Content-type', 'application/json');
        res.status(200).json(matchedClass);
      } else {
        res.setHeader('Content-type', 'application/json');
        res.status(403).json({
          status: 'error',
          message: 'You are not allowed to access this class'
        });
      }
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
      // check owner
      if(matchedClass.owner === req.user.id) {
        if(req.body.className) {
          matchedClass.className = req.body.className;
        }
        if(req.body.description) {
          matchedClass.description = req.body.description;
        }
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
        res.status(403).json({
          status: 'error',
          message: 'You are not allowed to modify this class'
        });
      }
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }
  },

  deleteClass: async (req, res, next) => {
    const classId = req.params.id;
    const matchedClass = await Class.findById(classId);
    if(matchedClass) {
      if(matchedClass.owner === req.user.id) {
        matchedClass.remove()
          .then(() => {
            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
              status: 'success',
              message: 'Class deleted successfully'
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
        res.status(403).json({
          status: 'error',
          message: 'You are not allowed to delete this class'
        });
      }
    } else {
      res.setHeader('Content-type', 'application/json');
      res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }
  },

  inviteUser: async (req, res, next) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: email.account, // generated ethereal user
          pass: email.password, // generated ethereal password
      },
      tls: {
          rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"ClassPin" <classpinclassroom@gmail.com>', // sender address
      to: 'lequocdattyty191@gmail.com', // list of receivers
      subject: 'Someone invited you to join class', // Subject line
      text: 'Hello world', // plain text body
      html: `<p>You are invited to a class on the classpin system. Click on the link if you agree: <a href="https://google.com">Link</a></p>`, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.status(200).json({ status: "success", message: "Invite success!"});
  }
}