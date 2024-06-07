const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");

// @desc    Get Course List by user id
// @route   Get /api/course
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
  const instructorId = req.query.instructorId;
  const courses = await Course.find({ instructor: instructorId }).populate(
    "class"
  );
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

  //Determine semester
  const startDateObj = new Date(startDate);
  const courseStartMonth = startDateObj.getMonth() + 1;
  const courseStartYear = startDateObj.getFullYear();

  let semester;

  if (courseStartMonth >= 1 && courseStartMonth <= 4) {
    semester = "Winter";
  } else if (courseStartMonth >= 5 && courseStartMonth <= 8) {
    semester = "Spring/Summer";
  } else {
    semester = "Fall";
  }

  semester = `${semester} ${courseStartYear}`;

  const courseNameWithSemester = `${courseName} - ${semester}`;

  const courseExists = await Course.findOne({
    courseName: courseNameWithSemester,
  });

  if (courseExists) {
    res.status(400);
    throw new Error(`${courseNameWithSemester} course already exists`);
  }

  //Create a course
  const course = await Course.create({
    courseName: courseNameWithSemester,
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
  res.status(200).json(course);
});

module.exports = {
  getCourses,
  setCourse,
};
