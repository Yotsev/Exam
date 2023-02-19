const router = require('express').Router();

const { authentication } = require('./middlewares/authMiddleware');

const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');
const petController = require('./controllers/petController');
const userController = require('./controllers/userController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/pet', petController);
router.use('/user', userController)
router.get('*', (req, res)=> {
    res.render('home/404');
});

module.exports = router;