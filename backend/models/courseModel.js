
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
 
    courseName: {
        type: String,
        required: [true, 'Please add a course name.']
    },
    /*user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },*/
    userId: {
        type: String,
        required: true
    },
    classId: {
        type: [String],
        required: true
    },
    activityId: {
        type: [String],
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date.']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date.']
    },
    startTime: {
        type: String,
        required: [true, 'Please add a start time.']
    },
    endTime: {
        type: String,
        required: [true, 'Please add a end time.']
    },
    days: {
        type: [String],
        required: [true, 'Please add day/s.']
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);