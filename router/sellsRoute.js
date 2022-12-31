const router = require('express').Router();
const expenses = require('../controllers/sellsController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router
  .route('/:id')
  .get(expenses.find)
  .patch(authController.restrictTo('admin'), expenses.update)
  .delete(authController.restrictTo('admin'), expenses.delete);

router.use(authController.restrictTo('admin'));
router.route('/').post(expenses.create).delete(expenses.deleteAll).get(expenses.all);

module.exports = router;
