const authenticate = require('../authenticate');
const express = require('express');
const controller = require('../controller/class.controller');

const router = express.Router();

router
  .route('/')
  .get(authenticate.verifyUser, controller.getAllClasses)
  .post(authenticate.verifyUser, controller.createClass)
  .patch(authenticate.verifyUser, controller.notAllowMethod)
  .delete(authenticate.verifyUser, controller.notAllowMethod);

router.route('/invite').post(authenticate.verifyUser, controller.inviteUser);

router
  .route('/:id')
  .get(authenticate.verifyUser, controller.getClass)
  .post(authenticate.verifyUser, controller.notAllowMethod)
  .patch(authenticate.verifyUser, controller.updateClass)
  .delete(authenticate.verifyUser, controller.deleteClass);

router.get(
  '/:id/invitation',
  authenticate.verifyUser,
  controller.getDefaultInvitation
);

router.get('/join/:id', authenticate.verifyUser, controller.joinClass);

module.exports = router;
