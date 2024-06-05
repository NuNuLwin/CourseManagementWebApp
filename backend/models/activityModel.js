const mongoose = require('mongoose')

const activitySchema = mongoose.Schema({
    activityName: {
        type: String,
        required: true
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('Activity',activitySchema)