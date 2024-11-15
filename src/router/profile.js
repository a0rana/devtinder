const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateUpdateProfileData, validateLogoutData} = require("../util/validation");
const bcrypt = require("bcrypt");

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const data = req.body;
        validateUpdateProfileData(data);
        const user = req.user;
        user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
        user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
        user.photoUrl = req.body.photoUrl ? req.body.photoUrl : user.photoUrl;
        user.skills = req.body.skills ? req.body.skills : user.skills;
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const data = req.body;
        validateLogoutData(data);
        const user = req.user;
        const isPasswordMatching = await user.validatePassword(data.oldPassword);
        if (!isPasswordMatching) {
            throw new Error('Invalid old password');
        }
        user.password = await bcrypt.hash(req.body.newPassword, 10);
        const result = await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully for user: ' + result._id
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = profileRouter;
