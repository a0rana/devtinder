const validator = require('validator');

const validateSignupData = function (reqBody) {
    const {firstName, lastName, email, password, photoUrl, skills} = reqBody;

    if (!firstName || !lastName) {
        throw new Error("First/Last name is required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Valid email address is required");
    }

    if (!validator.isURL(photoUrl)) {
        throw new Error('Photo URL is invalid');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be a strong password");
    }

    if (skills?.length > 5) {
        throw new Error('Skills should be less than five');
    }
};

const validateLoginData = function (reqBody) {
    const {email, password} = reqBody;

    if (!email || !password) {
        throw new Error("Credentials are required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Valid email address is required");
    }
};

module.exports = {
    validateSignupData,
    validateLoginData
};