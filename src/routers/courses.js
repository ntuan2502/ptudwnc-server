const authenticate = require("../authenticate");
const express = require("express");
const courseController = require("../controllers/CourseController");

const router = express.Router();

router
  .route("/")
  .get(authenticate.verifyUser, courseController.getCourses)
  .post(authenticate.verifyUser, courseController.createCourse);

router
  .route("/:id")
  .get(authenticate.verifyUser, courseController.getCourse)
  .patch(authenticate.verifyUser, courseController.updateCourse)
  .delete(authenticate.verifyUser, courseController.deleteCourse);

router.get("/join/:id", authenticate.verifyUser, courseController.joinCourse);

router
  .route("/invite")
  .post(authenticate.verifyUser, courseController.inviteUser);
router.get(
  "/:id/invitation",
  authenticate.verifyUser,
  courseController.getDefaultInvitation
);

/**
 * type body = {
 *  type: '0' | '1';
 *  userId: string
 * }
 */
router.post(
  "/:id/invitation",
  authenticate.verifyUser,
  courseController.createInvitation
);

module.exports = router;
