import axios from "axios";
const apiRequest = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  timout: 5000,
});
export default apiRequest;
