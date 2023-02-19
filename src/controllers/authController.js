const authController = require('express').Router();

const authService = require('../services/authService');
const { getErrorMessage } = require('../utils/errorParser');
const { isLoggedIn } = require('../middlewares/authMiddleware');

authController.get('/register', isLoggedIn, (req, res) => {
    res.render('auth/register');
});

authController.post('/register', isLoggedIn, async (req, res) => {
    const user = req.body;

    try {
        const token = await authService.register(user);

        res.cookie('auth', token);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        console.log(err);
        return res.status(400).render('auth/register', { error: getErrorMessage(err) });
    }
});

authController.get('/login', isLoggedIn, (req, res) => {
    res.render('auth/login');
});

authController.post('/login', isLoggedIn, async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.login(username, password);

        res.cookie('auth', token);
        res.redirect('/');
    } catch (err) {
        return res.status(400).render('auth/login', { error: getErrorMessage(err) });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});

module.exports = authController;