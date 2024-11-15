const express = require('express');
const connectionRequestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

connectionRequestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ['ignored', 'interested'];
        if (!allowedStatus.includes(status)) {
            throw new Error(`Status: ${status} is invalid`);
        }

        if (!mongoose.isValidObjectId(toUserId)) {
            throw new Error(`Invalid userid : ${toUserId}`);
        }

        const userExists = await User.findById(toUserId);
        if (!userExists) {
            throw new Error('User does not exist');
        }

        const connectionExists = await ConnectionRequest.findOne({
            $or: [{fromUserId: fromUserId, toUserId: toUserId}, {fromUserId: toUserId, toUserId: fromUserId}]
        });
        if (connectionExists) {
            throw new Error(`Connection request already exists`);
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });
        await connectionRequest.save();
        res.status(200).json({
            status: 'success',
            message: 'Connection request created successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = connectionRequestRouter;