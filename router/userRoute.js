const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const usersRouter = express.Router();

usersRouter.post('/migrate', userController.migrateUsers);
usersRouter.post('/signup', authController.signUp);
usersRouter.post('/signin', authController.signIn);
usersRouter.route('/contact').get(userController.contact).post(userController.createContact);
usersRouter.delete('/contact/:id', userController.deleteContact);
usersRouter.post('/forgotPassword', authController.forgotPassword);
usersRouter.patch('/resetPassword/:token', authController.resetPassword);

// usersRouter.get('/updatePasswordFormerUsers', userController.updatePasswordFormerUser);

usersRouter.use(authController.protect);

usersRouter.post('/renewToken', authController.renewToken);
usersRouter.patch('/updateMyPassword', authController.updatePassword);
usersRouter.patch('/updateMe', userController.GetMe, userController.updateMe);
usersRouter.get('/me', authController.restrictTo('user'), userController.GetMe, userController.find);
usersRouter.delete('/deleteMe', authController.restrictTo('user'), userController.setDeleteMe, userController.deleteMe);
usersRouter.post('/updateAvatar/:id', authController.restrictTo('admin', 'tecnico'), userController.UpdateAvatar);
//

usersRouter.route('/').get(authController.restrictTo('admin', 'tecnico'), userController.allPagination);
usersRouter.route('/all').get(authController.restrictTo('admin', 'tecnico'), userController.all);
usersRouter.route('/search/:filter').get(authController.restrictTo('admin', 'tecnico'), userController.SearchUser);
usersRouter
  .route('/:id')
  .get(userController.find)
  // .delete(userController.delete)
  .delete(authController.restrictTo('admin'), userController.delete)
  .patch(userController.updateUser);

module.exports = usersRouter;
