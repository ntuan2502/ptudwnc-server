var express = require('express');
const controller = require('../controller/users.controller');
const authenticate = require('../authenticate');
var router = express.Router();

router.get('/', authenticate.verifyUser, controller.getAllUsers);
router.post('/login', controller.postLogin);
router.post('/signup', controller.postSignup);
router.get('/google/token', authenticate.verifyGoogle, controller.socialLogin);
router.get(
  '/facebook/token',
  authenticate.verifyFacebook,
  controller.socialLogin
);

router.get('/:id', authenticate.verifyUser, controller.getUserById);
router.post(':id', authenticate.verifyUser, controller.updateUser);

module.exports = router;
