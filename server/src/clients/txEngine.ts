import axios from "axios";
import config from "../config";

const api = axios.create({
  method: "post",
  baseURL: `${config.tx.url}/api/transaction`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  auth: config.tx.auth
});

export default api;
