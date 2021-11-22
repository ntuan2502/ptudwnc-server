const Course = require('../models/Course');
const nodemailer = require('nodemailer');
const { email, CLIENT_URL } = require('../config/mainConfig');
const Invitation = require('../models/Invitation.js');
const { nanoid } = require('nanoid');
const User = require('../models/User');

const createDefaultInvitation = (courseId) => {
  const newInvitation = new Invitation({
    courseId,
    inviteCode: nanoid(8),
    type: 1,
  });
  return newInvitation.save();
};

module.exports = {
  // notAllowMethod: (req, res, next) => {
  //   res.json({
  //     code: res.statusCode,
  //     status: false,
  //     message: "The method is not allowed",
  //   });
  // },

  // [GET] /courses
  getCourses: async (req, res, next) => {
    const courses = await Course.find({
      $or: [
        { students: req.user.id },
        { owner: req.user.id },
        { teachers: req.user.id },
      ],
    }).populate('owner');
    res.json({ code: res.statusCode, success: true, courses });
  },

  // [POST] /courses/store
  createCourse: async (req, res, next) => {
    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      students: [],
      teachers: [req.user.id],
      owner: req.user.id,
      joinId: nanoid(8),
    });
    course
      .save()
      .then(async () => {
        await createDefaultInvitation(course._id);

        res.json({ code: res.statusCode, success: true, course });
      })
      .catch((err) => {
        res.json({
          code: res.statusCode,
          success: false,
          message: err.message,
        });
      });
  },

  // [GET] /courses/:slug
  getCourse: async (req, res, next) => {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('teachers')
      .populate('students')
      .populate('owner');

    if (course) {
      if (
        course.students.toString().includes(req.user.id) ||
        course.teachers.toString().includes(req.user.id) ||
        course.owner.id === req.user.id
      ) {
        res.json({ code: res.statusCode, success: true, course });
      } else {
        res.json({
          code: res.statusCode,
          success: false,
          message: 'You are not allowed to access this course',
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Course not found',
      });
    }
  },

  // [PUT] /courses/:id
  updateCourse: async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (course) {
      // check owner
      if (course.owner === req.user.id) {
        if (req.body.name) {
          course.name = req.body.name;
        }
        if (req.body.description) {
          course.description = req.body.description;
        }
        course
          .save()
          .then(() => {
            res.json({
              code: res.statusCode,
              success: true,
              message: 'Course updated successfully',
            });
          })
          .catch((err) => {
            res.json({
              code: res.statusCode,
              success: false,
              message: err.message,
            });
          });
      } else {
        res.json({
          code: res.statusCode,
          success: false,
          message: 'You are not allowed to modify this course',
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Course not found',
      });
    }
  },

  // [DELETE] /courses/:id
  deleteCourse: async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (course) {
      if (course.owner === req.user.id) {
        course
          .remove()
          .then(() => {
            res.json({
              code: res.statusCode,
              success: true,
              message: 'Course deleted successfully',
            });
          })
          .catch((err) => {
            res.json({
              code: res.statusCode,
              success: false,
              message: err.message,
            });
          });
      } else {
        res.json({
          code: res.statusCode,
          success: false,
          message: 'You are not allowed to delete this course',
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Course not found',
      });
    }
  },

  /** [POST] /courses/invite
   * req.body = {
   *  courseId: string,
   *  email: string,
   *  type: number,
   * }
   */
  inviteUser: async (req, res, next) => {
    const course = await Course.findById(req.body.courseId);
    const userEmail = req.body.email;
    const type = req.body.type;
    const teacherId = req.user._id;
    if (!course) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Course not found',
      });
      return;
    }
    if (!course.teachers.toString().includes(teacherId)) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Not authorized',
      });
      return;
    }
    const invitedUser = await User.findOne({ email: userEmail });
    if (!invitedUser) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'User with email not found',
      });
      return;
    }
    const invitation = new Invitation({
      courseId: course._id,
      inviteCode: nanoid(8),
      type: type === undefined ? 0 : type,
      userId: invitedUser._id,
    });
    try {
      invitation.save();
    } catch (err) {
      console.error(err);
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Cannot create invitation',
      });
      return;
    }
    const inviteLink = `${CLIENT_URL}/courses/join/${invitation.inviteCode}`;
    const message = type
      ? `<p>You are invited to a course on the coursepin system. Click on the link if you agree: <a href="${inviteLink}">Link</a></p>`
      : `<p>You are invited to be a teacher in a course on the coursepin system. Click on the link if you agree: <a href="${inviteLink}">Link</a></p>`;
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
      from: '"CoursePin" <coursepincourseroom@gmail.com>', // sender address
      to: userEmail, // list of receivers
      subject: 'Someone invited you to join course', // Subject line
      text: 'Hello world', // plain text body
      html: message, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.json({
      code: res.statusCode,
      success: true,
      message: 'Invite success!',
    });
  },

  getDefaultInvitation: async (req, res, next) => {
    const course = await Course.findOne({
      _id: req.params.id,
      teachers: req.user.id,
    });
    if (course) {
      const invitation = await Invitation.findOne({
        courseId: course._id,
        userId: null,
      });
      if (invitation) {
        res.json({ code: res.statusCode, success: true, invitation });
      } else {
        res.json({
          code: res.statusCode,
          success: false,
          message: 'Invitation not found',
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Course not found',
      });
    }
  },

  createInvitation: async (req, res) => {
    const { type, userId } = req.body;
    if (!type || (type !== '1' && type !== '0') || !userId) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Not enough inputs',
      });
      return;
    }
    const course = await Course.findOne({
      _id: req.params.id,
      teacher: req.user._id,
    });
    if (!course) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Course not found',
      });
      return;
    }
    const existInvitation = await Invitation.findOne({
      userId,
      type: Number.parseInt(type),
    });
    if (existInvitation) {
      await Invitation.deleteMany({ userId, type: Number.parseInt(type) });
    }
    const newInvitation = new Invitation({
      courseId,
      inviteCode: nanoid(8),
      userId,
      type: Number.parseInt(type),
    });
    try {
      await newInvitation.save();
      res.json({ code: res.statusCode, success: true, newInvitation });
    } catch (err) {
      console.error(err);
      res.json({
        code: res.statusCode,
        success: false,
        message: err.message,
      });
    }
  },

  joinCourse: async (req, res, next) => {
    const userId = req.user._id;
    const invitation = await Invitation.findOne({ inviteCode: req.params.id });
    if (!invitation) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Invite not found',
      });
      return;
    }
    if (invitation.userId && invitation.userId !== userId) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Unauthorized',
      });
      return;
    }
    const course = await Course.findById(invitation.courseId);
    if (!course) {
      res.json({
        code: res.statusCode,
        success: false,
        message: 'Course not found',
      });
      return;
    }
    if (invitation.type === 1) {
      if (course.students && course.students.includes(userId)) {
        res.json({
          code: res.statusCode,
          success: false,
          message: 'You have already joined this course',
        });
        return;
      }
      if (!course.students) {
        course.students = [];
      }
      course.students.push(userId);
    } else if (invitation.type === 0) {
      if (course.teachers && course.teachers.includes(userId)) {
        res.json({
          code: res.statusCode,
          success: false,
          message: 'You have already joined this course',
        });
        return;
      }
      if (!course.teachers) {
        course.teachers = [];
      }
      course.teachers.push(userId);
    }
    try {
      await course.save();
      res.json({
        code: res.statusCode,
        success: true,
        message: 'Course joined successfully',
      });
    } catch (err) {
      res.json({
        code: res.statusCode,
        success: false,
        message: err.message,
      });
    }
  },
};
