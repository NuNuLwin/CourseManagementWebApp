// src/features/classes/classService.js
import axios from 'axios';

const API_URL = '/api/class';

const getClasses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
}

const classService = {
  getClasses,
}

export default classService;
