const express = require('express');
const {connectToDatabase} = require('./config/database');
const User = require('./models/user');

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
        const user = new User(req.body);
        const result = await user.save();
        res.status(200).send('User created successfully ' + result._id);
    } catch (err) {
        res.status(400).send(err);
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
        const result = await User.findOneAndUpdate({email: req.body.email}, req.body, {returnDocument: 'before'});
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
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