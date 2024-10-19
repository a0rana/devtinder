const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {connectToDatabase} = require('./config/database');
const User = require('./models/user');
const {validateSignupData, validateLoginData} = require('./util/validation');
const {userAuth} = require('./middlewares/auth');

const app = express();

connectToDatabase().then(() => {
    console.log('Connection to the database has been established .....');

    app.listen(7777, () => {
        console.log('Started server at port number 7777 .....');
    });
}).catch((err) => {
    console.error(err.message);
});

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});