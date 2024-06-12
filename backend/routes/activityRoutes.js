const express = require('express')
const { getActivity, setActivity } = require('../controllers/activityController')
const router = express.Router()


router.route('/').get(getActivity).post(setActivity)

module.exports = router