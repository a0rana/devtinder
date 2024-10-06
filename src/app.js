const express = require('express');

const app = express();

app.get('/test', (req, res) => {
    res.send('test');
});

app.post('/hello', (req, res) => {
    res.send('hello');
});

app.use('/', (req, res) => {
    res.send('slash slash slash');
});

app.listen(7777, () => {
    console.log('Started server at port number 7777 .....');
});