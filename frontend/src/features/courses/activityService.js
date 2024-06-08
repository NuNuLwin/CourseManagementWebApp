import axios from "axios";

const API_URL = "/api/activity";

const getActivity = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const activityService = {
  getActivity,
};

export default activityService;
