const router = require('express').Router();
const banner = require('../controllers/bannerController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(banner.all)
  .post(authController.protect, authController.restrictTo('admin', 'tecnico'), banner.create);
router.delete('/:id', authController.protect, authController.restrictTo('admin', 'tecnico'), banner.delete);
module.exports = router;
