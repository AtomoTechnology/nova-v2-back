const router = require('express').Router();
const sales = require('../controllers/salesController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').post(sales.create).get(sales.all).delete(sales.DeleteAll);
router.route('/:id').delete(sales.delete).patch(sales.update);
module.exports = router;
