import axios from "axios";

export const askQuestion = (payload) => axios.post("/api/chat", payload);
