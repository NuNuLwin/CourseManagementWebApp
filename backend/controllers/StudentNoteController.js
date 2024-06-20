const asyncHandler = require("express-async-handler");
const studentNote = require("../models/StudentNoteModel");
const User = require("../models/userModel");
const course = require("../models/courseModel");
const studentRegistration = require("../models/studentRegistrationModel");

const addNote = asyncHandler(async (req, res) => {
    const { user, course, file, activity, notes } = req.body;
    console.log("Add Notes Controller user ="+ user +" file ="+file+" activity ="+activity);
    if (!user || !course || !file || !activity || !notes) {
      res.status(400);
      throw new Error("Please add all fields");
    }
  
    const studentnote = await studentNote.where("user").equals(user).where("course").equals(course).where("file").equals(file).where("activity").equals(activity);
   
    if(studentnote.length !== 0){
      console.log('there is a student note')
      console.log('student notes '+studentnote )
      let notelist = studentnote[0].notes || []
      let note = {
          text: notes,
          date: new Date()
      }
      notelist.push(note)

      const updateNote = await studentNote.updateOne({ _id: studentnote[0]._id },{ notes: notelist });

       //return note as response
       if(updateNote){
        const notelist = await studentNote.where("user").equals(user).where("course").equals(course).where("file").equals(file).where("activity").equals(activity);
        res.status(200).json(notelist);
       }
    }else{
      console.log('there is no student note')
      const createnote = await studentNote.create({
        user: user,
        course:course,
        file: file,
        activity: activity,
        notes: [
          {
            text: notes,
            date: new Date()
          }
        ],
      });

      //return note as response
      if(createnote){
        const notelist = await studentNote.where("user").equals(user).where("course").equals(course).where("file").equals(file).where("activity").equals(activity);
        res.status(200).json(notelist);
      }
    }
  
  });

  const updateNote = asyncHandler(async (req, res) => {
    const noteid = req.query.noteid;
    const subnoteid = req.query.subnoteid
    const notetext = req.query.notetext;

   // const { noteid, subnoteid, notetext } = req.body;
    if (!noteid || !subnoteid || !notetext) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    //const studentnote = await studentNote.findById(noteid)
    let result = []
    const studentnote = await studentNote.findOneAndUpdate(
      {_id:noteid, 'notes._id': subnoteid },
      {
        $set: {
          'notes.$.text': notetext, 
        }
      },
      {
        new: true,
    }
    )
    console.log("update note result "+studentnote)
    // const notes = studentnote.notes
    // for (let i =0;i<notes.length;i++){
    //   if(notes[i]._id === subnoteid){

    //   }
    // }

    if(studentnote){
      result.push(studentnote)
      res.status(200).json(result);
    }else{
      res.status(400);
      throw new Error("Update note fail");
    }
  });

  const shareNote = asyncHandler(async (req, res) => {
    const { note, user } = req.body;
    if (!note || !user) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const studentnote = await studentNote.findById(note);
    console.log('members '+studentnote.members)
    let memberlist = studentnote.members || []
    memberlist.push(user)
    const addShareMember = await studentNote.updateOne({ _id: note },{ members: memberlist });

     //return note as response
     if(addShareMember){
      const response = await studentNote.findById(note);
      res.status(200).json(response);
     }

  });

  const getNotes = asyncHandler(async (req, res) => {
    const user = req.query.user;
    const course = req.query.course
    const file = req.query.file;
    const activity = req.query.activity;
    if (!user || !course || !file || !activity) {
      res.status(400);
      throw new Error("Please add all fields");
    }
  
    const notelist = await studentNote.where("user").equals(user).where("course").equals(course).where("file").equals(file).where("activity").equals(activity);
    res.status(200).json(notelist);
  });
  
  const getAllNotes = asyncHandler(async (req, res) => {
    const notelist = await studentNote.find({});
    res.status(200).json(notelist);
  });

  const getSharedNotes = asyncHandler(async (req, res) => {
    const user = req.query.user;
    const file = req.query.file;

    console.log('getSharedNotes user '+user+" file "+file)
    if (!user || !file ) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    let shareNotes = []
    const allNotes = await studentNote.find({});
    console.log('getSharedNotes allNotes '+allNotes)
    if(allNotes.length === 0){
      res.status(200).json(shareNotes);
    }
  
    let isfindNotes = false;
    for(let i = 0;i<allNotes.length;i++){
      console.log('getSharedNotes allNotes[i].file '+allNotes[i].file+' file '+ file)
      if(allNotes[i].file.equals(file)){
        console.log("file is same")
        let members = allNotes[i].members;
        if(members.length !== 0){
          for(let j=0;j<members.length;j++){
            console.log('members[j] '+members[j])
            if(user == members[j]._id){
              console.log("find notes")
              isfindNotes = true;
              break;
            }
          }
        }
        //insert share notes
        if(isfindNotes){
          console.log("insert share notes")
          const usermodel = await User.findById(allNotes[i].user)
          let name = usermodel.firstname+" "+usermodel.lastname;
          console.log("get share notes user "+name)
          let findNotes = allNotes[i].notes
          for(let k=0;k<findNotes.length;k++){
            console.log("loop share notes")
            shareNotes.push({
              //findNotes[k]
              shareby: name,
              text: findNotes[k].text,
              date: findNotes[k].date,
              _id: findNotes[k]._id
            })
          }
           isfindNotes = false;
        }
      }else{
        console.log("there is no share file")
      }

    }
    res.status(200).json(shareNotes);
  });

  const getStudentListByCourse = asyncHandler(async (req, res) => {
    const resultStudent = [];
    const courseid = req.params.id;
    const Course = await course.findById(courseid); //   66612c67e68eaae1d01648ab   66612267e68eaae1d01648a7   66613072e68eaae1d01648b7
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
      .where("registrationstatus")
      .equals("registered")
      .populate("class")
      .populate("user");
  
    console.log("after student list is 0");
  
    for (let i = 0; i < studentlist.length; i++) {
      const id = studentlist[i].user._id;
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
      });
    }
  
    res.status(200).json(resultStudent);
  });

  const getNotesByCourse = asyncHandler(async (req, res) => {
   // let resultNotes = [];
    const courseid = req.params.id;
    const resultNotes = await studentNote.where("course").equals(courseid)
    console.log("getNotesByCourse notes "+resultNotes)
      res.status(200).json(resultNotes);
  });

  const getAllSharedNotesByCourse = asyncHandler(async (req, res) => {
    const result = []

     const courseid = req.query.course;
     const user = req.query.user;
     const notes = await studentNote.where("course").equals(courseid)
     //console.log("getAllSharedNotesByCourse notes "+notes)

     const allfiles = await course.findById(courseid)//.select("files");
     console.log("getAllSharedNotesByCourse files "+allfiles)

     const files = allfiles.files
  
    
    for (let i=0;i<files.length;i++){// file for course
      console.log("files ByCourse "+files[i].file)
      let membernotes = []
      let isMember = false
     
       for(let j=0;j<notes.length;j++){ // note
        console.log("notes[j].file "+notes[j].file)
        if(files[i].file.equals(notes[j].file) ){
          console.log("files[i] and notes[j] equal "+files[i].file+" "+notes[j].file)
          // loop in notes
          if(notes[j].members.length > 0){
              for(let k=0;k<notes[j].members.length;k++){
                if(notes[j].members[k]._id==user){
                  isMember = true
                  console.log("loop break")
                  break;
                }
              }
          }
          console.log("loop break get here")
          if(isMember){
            for(let e=0;e<notes[j].notes.length;e++){
               membernotes.push(notes[j].notes[e])//membernotes.push(notes[j].notes)
            }
            isMember = false
          }
        }
       }
       if(membernotes.length>0){
          result.push(
            {
              user:user,
              file:files[i].file,
              notes:membernotes
            }
          )
       }
    }

    res.status(200).json(result);
   });

  module.exports = {
    addNote,
    getNotes,
    getAllNotes,
    shareNote,
    getSharedNotes,
    getStudentListByCourse,
    updateNote,
    getNotesByCourse,
    getAllSharedNotesByCourse,
  }