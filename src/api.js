import axios from 'axios';

const API_BASE_URL = 'http://localhost:5132/api';

export const fetchProducts = () => axios.get(`${API_BASE_URL}/products`);

export const addToCart = (cartItem) => axios.post(`${API_BASE_URL}/cart`, cartItem);

export const updateProductQuantity = (id, updatedQuantity) => axios.put(`${API_BASE_URL}/products/${id}`, updatedQuantity);

export const getCartItems = () => axios.get(`${API_BASE_URL}/cart`);

export const updateCartItemQuantity = (cartItemId, newQuantity) =>
    axios.put(`${API_BASE_URL}/cart/update-quantity/${cartItemId}?newquantity=${newQuantity}`);

export const deleteCartItem = (cartItemId) => axios.delete(`${API_BASE_URL}/cart/${cartItemId}`);

export const placeOrder = (order) => axios.post(`${API_BASE_URL}/orders`, order);
