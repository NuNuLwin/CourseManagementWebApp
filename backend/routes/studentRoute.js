const express  = require('express')
const router = express.Router()
const {registeration,getRegistrationStudent,registerStudents} = require('../controllers/studentRegistrationController')

router.post('/registration',registeration)
router.get('/getStudents/:id',getRegistrationStudent)
router.put('/registerStudents/:id',registerStudents)
module.exports = router