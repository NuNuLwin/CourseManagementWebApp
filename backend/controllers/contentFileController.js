const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { Readable } = require("stream");

//model
const Activity = require("../models/activityModel");
const Course = require("../models/courseModel");
const ContentFile = require("../models/contentFileModel");

// @desc    Upload content File
// @route   Post /api/content/files/
// @access  Private

const uploadContentFile = asyncHandler(async (req, res) => {
  // check if request has course id
  if (!req.body.course_id || !req.body.activity_id) {
    res.status(400);
    res.json("no course id and activity id");
  }

  const { course_id, activity_id } = req.body;

  const findCourse = await Course.findById(course_id);
  if (!findCourse) {
    res.status(400);
    throw new Error("The course does not exist.");
  }

  const findActivity = await Activity.findById(activity_id);
  if (!findActivity) {
    res.status(400);
    throw new Error("The activity does not exist.");
  }

  const { originalname, buffer } = req.file;
  // GridFS Bucket, Upload Stream,
  let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "content",
  });

  let uploadStream = bucket.openUploadStream(originalname);

  // Readable Stream
  let readBuffer = new Readable();
  readBuffer.push(buffer);
  readBuffer.push(null);

  // Upload the file
  const isUploaded = await new Promise((resolve, reject) => {
    readBuffer
      .pipe(uploadStream)
      .on("finish", resolve("successfull"))
      .on("error", reject("error occured while creating stream"));
  });

  // if upload fails, return an error message
  if (!isUploaded) {
    res.status(404);
    throw new Error("File upload fails.");
  }

  // append new file id and update course object
  let allContentFiles = findCourse.files || [];
  let newFile = {
    file: uploadStream.id,
    activity: activity_id,
  };

  allContentFiles.push(newFile);
  await Course.updateOne(
    { _id: req.body.course_id },
    { files: allContentFiles }
  );

  const course = await Course.findById(course_id).populate([
    "class",
    "activity",
    "files.file",
    "files.activity",
  ]);
  res.status(200).json(course);
  //return resp.send({ results: course });
});

// @desc    View Course File
// @route   Get /api/courses/files/:id
// @access  Private
const viewContentFile = asyncHandler(async (req, res) => {
  const findContentFile = await ContentFile.findById(req.params.id);

  if (!findContentFile) {
    res.status(400);
    throw new Error("The course file does not exist.");
  }

  // GridFS Bucket, Write Stream,
  let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "content",
  });
  bucket.openDownloadStream(findContentFile._id).pipe(res);
});

module.exports = {
  uploadContentFile,
  viewContentFile,
};
