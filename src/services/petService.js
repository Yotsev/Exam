const Photo = require('../models/Photo');

exports.getOne = (petId) => Photo.findById(petId).lean();

exports.getAll = () => Photo.find({}).populate('owner').lean();

exports.getOne = (petId) => Photo.findById(petId).populate('comments.userId').lean();

exports.create = (ownerId, pet) => Photo.create({ ...pet, owner: ownerId })

exports.update = (petId, petData) => Photo.findByIdAndUpdate(petId, petData, { runValidators: true });

exports.delete = (petId)=> Photo.findByIdAndDelete(petId);

exports.adComment = async (petId, userId, comment)=> {
    const pet = await Photo.findById(petId).populate('comments');

    pet.comments.push({userId, comment});

    await pet.save();
}

exports.getUserPets = async (userId)=> Photo.find({owner:userId}).populate('owner').lean();