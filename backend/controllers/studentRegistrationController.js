const asyncHandler = require("express-async-handler");
const studentRegistration = require("../models/studentRegistrationModel");
const course = require("../models/courseModel");

const registeration = asyncHandler(async (req, res) => {
  console.log("setStudentRegistration body " + req.body);
  const { user_id, class_id, registration_status } = req.body;

  if (!user_id || !class_id || !registration_status) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const studentregistration = await studentRegistration.create({
    user: user_id,
    class: class_id,
    registrationstatus: registration_status,
  });
  res.status(200).json(studentregistration);
});

const getRegistrationStudent = asyncHandler(async (req, res) => {
  const resultStudent = [];
  const courseid = req.params.id;
  const Course = await course.findById(courseid); //   66612c67e68eaae1d01648ab   66612267e68eaae1d01648a7   66613072e68eaae1d01648b7
  const startDate = Course.startDate;
  const endDate = Course.endDate;
  const classlist = Course.class;

  // retrieve registered student based on course
  const checkStudents = await studentRegistration
    .where("class")
    .equals(classlist);
  if (checkStudents.length === 0) {
    // res.status(400)
    // throw new Error('There is no student registered in this course.')
    res.status(200).json(resultStudent);
  }

  const studentlist = await studentRegistration
    .where("class")
    .equals(classlist)
    .populate("class")
    .populate("user");

  console.log("after student list is 0");

  for (let i = 0; i < studentlist.length; i++) {
    const id = studentlist[i]._id;
    const studentname =
      studentlist[i].user.firstname + " " + studentlist[i].user.lastname;
    const email = studentlist[i].user.email;
    const classname = studentlist[i].class.className;
    const registrationstatus = studentlist[i].registrationstatus;
    console.log("each student studentname =>" + studentname);
    resultStudent.push({
      id: id,
      studentname: studentname,
      email: email,
      classname: classname,
      registrationstatus: registrationstatus,
      startDate: startDate,
      endDate: endDate,
    });
  }

  res.status(200).json(resultStudent);
});

const registerStudents = asyncHandler(async (req, res) => {
  const classes = [];
  const courseid = req.params.id;
  const Course = await course.findById(courseid);
  const classlist = Course.class;

  //retrieve class id array and create id arrary which are to put as filter in update query
  for (let i = 0; i < classlist.length; i++) {
    classes.push({
      class: classlist[i],
    });
  }

  // updat registration status
  const update = { registrationstatus: "registered" };
  const updateRegisteredStatus = await studentRegistration.updateMany(
    {
      $or: classes, // filter document which classid is include in the classid array
    },
    {
      $set: update, // and update as 'registered'
    }
  );
  if (!updateRegisteredStatus) {
    res.status(400);
    throw new Error("Encounter error in registration students");
  }
  console.log("updateRegisteredStatus " + updateRegisteredStatus);

  // return response
  const checkStudents = await studentRegistration
    .where("class")
    .equals(classlist);
  if (checkStudents.length === 0) {
    res.status(400);
    throw new Error("There is no student registered in this course.");
  }

  const studentlist = await studentRegistration
    .where("class")
    .equals(classlist)
    .populate("class")
    .populate("user");

  const startDate = Course.startDate;
  const endDate = Course.endDate;
  const resultStudent = [];
  for (let i = 0; i < studentlist.length; i++) {
    const id = studentlist[i]._id;
    const studentname =
      studentlist[i].user.firstname + " " + studentlist[i].user.lastname;
    const email = studentlist[i].user.email;
    const classname = studentlist[i].class.className;
    const registrationstatus = studentlist[i].registrationstatus;
    resultStudent.push({
      id: id,
      studentname: studentname,
      email: email,
      classname: classname,
      registrationstatus: registrationstatus,
      startDate: startDate,
      endDate: endDate,
    });
  }
  res.status(200).json(resultStudent);
});

module.exports = {
  registeration,
  getRegistrationStudent,
  registerStudents,
};
