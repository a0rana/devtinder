const express = require('express');
const {validateSignupData, validateLoginData, validateLogoutData} = require("../util/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

authRouter.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        validateSignupData(data);
        data.password = await bcrypt.hash(req.body.password, 10);
        const user = new User(data);
        const result = await user.save();
        res.status(200).json({
            success: true,
            message: 'User created successfully ' + result._id
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const data = req.body;
        validateLoginData(data);
        const user = await User.findOne({email: data.email});
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordMatching = await user.validatePassword(data.password);
        if (!isPasswordMatching) {
            throw new Error('Invalid email or password');
        }
        const token = await user.getJWT();
        res.cookie(process.env.JWT_TOKEN_NAME, token, {expires: new Date(Date.now() + 8 * 3600000)});
        res.status(200).json({
            success: true,
            message: 'Login is successful'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

authRouter.post('/logout', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.cookie(process.env.JWT_TOKEN_NAME, null, {expires: new Date()});
        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = authRouter;