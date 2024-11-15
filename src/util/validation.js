const validator = require('validator');
const req = require("express/lib/request");

const validateSignupData = function (reqBody) {
    const allowedSignupProps = ['firstName', 'lastName', 'photoUrl', 'email', 'password', 'skills'];
    validateProps(reqBody, allowedSignupProps, 'signup');
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

const validateUpdateProfileData = function (reqBody) {
    const allowedUpdateProfileProps = ['firstName', 'lastName', 'photoUrl', 'skills'];
    validateProps(reqBody, allowedUpdateProfileProps, 'updating profile');
};

const validateLoginData = function (reqBody) {
    const allowedLoginDataProps = ['email', 'password'];
    validateProps(reqBody, allowedLoginDataProps, 'login');
    const {email, password} = reqBody;

    if (!email || !password) {
        throw new Error("Credentials are required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Valid email address is required");
    }
};

const validateLogoutData = function (reqBody) {
    const allowedLogoutDataProps = ['email', 'oldPassword', 'newPassword'];
    validateProps(reqBody, allowedLogoutDataProps, 'logout');
    const {email, oldPassword, newPassword} = reqBody;

    if (!email || !oldPassword || !newPassword) {
        throw new Error("Email, old password and new password are required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Valid email address is required");
    }
};

const validateProps = function (reqBody, props, feature) {
    Object.keys(reqBody).every(function (key) {
        if (!props.includes(key)) {
            throw new Error(`${key} not allowed for ${feature}`);
        }
    });
};

module.exports = {
    validateSignupData,
    validateLoginData,
    validateLogoutData,
    validateUpdateProfileData
};