const express = require('express')
const { getClass, setClass } = require('../controllers/classController')
const router = express.Router()


router.route('/').get(getClass).post(setClass)

module.exports = router