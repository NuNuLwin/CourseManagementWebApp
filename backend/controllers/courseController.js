const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");

// @desc    Get Course List by user id
// @route   Get /api/course
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ "instructor.id": req.query.id });
  res.status(200).json(courses);
});

// @desc    Create a new Course
// @route   POST /api/course
// @access  Private
const setCourse = asyncHandler(async (req, res) => {
  const {
    courseName,
    startDate,
    endDate,
    startTime,
    endTime,
    days,
    classId,
    instructorId,
  } = req.body;

  console.log(classId);

  if (
    !courseName ||
    !startDate ||
    !endDate ||
    !startTime ||
    !endTime ||
    !days ||
    !classId
  ) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const courseExists = await Course.findOne({
    courseName: courseName,
    startDate: startDate,
  });

  if (courseExists) {
    res.status(400);
    throw new Error("courseExists already exists");
  }

  //Create a course
  const course = await Course.create({
    courseName: courseName,
    instructor: instructorId,
    //class: req.body.class.map(c => c.id),
    class: classId,
    //activity: req.body.activity.map(a => a.id),
    startDate: startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    days: days,
  });
  console.log(req.body.courseName);
  res.status(200).json(course);
});

module.exports = {
  getCourses,
  setCourse,
};
