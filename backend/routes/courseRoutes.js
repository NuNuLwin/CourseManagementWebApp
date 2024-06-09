const express = require("express");
const {
  setCourse,
  getCourses,
  getCourseByCourseId,
  getCourseDetail,
} = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourses).post(setCourse);

router.route("/:id").get(getCourseByCourseId);

router.route("/:id/:categoryId").get(getCourseDetail);

module.exports = router;
