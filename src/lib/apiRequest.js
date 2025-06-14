import axios from "axios";
const apiRequest = axios.create({
  baseURL: "https://timetable-backend-1-kh5q.onrender.com/api",
  withCredentials: true,
  timout: 5000,
});
export default apiRequest;
