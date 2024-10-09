const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
    await mongoose.connect(process.env.CONNECTION_STRING);
}

module.exports = {
    connectToDatabase
};