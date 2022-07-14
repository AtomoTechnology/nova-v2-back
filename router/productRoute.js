const router = require('express').Router();
const product = require('../controllers/productController');

router.route('/').post(product.create).get(product.all).delete(product.DeleteAll);
router.route('/:id').delete(product.delete).put(product.update);
module.exports = router;
