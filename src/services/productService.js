// src/services/productServices.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/products";

export const getProducts = async () => {
  return await axios.get(API_URL);
};

export const addProduct = async (productData) => {
  return await axios.post(API_URL, productData);
};

// Yeni: Tek ürün getir
export const getProductById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// Yeni: Ürünü güncelle
export const updateProduct = async (id, updatedData) => {
  return await axios.put(`${API_URL}/${id}`, updatedData);
};
