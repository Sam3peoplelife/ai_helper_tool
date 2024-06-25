const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const registerUser = async (email, username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    return newUser;
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error("Invalid information");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid information");
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });
    return token;
};

module.exports = {
    registerUser,
    loginUser
};
