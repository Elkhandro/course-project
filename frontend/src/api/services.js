import client from "./client";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Auth
export const login = (username, password) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  return axios.post(`${BASE_URL}/auth/login`, form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const register = (data) => client.post("/auth/register", data);

// Books
export const getBooks = (params = {}) => client.get("/books", { params });
export const getBook = (id) => client.get(`/books/${id}`);
export const createBook = (data) => client.post("/books", data);
export const updateBook = (id, data) => client.patch(`/books/${id}`, data);
export const deleteBook = (id) => client.delete(`/books/${id}`);
export const getMaxPriceDiffBook = () =>
  client.get("/books/analytics/max-price-diff");

// Authors
export const getAuthors = () => client.get("/authors");
export const getAuthor = (id) => client.get(`/authors/${id}`);
export const createAuthor = (data) => client.post("/authors", data);
export const updateAuthor = (id, data) => client.patch(`/authors/${id}`, data);
export const deleteAuthor = (id) => client.delete(`/authors/${id}`);

// Genres
export const getGenres = () => client.get("/genres");
export const createGenre = (data) => client.post("/genres", data);
export const updateGenre = (id, data) => client.patch(`/genres/${id}`, data);
export const deleteGenre = (id) => client.delete(`/genres/${id}`);

// Catalog
export const getCatalog = () => client.get("/catalog");
export const addToCatalog = (bookId, cipher) =>
  client.post(`/catalog/${bookId}?cipher=${encodeURIComponent(cipher)}`);

// Sales
export const getSales = () => client.get("/sales");
export const createSale = (data) => client.post("/sales", data);
export const getTotalRevenue = () => client.get("/sales/analytics/revenue");
export const getBestAuthor = () => client.get("/sales/analytics/best-author");

// Orders
export const getOrders = () => client.get("/orders");
export const getOrder = (id) => client.get(`/orders/${id}`);
export const createOrder = (data) => client.post("/orders", data);
export const updateOrderStatus = (id, status) =>
  client.patch(`/orders/${id}/status`, { status });
export const uploadCover = (bookId, formData) =>
  client.post(`/books/${bookId}/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
