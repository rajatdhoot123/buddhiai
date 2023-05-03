import axios from "axios";

export const askQuestion = (payload) => axios.post("/api/chat", payload);

export const trainDocs = (payload) => axios.post("/api/train-doc", payload);

export const checkFileExist = (payload) =>
  axios.post("/api/check_file_exists", payload);
