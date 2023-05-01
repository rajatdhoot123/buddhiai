import axios from "axios";

export const startApi = () => {
  return axios.get("https://buddhi.kwiktwik.com");
};
