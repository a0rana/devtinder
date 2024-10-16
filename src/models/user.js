const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    'firstName': {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    'lastName': {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    'email': {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    'password': {
        type: String,
        required: true,
        validate: function() {
            if(this.password.length < 5){
                throw new Error('Password must be at least 6 characters');
            }
            if(!validator.isStrongPassword(this.password)){
                throw new Error('Password must be strong');
            }
        }
    },
    'age': {
        type: Number,
        required: true,
        min: 18,
        max: 60
    },
    'gender': {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    'photoUrl': {
        type: String,
        default: 'https://s3.amazonaws.com/photos/',
    },
    'skills': {
        type: [String],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);