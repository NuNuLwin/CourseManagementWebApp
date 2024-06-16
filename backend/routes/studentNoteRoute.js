const express  = require('express')
const router = express.Router()
const {addNote,getNotes,getAllNotes,shareNote,getSharedNotes,getStudentListByCourse} = require('../controllers/StudentNoteController')

router.post('/notes/addnote',addNote)
router.get('/notes/getnotes/',getNotes)
router.get('/notes/getallnotes/',getAllNotes)
router.post('/notes/sharenote/',shareNote)
router.get('/notes/getsharenotes/',getSharedNotes)
router.get('/notes/getStudentListByCourse/:id',getStudentListByCourse)
module.exports = router