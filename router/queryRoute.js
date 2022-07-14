const express = require('express');
const router = express.Router();
const queryController = require('./../controllers/queryController');
const authController = require('./../controllers/authController');

router.get('/migrate', queryController.migrateQuery);

router.use(authController.protect);
router.put('/:id/setRead', queryController.UpdateRead);

router.route('/').get(queryController.GetAll).post(authController.restrictTo('user', 'admin'), queryController.Create);
router
  .route('/:id')
  .get(queryController.GetById)
  .delete(authController.restrictTo('admin'), queryController.Delete)
  .patch(queryController.ResponseQuery);

module.exports = router;
