const asyncHandler = require('express-async-handler')

const Activity = require('../models/activityModel')

// @desc    Get activity
// @route   Get /api/activity
// @access  Private
const getActivity = asyncHandler(async (req, res) => {
    const activities = await Activity.find()
    res.status(200).json(activities)
})

// @desc    Create a new activity
// @route   POST /api/activity
// @access  Private
const setActivity = asyncHandler(async (req, res) => {

    const { activityName } = req.body

    // Check if activity exists
    const activityExists = await Activity.findOne({ activityName })

    if (activityExists) {
        res.status(400)
        throw new Error('Activity already exists')
    }

    //Create an activity
    const activity = await Activity.create({
        activityName: req.body.activityName,

    })
    res.status(200).json(activity)
})

module.exports = {
    getActivity,
    setActivity,
}