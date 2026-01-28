import axios from "axios";

const API = axios.create({
  baseURL: "https://event-hub-backend-uzcs.onrender.com/api",
});

export default API;
