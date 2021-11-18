const Course = require("../models/Course");
const nodemailer = require("nodemailer");
const { email } = require("../config/mainConfig");
const Invitation = require("../models/Invitation.js");
const { nanoid } = require("nanoid");

const createDefaultInvitation = (courseId) => {
  const newInvitation = new Invitation({
    courseId,
    inviteCode: nanoid(8),
    type: 1,
  });
  return newInvitation.save();
};

module.exports = {
  notAllowMethod: (req, res, next) => {
    res.json({
      code: res.statusCode,
      status: false,
      message: "The method is not allowed",
    });
  },

  // [GET] /courses
  getCourses: async (req, res, next) => {
    const allCourse = await Course.find({
      $or: [
        { students: req.user.id },
        { owner: req.user.id },
        { teachers: req.user.id },
      ],
    });

    res.json({ code: res.statusCode, success: true, allCourse });
  },

  createCourse: async (req, res, next) => {
    const newCourse = new Course({
      name: req.body.name,
      description: req.body.description,
      students: [],
      teachers: [req.user.id],
      owner: req.user.id,
      joinId: nanoid(8),
    });
    newCourse
      .save()
      .then(async () => {
        await createDefaultInvitation(newCourse._id);

        res.json({ code: res.statusCode, success: true, newCourse });
      })
      .catch((err) => {
        res.json({
          code: res.statusCode,
          success: false,
          message: err.message,
        });
      });
  },

  getCourse: async (req, res, next) => {
    const courseId = req.params.id;
    const matchedCourse = await Course.findById(courseId)
      .populate("teachers")
      .populate("students")
      .populate("owner");

    if (matchedCourse) {
      if (
        matchedCourse.students.includes(req.user.id) ||
        matchedCourse.teachers.includes(req.user.id) ||
        matchedCourse.owner === req.user.id
      ) {
        res.json({ code: res.statusCode, success: true, matchedCourse });
      } else {
        res.json({
          code: res.statusCode,
          success: false,
          message: "You are not allowed to access this course",
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Course not found",
      });
    }
  },

  updateCourse: async (req, res, next) => {
    const courseId = req.params.id;
    const matchedCourse = await Course.findById(courseId);
    if (matchedCourse) {
      // check owner
      if (matchedCourse.owner === req.user.id) {
        if (req.body.name) {
          matchedCourse.name = req.body.name;
        }
        if (req.body.description) {
          matchedCourse.description = req.body.description;
        }
        matchedCourse
          .save()
          .then(() => {
            res.json({
              code: res.statusCode,
              success: true,
              message: "Course updated successfully",
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
          message: "You are not allowed to modify this course",
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Course not found",
      });
    }
  },

  deleteCourse: async (req, res, next) => {
    const courseId = req.params.id;
    const matchedCourse = await Course.findById(courseId);
    if (matchedCourse) {
      if (matchedCourse.owner === req.user.id) {
        matchedCourse
          .remove()
          .then(() => {
            res.json({
              code: res.statusCode,
              success: true,
              message: "Course deleted successfully",
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
          message: "You are not allowed to delete this course",
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Course not found",
      });
    }
  },

  inviteUser: async (req, res, next) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
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
      to: "lequocdattyty191@gmail.com", // list of receivers
      subject: "Someone invited you to join course", // Subject line
      text: "Hello world", // plain text body
      html: `<p>You are invited to a course on the coursepin system. Click on the link if you agree: <a href="https://google.com">Link</a></p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.json({
      code: res.statusCode,
      success: true,
      message: "Invite success!",
    });
  },

  getDefaultInvitation: async (req, res, next) => {
    const courseId = req.params.id;
    const matchedCourse = await Course.findOne({
      _id: courseId,
      teachers: req.user.id,
    });
    if (matchedCourse) {
      const invitation = await Invitation.findOne({
        courseId: matchedCourse._id,
        userId: null,
      });
      if (invitation) {
        res.json({ code: res.statusCode, success: true, invitation });
      } else {
        res.json({
          code: res.statusCode,
          success: false,
          message: "Invitation not found",
        });
      }
    } else {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Course not found",
      });
    }
  },

  createInvitation: async (req, res) => {
    const courseId = req.params.id;
    const { type, userId } = req.body;
    if (!type || (type !== "1" && type !== "0") || !userId) {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Not enough inputs",
      });
      return;
    }
    const course = await Course.findOne({
      _id: courseId,
      teacher: req.user._id,
    });
    if (!course) {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Course not found",
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
    const inviteId = req.params.id;
    const userId = req.user._id;
    const invitation = await Invitation.findOne({ inviteCode: inviteId });
    if (!invitation) {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Invite not found",
      });
      return;
    }
    if (invitation.userId && invitation.userId !== userId) {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    const course = await Course.findById(invitation.courseId);
    if (!course) {
      res.json({
        code: res.statusCode,
        success: false,
        message: "Course not found",
      });
      return;
    }
    if (invitation.type === 1) {
      if (course.students && course.students.includes(userId)) {
        res.json({
          code: res.statusCode,
          success: false,
          message: "You have already joined this course",
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
          message: "You have already joined this course",
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
        message: "Course joined successfully",
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
