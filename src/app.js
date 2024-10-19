const express = require('express');
const bcrypt = require('bcrypt');
const {connectToDatabase} = require('./config/database');
const User = require('./models/user');
const {validateSignupData, validateLoginData} = require('./util/validation');

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

app.get('/user', async (req, res) => {
    try {
        const userEmail = req.body.email;
        const result = await User.findOne({email: userEmail});
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/getAllUsers', async (req, res) => {
    try {
        const result = await User.find();
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.patch('/user', async (req, res) => {
    try {
        const ALLOWED_FIELDS = ['firstName', 'lastName', 'password', 'age', 'gender', 'photoUrl', 'skills'];
        for (const field of Object.keys(req.body)) {
            if (!ALLOWED_FIELDS.includes(field)) {
                throw new Error('Field not allowed: ' + field);
            }
        }
        const result = await User.findOneAndUpdate({email: req.body.email}, req.body, {returnDocument: 'before'});
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.delete('/user', async (req, res) => {
    try {
        const result = await User.findOneAndDelete({email: req.body.email});
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
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
        const isPasswordMatching = await bcrypt.compare(data.password, user.password);
        if (!isPasswordMatching) {
            throw new Error('Invalid email or password');
        }
        res.status(200).send('Login is successful!');
    } catch (err) {
        res.status(400).send(err.message);
    }
});