const petRouter = require('express').Router();
const petService = require('../services/petService');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorParser');

petRouter.get('/catalog', async (req, res) => {
    const pets = await petService.getAll();

    res.render('pet/catalog', { pets });
});

petRouter.get('/create', isAuthenticated, (req, res) => {
    res.render('pet/create')
});

petRouter.post('/create', isAuthenticated, async (req, res) => {
    const pet = req.body;

    try {
        await petService.create(req.user._id, pet)
    } catch (err) {
        return res.status(400).render('pet/create', { error: getErrorMessage(err) });
    }

    res.redirect('/pet/catalog');
});

petRouter.get('/:petId/details', async (req, res) => {
    const pet = await petService.getOne(req.params.petId);
    const isOwner = pet.owner._id == req.user?._id;
    const isNotOwner = pet.owner._id != req.user?._id;

    res.render('pet/details', { pet, isOwner, isNotOwner });
});

petRouter.get('/:petId/edit', isAuthenticated, async (req, res) => {
    const pet = await petService.getOne(req.params.petId);
    const isNotOwner = pet.owner._id != req.user._id;

    if (isNotOwner) {
        return res.redirect('/404');
    }

    res.render('pet/edit', { pet });
});

petRouter.post('/:petId/edit', isAuthenticated, async (req, res) => {
    const pet = req.body;

    try {
        await petService.update(req.params.petId, pet);
    } catch (err) {
        return res.status(400).render('pet/edit', { pet, error: getErrorMessage(err) });
    }

    res.redirect(`/pet/${req.params.petId}/details`);
});

petRouter.get('/:petid/delete', isAuthenticated, async (req, res) => {
    const pet = await petService.getOne(req.params.petid);

    if (pet.owner._id != req.user._id) {
        return res.redirect('/404');
    };

    await petService.delete(req.params.petid);

    res.redirect('/pet/catalog');
});

petRouter.post('/:petId/comment', isAuthenticated, async (req, res) => {
    const { comment } = req.body;
    const pet = await petService.getOne(req.params.petId)

    await petService.adComment(req.params.petId, req.user._id, comment);

    res.redirect(`/pet/${req.params.petId}/details`);
});

module.exports = petRouter;