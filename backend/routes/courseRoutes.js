const express = require('express')
const { setCourse, getCourses } = require('../controllers/courseController')
const router = express.Router()


router.route('/').get(getCourses).post(setCourse)

module.exports = router