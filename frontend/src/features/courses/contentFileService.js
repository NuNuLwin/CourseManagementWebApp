import axios from "axios";

const API_URL = "/api/content/files/";

const viewContentFile = async (fileId) => {
  const response = await axios.get(`${API_URL}${fileId}`, {
    responseType: "blob",
  });
  return response.data;
};

const uploadContentFile = async (formData, config) => {
  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

const contentFileService = {
  viewContentFile,
  uploadContentFile,
};

export default contentFileService;
