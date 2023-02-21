const userRouter = require('express').Router();
const petService = require('../services/petService');

const { isAuthenticated } = require('../middlewares/authMiddleware');

userRouter.get('/profile', isAuthenticated, async (req, res) => {
    const user = req.user
    const userPets = await petService.getUserPets(req.user._id); 
 
    res.render('user/profile', { user, userPets });
});

module.exports = userRouter;