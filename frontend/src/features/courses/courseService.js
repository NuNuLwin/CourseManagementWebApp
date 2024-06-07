import axios from "axios";

const API_URL = "/api/course/";

// Create new course
const createCourse = async (courseData) => {
  const response = await axios.post(API_URL, courseData);
  return response.data;
};

const getCoursesByInstructorId = async (instructorId) => {
  const response = await axios.get(`${API_URL}?instructorId=${instructorId}`);
  return response.data;
};

const courseService = {
  createCourse,
  getCoursesByInstructorId,
};

export default courseService;
