const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// authenticate a user api/users/register
const registerUser = asyncHandler(async (req,res) => {
    const { firstname, lastname, email, password, role} = req.body
    if(!firstname || !lastname || !email || !password || !role){
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    // create user
    const user = await User.create({
           firstname,
           lastname,
           email,
           password: hashedPassword,
           role
    })

    if(user){ 
        res.status(201).json({
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }

})

// authenticate a user api/users/login
const loginUser = asyncHandler (async (req,res) => {
    const {email,password} = req.body

    //check email
    const user = await User.findOne({email})
    
    if(user && (await bcrypt.compare(password,user.password))){
        res.json({
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        })
    }else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
    //res.json({message: 'Login User'})
})


module.exports = {
    registerUser,
    loginUser
}