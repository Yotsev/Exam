const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Name is required'],
        minLength: [2, 'Name should be at least 2 characters long'],
    },
    image: {
        type: String,
        required: [true,'Image is required'],
        validate: {
            validator: function (value) {
                return value.startsWith('http://') || value.startsWith('https://');
            },
            message: 'Invaild Url'
        },
    },
    age: {
        type: Number,
        required: [true,'Age is required'],
        min: [1, 'Age should be greater than 1'],
        max: [100, 'Age should be less than 100']
    },
    description: {
        type: String,
        required: [true,'Description is required'],
        minLength: [5, 'Name should be at least 5 characters long'],
        maxLength: [50, 'Description should be less than 50 characters'],
    },
    location: {
        type: String,
        required: [true,'Location is required'],
        minLength: [5, 'Location should be at least 5 characters long'],
        maxLength: [50, 'Location should be less than 50 characters'],
    },
    comments: [{
        userId :{
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        comment: String
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;