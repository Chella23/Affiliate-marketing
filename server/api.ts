// services/api.ts
import axios from 'axios';

// Fetch all products from products.json and scrape their data
export const fetchProducts = () =>
  axios.get('http://localhost:5000/api/products/fetch').then((res) => res.data);
