const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true,'Please add first name']
    },
    lastname: {
        type: String,
        required: [true,'Please add last name']
    },
    email: {
        type: String,
        required: [true,'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'Please add a password']
    },
    role: {
        type: String,
        required: [true,'Please add a role']
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('User',userSchema)