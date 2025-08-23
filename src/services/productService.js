import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/products";

export const getProducts = async () => {
  return await axios.get(API_URL);
};

export const addProduct = async (productData) => {
  return await axios.post(API_URL, productData);
};
