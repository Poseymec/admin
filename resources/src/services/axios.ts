import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // laravel local
  withCredentials: true, // obligatoire pour Sanctum
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export default api;
