const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',

    }, 
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',

    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ContentFile",
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Activity",
    },
    notes: [
      {
        text: {
            type: String
        },
        date: {
            type: String
        },

     }
    ],
    members: [
        {
          user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
          },
       }
    ]
},
{
    timestamps: true
})

module.exports = mongoose.model('StudentNote',userSchema)