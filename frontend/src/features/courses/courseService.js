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

// Get courses by student id
const getCoursesByStudentId = async (studentId, courseStatus) => {
  const response = await axios.get(
    `${API_URL}?studentId=${studentId}&courseStatus=${courseStatus}`
  );
  return response.data;
};

// Get course by course id
const getCourseByCourseId = async (courseId) => {
  const response = await axios.get(`${API_URL}${courseId}`);
  return response.data;
};

// Update activities by course id
const updateCategoryByCourseId = async (courseId, selectedActivities) => {
  const response = await axios.put(`${API_URL}${courseId}/activities`, {
    activities: selectedActivities,
  });
  return response.data;
};

const courseService = {
  createCourse,
  getCoursesByInstructorId,
  getCoursesByStudentId,
  getCourseByCourseId,
  updateCategoryByCourseId,
};

export default courseService;
