const express  = require('express')
const router = express.Router()
const {addNote,getNotes,getAllNotes,shareNote,getSharedNotes,getStudentListByCourse,updateNote,getNotesByCourse,getAllSharedNotesByCourse} = require('../controllers/StudentNoteController')

router.post('/notes/addnote',addNote)
router.get('/notes/getnotes/',getNotes)
router.get('/notes/getallnotes/',getAllNotes)
router.post('/notes/sharenote/',shareNote)
router.get('/notes/getsharenotes/',getSharedNotes)
router.get('/notes/getStudentListByCourse/:id',getStudentListByCourse)
router.put('/notes/updatenote/',updateNote)
router.get('/notes/getNotesByCourse/:id',getNotesByCourse)
router.get('/notes/getAllSharedNotesByCourse/',getAllSharedNotesByCourse)


module.exports = router