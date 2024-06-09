import axios from "axios";

const API_URL = "/api/course/";

// Create new course
const createCourse = async (courseData) => {
  const response = await axios.post(API_URL, courseData);
  return response.data;
};

// Get courses by instructor id
const getCoursesByInstructorId = async (instructorId, courseStatus) => {
  const response = await axios.get(
    `${API_URL}?instructorId=${instructorId}&courseStatus=${courseStatus}`
  );
  return response.data;
};

// Get course by course id
const getCourseByCourseId = async (courseId) => {
  const response = await axios.get(`${API_URL}${courseId}`);
  return response.data;
};

// Get course detail by course id and
const getCourseDetail = async (courseId, categoryId) => {
  const response = await axios.get(`${API_URL}${courseId}/${categoryId}`);
  return response.data;
};

const courseService = {
  createCourse,
  getCoursesByInstructorId,
  getCourseByCourseId,
  getCourseDetail,
};

export default courseService;
