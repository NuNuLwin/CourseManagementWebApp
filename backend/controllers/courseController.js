const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");
const courseModel = require("../models/courseModel");

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// @desc    Get Course List by user id
// @route   Get /api/course
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
  const instructorId = req.query.instructorId;
  const courseStatus = req.query.courseStatus || "inprogress"; // Default is inprogress course
  const currentDate = new Date();

  let query = { instructor: instructorId };

  if (courseStatus === "inprogress") {
    query = {
      ...query,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    };
  } else if (courseStatus === "end") {
    query = {
      ...query,
      endDate: { $lt: currentDate },
    };
  } else if (courseStatus === "future") {
    query = {
      ...query,
      startDate: { $gte: currentDate },
    };
  }
  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .populate("class");

  courses.forEach((course) => {
    course.days = ALL_DAYS.filter((x) => course.days.includes(x));
  });

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

  newDays = ALL_DAYS.filter((x) => days.includes(x));

  // convert date to ISO format
  const startDateUTC = new Date(startDate).toISOString();
  const endDateUTC = new Date(endDate).toISOString();

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
    startDate: startDateUTC,
    endDate: endDateUTC,
    startTime: startTime,
    endTime: endTime,
    days: newDays,
  });
  res.status(200).json(course);
});

// @desc    Get Course List by course id
// @route   Get /api/course
// @access  Private
const getCourseByCourseId = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("class")
    .populate("instructor", "firstname lastname");
  if (!course) {
    res.status(400);
    throw new Error("Course not found");
  }
  res.status(200).json(course);
});

// @desc    Get Course Detail by course id and category id
// @route   Get /api/course
// @access  Private
const getCourseDetail = asyncHandler(async (req, res) => {
  console.log("inside getCourseDetail");
  console.log(req.params.id);
  console.log(req.params.categoryId);

  // const course = await courseModel.find;
  res.status(200).json("inside getCourseDetailByCategoryId");
});

module.exports = {
  getCourses,
  setCourse,
  getCourseByCourseId,
  getCourseDetail,
};
