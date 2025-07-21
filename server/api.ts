// services/api.ts
import axios from 'axios';
export const fetchProducts = () =>
  axios.get('http://localhost:5000/api/products').then((res) => res.data);
