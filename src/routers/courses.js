const authenticate = require("../authenticate");
const express = require("express");
const courseController = require("../controllers/CourseController");

const router = express.Router();

router
  .route("/")
  .get(authenticate.verifyUser, courseController.getAllClasses)
  .post(authenticate.verifyUser, courseController.createClass)
  .patch(authenticate.verifyUser, courseController.notAllowMethod)
  .delete(authenticate.verifyUser, courseController.notAllowMethod);

router
  .route("/invite")
  .post(authenticate.verifyUser, courseController.inviteUser);

router
  .route("/:id")
  .get(authenticate.verifyUser, courseController.getClass)
  .post(authenticate.verifyUser, courseController.notAllowMethod)
  .patch(authenticate.verifyUser, courseController.updateClass)
  .delete(authenticate.verifyUser, courseController.deleteClass);

router.get(
  "/:id/invitation",
  authenticate.verifyUser,
  courseController.getDefaultInvitation
);

router.get("/join/:id", authenticate.verifyUser, courseController.joinClass);

module.exports = router;
