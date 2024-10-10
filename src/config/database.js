const mongoose = require('mongoose');

const connectToDatabase = async () => {
    await mongoose.connect(process.env.CONNECTION_STRING);
}

module.exports = {
    connectToDatabase
};