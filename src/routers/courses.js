const authenticate = require("../authenticate");
const express = require("express");
const courseController = require("../controllers/CourseController");

const router = express.Router();

router
  .post("/store", authenticate.verifyUser, courseController.createCourse)
  .get("/:slug", authenticate.verifyUser, courseController.getCourse)
  .put("/:id", authenticate.verifyUser, courseController.updateCourse)
  .delete("/:id", authenticate.verifyUser, courseController.deleteCourse)
  .get("/", authenticate.verifyUser, courseController.getCourses);

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
