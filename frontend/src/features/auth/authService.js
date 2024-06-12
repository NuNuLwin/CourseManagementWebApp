// make http request and send data back
// set any data in local storage

import axios from "axios";

const API_URL = "/api/users/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  //   try {
  //     response = await axios.post(API_URL + "register", userData);
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }

  //console.log("Response:", response);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

//logout
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
};
export default authService;
