const router = require('express').Router();
const banner = require('../controllers/bannerController');
router.route('/').get(banner.all).post(banner.create);
router.delete('/:id', banner.delete);

module.exports = router;
