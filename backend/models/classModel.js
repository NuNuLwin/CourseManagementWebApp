const mongoose = require('mongoose')

const classSchema = mongoose.Schema({
    className: {
        type: String,
        required: true
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('Class',classSchema)