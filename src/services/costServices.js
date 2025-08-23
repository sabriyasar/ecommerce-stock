import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/costs";

export const getCosts = async () => {
  return await axios.get(API_URL);
};

export const addCost = async (costData) => {
  return await axios.post(API_URL, costData);
};
