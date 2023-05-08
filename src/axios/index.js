import axios from "axios";

export const askQuestion = (payload) => axios.post("/api/chat", payload);

export const trainDocs = (payload) => axios.post("/api/train-doc", payload);

export const trainBulk = (payload) => axios.post("/api/ingest", payload);

export const checkFileExist = (payload) =>
  axios.post("/api/check_file_exists", payload);

export const getAvailableAgents = (payload) =>
  axios.post("/api/get-agents", payload);

export const readExcel = (payload) => axios.post("/api/read-excel", payload);
