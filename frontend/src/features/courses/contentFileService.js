import axios from "axios";

const API_URL = "/api/content/files/";

const getCourseContent = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const contentFileService = {
  getCourseContent,
};

export default contentFileService;
