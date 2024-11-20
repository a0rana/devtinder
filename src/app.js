const express = require('express');
const cookieParser = require('cookie-parser');
const {connectToDatabase} = require('./config/database');
const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const connectionRequestRouter = require('./router/connectionRequest');
const userRouter = require('./router/user');

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

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRequestRouter);
app.use('/', userRouter);

