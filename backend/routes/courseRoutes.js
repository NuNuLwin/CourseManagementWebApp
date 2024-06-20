const express = require("express");
const {
  setCourse,
  getCourses,
  getCourseByCourseId,
  updateActivities,
  deleteActivity,
} = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourses).post(setCourse);

router.route("/:id").get(getCourseByCourseId);

router.route("/:id/activities").put(updateActivities);

router.route("/:id/:activityId").delete(deleteActivity);

module.exports = router;
