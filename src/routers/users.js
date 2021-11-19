var express = require("express");
var router = express.Router();
const userController = require("../controllers/UserController");
const authenticate = require("../authenticate");

router.get("/student/:student", authenticate.verifyUser, userController.checkStudent);

router.put("/:id", authenticate.verifyUser, userController.update);
router.get("/:id", authenticate.verifyUser, userController.show);
router.get("/", authenticate.verifyUser, userController.index);

module.exports = router;
