const express = require('express');
const {adminAuth: adminAuthMiddleware, userAuth: userAuthMiddleware} = require('./middlewares/auth');

const app = express();

app.use('/admin', adminAuthMiddleware);

app.get('/admin/getAllData', (req, res) => {
    res.status(200).send('All admin data sent');
});

app.post('/user/login', (req, res) => {
    res.status(200).send('Enter login details');
});

app.get('/user/getAllData', userAuthMiddleware, (req, res) => {
    res.status(200).send('All user data sent');
});

app.listen(7777, () => {
    console.log('Started server at port number 7777 .....');
});