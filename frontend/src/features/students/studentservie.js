import axios from 'axios'

const API_URL = '/api/students/'

const getStudents = async (courseid)=>{
    const response = await axios.get(API_URL+'getStudents/'+courseid)
    return response.data
}


//update student registration status
const registerStudents = async (courseid)=>{
    const response = await axios.put(API_URL + 'registerStudents/'+courseid)
    return response.data
}

const studentService = {
    getStudents,
    registerStudents
}

export default studentService