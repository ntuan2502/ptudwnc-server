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

router
  .route('/:id')
  .get(authenticate.verifyUser, controller.getClass)
  .post(authenticate.verifyUser, controller.notAllowMethod)
  .patch(authenticate.verifyUser, controller.updateClass)
  .delete(authenticate.verifyUser, controller.deleteClass);

//This hasn't working yet, don't call this route.
//Add authorization to this route first.
router.get('/join/:id', controller.joinClass);

module.exports = router;
