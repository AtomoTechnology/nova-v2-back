const router = require('express').Router();
const state = require('../controllers/stateController');

router.get('/migrate', state.migrateStates);

router.route('/').post(state.create).get(state.all).delete(state.DeleteAll);
router.route('/:id').delete(state.delete).put(state.update);
module.exports = router;
