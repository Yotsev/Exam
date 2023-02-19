const userRouter = require('express').Router();

const { isAuthenticated } = require('../middlewares/authMiddleware');

userRouter.get('/profile', isAuthenticated, async (req, res)=> {
    const user = req.params.userId
    
    res.render('user/profile', {user});
});

module.exports = userRouter;