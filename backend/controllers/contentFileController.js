const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

//model
const activityModel = require("../models/activityModel");
const courseModel = require("../models/courseModel");
const contentFileModel = require("../models/contentFileModel");

// @desc    Upload content File
// @route   /api/content/files/
// @access  Private

const uploadContentFile = asyncHandler(async (req, resp) => {
  console.log("inside uploadContentFile");
  // check if request has course id
  if (!req.body.course_id || !req.body.activity_id) {
    console.log("no course id and activity id");
    resp.status(400);
    resp.json("no course id and activity id");
  }
});

module.exports = {
  uploadContentFile,
};
