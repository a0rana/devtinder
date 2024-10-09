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

app.post('/signup', async (req, res) => {
    try {
        const user = new User({
            email: 'hello@gmail.com',
            firstName: 'hi',
            lastName: 'hello',
            password: '123456'
        });
        await user.save();
        res.status(200).send('User created successfully.');
    } catch (err) {
        res.status(400).send(err);
    }
});