const router = require('express').Router();
const product = require('../controllers/productController');

const authController = require('../controllers/authController');

router
  .route('/')
  .post(authController.protect, authController.restrictTo('admin', 'tecnico'), product.create)
  .get(product.all)
  .delete(authController.protect, authController.restrictTo('admin', 'tecnico'), product.DeleteAll);

router.use(authController.protect);
router
  .route('/:id')
  .delete(authController.restrictTo('admin'), product.delete)
  .patch(authController.restrictTo('admin', 'tecnico'), product.update);
// router.post('/uploadStorePhotos', product.uploadStorePhotos);

module.exports = router;
