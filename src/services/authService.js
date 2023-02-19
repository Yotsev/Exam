const bcrypt = require('bcrypt');

const User = require('../models/User');
const jwt = require('../libs/jsonwebtoken');
const config = require('../configs/config');
const { minPasswordLength } = require('../constants');

exports.getUserByUsername = (username) => User.findOne({ username });

exports.getExistingUser = async (username, email) => {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    return existingUser;
};

exports.register = async (user) => {
    const existingUser = await this.getExistingUser(user.email, user.username);

    if (existingUser) {
        throw new Error('User exists');
    }

    if (user.password.length < minPasswordLength) {
        throw new Error(`Password must be at least ${minPasswordLength} characters long`);
    }

    if (user.password !== user.rePassword) {
        throw new Error('Password mismatch');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await User.create({ ...user, password: hashedPassword });

    return this.login(user.username, user.password);
};

exports.login = async (username, password) => {
    const user = await this.getUserByUsername(username);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    const payload = {
        _id: user._id,
        email: user.email,
        username
    };

    const token = await jwt.sign(payload, config.SECRET);

    return token;
};