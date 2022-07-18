const router = require('express').Router();
const expenses = require('../controllers/expensesController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/').post(expenses.create).delete(expenses.deleteAll).get(expenses.all);
router.route('/:id').get(expenses.find).delete(expenses.delete);

module.exports = router;
