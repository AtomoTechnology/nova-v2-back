const router = require('express').Router();
const workController = require('../controllers/workController');
const authController = require('../controllers/authController');

router.post('/code', workController.getAllWorks);

router.use(authController.protect);

// router.use(authController.restrictTo('admin', 'tecnico'));
router.get('/client', workController.getAllWorks);
// router.get('/updateFormerStates', workController.UpdateStatesToArray);
// authController.restrictTo('admin', 'tecnico'),
// authController.restrictTo('admin', 'tecnico'),
router.route('/').get(workController.getAllWorks).post(workController.createWork);
router.route('/pagination').get(authController.restrictTo('admin', 'tecnico'), workController.all);

router
  .route('/:id')
  .get(workController.find)
  .patch(authController.restrictTo('admin', 'tecnico'), workController.updateWork)
  .delete(authController.restrictTo('admin', 'tecnico'), workController.deleteWork);

router.delete('/', authController.restrictTo('admin'), workController.deleteAll);
// router.route('/generateOrder/:id').post(workController.GenerateOrder);
router.route('/download/Order').get(workController.DownloadOrder);
router.route('/sendMailDoneWork').post(authController.restrictTo('admin', 'tecnico'), workController.sendMailDoneWork);
router.post('/historialWork/all', authController.restrictTo('admin'), workController.getWorksByDataAndTurnedinState);

module.exports = router;
