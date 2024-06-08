const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',

    }, 
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class',

    }, 
    registrationstatus: {
        type: String,
        required: [true,'Please add registration status']
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('StudentRegistration',userSchema)