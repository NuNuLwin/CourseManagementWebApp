const express = require("express");
const {
  setCourse,
  getCourses,
  getCourseByCourseId,
  updateActivities,
} = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourses).post(setCourse);

router.route("/:id").get(getCourseByCourseId);

router.route("/:id/activities").put(updateActivities);

module.exports = router;
