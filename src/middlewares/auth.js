const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const appCookie = req.cookies[process.env.JWT_TOKEN_NAME];
        if (!appCookie) {
            throw new Error('Please login!');
        }
        const {_id: userId} = await jwt.verify(appCookie, process.env.JWT_SIGN_PASSWORD);
        if (!userId) {
            throw new Error('Could not authenticate user');
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Could not find user');
        }
        req.user = user;
        next();
    } catch (ex) {
        return res.status(400).send('Error: ' + ex.message);
    }
};

module.exports = {
    userAuth
};