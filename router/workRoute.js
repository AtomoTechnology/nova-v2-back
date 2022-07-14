const router = require('express').Router();
const workController = require('../controllers/workController');
const authController = require('../controllers/authController');

router.post('/code', workController.GetWorkByCode);
router.get('/migrate', workController.migrateWorks);

router.use(authController.protect);

// router.use(authController.restrictTo('admin', 'tecnico'));
router.get('/client', workController.getAllWorks);
router.get('/done', workController.ConfirmWork);
router.get('/stats', workController.WorkStats);
router.get('/updateFormerStates', workController.UpdateStatesToArray);
// authController.restrictTo('admin', 'tecnico'),
// authController.restrictTo('admin', 'tecnico'),
router.route('/').get(workController.getAllWorks).post(workController.createWork);
router.route('/pagination').get(authController.restrictTo('admin', 'tecnico'), workController.all);

router
  .route('/:id')
  .get(workController.find)
  .patch(authController.restrictTo('admin', 'tecnico'), workController.updateWork)
  .delete(authController.restrictTo('admin', 'tecnico'), workController.deleteWork);

router.delete('/', workController.deleteAll);
// router.route('/generateOrder/:id').post(workController.GenerateOrder);
router.route('/download/Order').get(workController.DownloadOrder);
router.post('/historialWork/all', authController.restrictTo('admin'), workController.getWorksByDataAndTurnedinState);

// router.post('/uploadFileWork', workController.uploadImagenWork);

module.exports = router;