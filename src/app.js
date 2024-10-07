const express = require('express');

const app = express();

app.get('/test', (req, res, next) => {
        console.log('route handler 1');
        //res.send('response 1');
        next();
    },
    [(req, res, next) => {
        console.log('route handler 2');
        res.send('response 2');
        //next();
    },
    (req, res, next) => {
        console.log('route handler 3');
        //res.send('response 3');
        next();
    }],
    (req, res, next) => {
        console.log('route handler 4');
        // next();
        res.send('response 4');
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

/*app.use('/', (req, res) => {
    res.send('slash slash slash');
});*/

app.listen(7777, () => {
    console.log('Started server at port number 7777 .....');
});