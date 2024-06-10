import axios from "axios";

const API_URL = "/api/content/files/";

const viewContentFile = async (fileId) => {
  const response = await axios.get(`${API_URL}${fileId}`, {
    responseType: "arraybuffer",
  });
  return response.data;
};

const contentFileService = {
  viewContentFile,
};

export default contentFileService;
