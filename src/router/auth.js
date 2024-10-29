const express = require('express');
const {validateSignupData, validateLoginData} = require("../util/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        validateSignupData(data);
        data.password = await bcrypt.hash(req.body.password, 10);
        const user = new User(data);
        const result = await user.save();
        res.status(200).send('User created successfully ' + result._id);
    } catch (err) {
        res.status(400).send(err.message);
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

        res.status(200).send('Login is successful!');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = authRouter;