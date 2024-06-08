const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please add a course name."],
    },

    class: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Class",
      },
    ],
    startDate: {
      type: Date,
      required: [true, "Please add a start date."],
    },
    endDate: {
      type: Date,
      required: [true, "Please add an end date."],
    },
    startTime: {
      type: String,
      required: [true, "Please add a start time."],
    },
    endTime: {
      type: String,
      required: [true, "Please add a end time."],
    },
    days: {
      type: [String],
      required: [true, "Please add day/s."],
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    /*activity: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Activity',
    }],
    
   
    */
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
