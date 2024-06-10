const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");
const StudentRegistration = require("../models/studentRegistrationModel");
const Activity = require("../models/activityModel");

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// @desc    Get Course List by user id
// @route   Get /api/course
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
  const instructorId = req.query.instructorId;
  const studentId = req.query.studentId;
  const courseStatus = req.query.courseStatus || "inprogress"; // Default is inprogress course
  const currentDate = new Date();

  let query = instructorId ? { instructor: instructorId } : {};
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

  let courses = [];
  if (studentId) {
    const studentRegistrations = await StudentRegistration.find({
      user: studentId,
      registrationstatus: "registered",
    });

    const classIds = studentRegistrations.map(
      (registration) => registration.class
    );

    query = {
      ...query,
      class: { $in: classIds },
    };
  }

  courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .populate("class")
    .populate("instructor", "firstname lastname");

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

  const startDateObj = new Date(startDate);
  const courseStartMonth = startDateObj.getMonth() + 1;
  const courseStartYear = startDateObj.getFullYear();

  const semester = getSemester(startDateObj);

  if (!semester) {
    console.log("Invalid start date");
    return false;
  }

  const courses = await Course.find({
    class: { $in: classId },
  });

  const courseExists = courses.some((course) => {
    const semesterForCourse = getSemester(course.startDate);
    //console.log("semesterForCourse:", semesterForCourse, "semester:", semester);
    return semesterForCourse === semester;
  });
  const semesterAndYear = `${semester} ${courseStartYear}`;
  const courseNameWithSemester = `${courseName} - ${semesterAndYear}`;

  if (courseExists) {
    res.status(400);
    throw new Error(`${courseNameWithSemester} course already exists`);
  }

  const activities = await Activity.find();
  const activityIds = activities.map((activity) => activity._id);

  //Create a course
  const course = await Course.create({
    courseName: courseNameWithSemester,
    instructor: instructorId,
    class: classId,
    startDate: startDateUTC,
    endDate: endDateUTC,
    startTime: startTime,
    endTime: endTime,
    days: newDays,
    activities: activityIds,
  });
  res.status(200).json(course);
});

// @desc    Get Course List by course id
// @route   Get /api/course
// @access  Private
const getCourseByCourseId = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("class")
    .populate("instructor", "firstname lastname")
    // .populate({
    //   path: "files.file",
    // })
    .populate({
      path: "files.activity",
      select: "activityName",
    })
    .populate({
      path: "activities",
      select: "activityName",
    });

  if (!course) {
    res.status(400);
    throw new Error("Course not found");
  }
  res.status(200).json(course);
});

//Determine semester
function getSemester(startDate) {
  const month = startDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
  if (month >= 1 && month <= 4) {
    return "Winter";
  } else if (month >= 5 && month <= 8) {
    return "Spring/Summer";
  } else if (month >= 9 && month <= 12) {
    return "Fall";
  }
  return null;
}
module.exports = {
  getCourses,
  setCourse,
  getCourseByCourseId,
};
