const asyncHandler = require('express-async-handler')

const Course = require('../models/courseModel')

// @desc    Get Course List by user id
// @route   Get /api/course
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ 'instructor.id': req.query.id })
    res.status(200).json(courses)
})

// @desc    Create a new Course
// @route   POST /api/course
// @access  Private
const setCourse = asyncHandler(async (req, res) => {
    const { courseName, startDate, endDate, startTime, endTime, days} = req.body

    if (!courseName || !startDate || !endDate || !startTime || !endTime) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const courseExists = await Course.findOne({
        courseName: courseName, startDate: startDate
    })
  
    console.log(courseExists)
    if (courseExists) {
        res.status(400)
        throw new Error('courseExists already exists')
    }

    //Create a course
    const course = await Course.create({
        courseName: req.body.courseName,
        instructor: {
            id: req.query.id,
        },
        //classId: req.body.classId,
        class: req.body.class.map(c => ({ id: c.id })),
        activity: req.body.activity.map(a => ({
            id: a.id,
            activity_name: a.activity_name
        })),
        //activityId: req.body.activityId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        days: req.body.days

    })
    console.log(req.body.courseName)
    res.status(200).json(course)
})

module.exports = {
    getCourses,
    setCourse,
}