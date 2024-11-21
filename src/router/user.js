const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA);
        res.status(200).json({
            status: 'success',
            data: connectionRequests
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: 'accepted'},
                {fromUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA);
        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        }).select('fromUserId toUserId');
        const hideFromLoggedInUser = new Set();
        connectionRequests.forEach((cReq) => {
            hideFromLoggedInUser.add(cReq.fromUserId);
            hideFromLoggedInUser.add(cReq.toUserId);
        });
        const feedUsers = await User.find({
            $or: [
                {_id: {$nin: Array.from(hideFromLoggedInUser)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.status(200).json({
            status: 'success',
            data: feedUsers
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = userRouter;