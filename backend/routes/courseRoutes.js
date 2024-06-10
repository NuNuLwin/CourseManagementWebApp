const express = require("express");
const {
  setCourse,
  getCourses,
  getCourseByCourseId,
} = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourses).post(setCourse);

router.route("/:id").get(getCourseByCourseId);

module.exports = router;
