import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/costs";

export const getCosts = async () => {
  return await axios.get(API_URL);
};

export const addCost = async (costData) => {
  return await axios.post(API_URL, costData);
};

// ✅ Tek bir maliyet bilgisini getir
export const getCostById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// ✅ Maliyeti güncelle
export const updateCost = async (id, costData) => {
  return await axios.put(`${API_URL}/${id}`, costData);
};
