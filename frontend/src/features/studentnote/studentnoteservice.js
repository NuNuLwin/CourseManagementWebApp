import axios from 'axios'

const API_URL = '/api/students/notes/'

const addNote = async (noteData)=>{
    const response = await axios.post(API_URL+'addnote',noteData)
    return response.data
}

const updateNote = async (noteid,subnoteid,notetext)=>{
    const response = await axios.put(`${API_URL}updatenote?noteid=${noteid}&subnoteid=${subnoteid}&notetext=${notetext}`)
    return response.data
}


const shareNote = async (noteData)=>{
    const response = await axios.post(API_URL+'sharenote',noteData)
    return response.data
}

const getNotes = async (user,course,file,activity)=>{
    const response = await axios.get(`${API_URL}getnotes?user=${user}&course=${course}&file=${file}&activity=${activity}`);
    return response.data
}

const getShareNotes = async (user,file)=>{
    const response = await axios.get(`${API_URL}getsharenotes?user=${user}&file=${file}`);
    return response.data
}

const getStudentListByCourse = async (courseid)=>{
    const response = await axios.get(API_URL+'getStudentListByCourse/'+courseid)
    return response.data
}

const getNotesByCourse = async (courseid)=>{
    const response = await axios.get(API_URL+'getNotesByCourse/'+courseid);
    return response.data
}

const getSharedNotesByCourse = async (course,user)=>{
    const response = await axios.get(`${API_URL}getAllSharedNotesByCourse?course=${course}&user=${user}`);
    return response.data
}

const studentNoteService = {
    addNote,
    getNotes,
    shareNote,
    getShareNotes,
    getStudentListByCourse,
    updateNote,
    getNotesByCourse,
    getSharedNotesByCourse
}

export default studentNoteService