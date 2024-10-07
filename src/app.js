const express = require('express');

const app = express();

app.get('/test/:id', (req, res) => {
    console.log(req.params);
    res.send('get test');
});

app.post('/test', (req, res) => {
    res.send('posted');
});

app.patch('/test', (req, res) => {
    res.send('patched');
});

app.put('/test', (req, res) => {
    res.send('updated');
});

app.delete('/test', (req, res) => {
    res.send('deleted');
});

app.use('/', (req, res) => {
    res.send('slash slash slash');
});

app.listen(7777, () => {
    console.log('Started server at port number 7777 .....');
});