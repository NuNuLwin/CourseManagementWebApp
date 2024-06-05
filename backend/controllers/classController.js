const asyncHandler = require('express-async-handler')

const Class = require('../models/classModel')

// @desc    Get class
// @route   Get /api/class
// @access  Private
const getClass = asyncHandler(async (req, res) => {
    const classes = await Class.find()
    res.status(200).json(classes)
})

// @desc    Create a new class
// @route   POST /api/class
// @access  Private
const setClass = asyncHandler(async (req, res) => {

    const { className } = req.body

    // Check if class exists
    const classExists = await Class.findOne({ className })

    if (classExists) {
        res.status(400)
        throw new Error('Class already exists')
    }

    //Create a class
    const createClass = await Class.create({
        className: req.body.className,

    })
    res.status(200).json(createClass)
})

module.exports = {
    getClass,
    setClass
}