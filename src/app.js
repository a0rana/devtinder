const express = require('express');
const {connectToDatabase} = require('./config/database');
const User = require('./models/user');
const validator = require('validator');

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
        if(!validator.isEmail(data.email)) {
            throw new Error('Email is invalid: '+ data.email);
        }
        if(!validator.isURL(data.photoUrl)) {
            throw new Error('Photo URL is invalid: '+ data.photoUrl);
        }
        if(data.skills?.length > 5) {
            throw new Error('Skills should be less than five');
        }
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
        for(const field of Object.keys(req.body)){
            if(!ALLOWED_FIELDS.includes(field)){
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