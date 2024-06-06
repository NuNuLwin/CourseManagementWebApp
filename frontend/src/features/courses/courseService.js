import axios from 'axios'

const API_URL = '/api/course/'

// Create new course
const createCourse = async (courseData) => {
    /*const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }*/
  
    const response = await axios.post(API_URL, courseData)
  
    return response.data
  }

  const courseService = {
    createCourse
  }
  
  export default courseService