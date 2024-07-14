import axios from 'axios';
import { proxy } from '../../config/default';
import { IProduct } from '../../types/types';

const API_URL = `${proxy}/api/product/`;

// Add To Product
const addProduct = async (productData: IProduct, token: string): Promise<IProduct> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post<IProduct>(API_URL, productData, config);

  return response.data;
};

const rentProduct = async (renterDetails:{id:string, days: number}, token: string): Promise<IProduct> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post<IProduct>(API_URL + 'rentProduct', renterDetails, config);

  return response.data;
};

// Fetch User Rented Products
const fetchUserRentedProducts = async (token: string): Promise<IProduct[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'fetchUserRentedProducts',{}, config);

  return response.data;
};

// Fetch Products
const fetchProducts = async (): Promise<IProduct[]> => {
  const response = await axios.post<IProduct[]>(API_URL + 'fetchProducts');


  return response.data;
};

// Fetch One Product
const fetchOneProduct = async (dataId: string): Promise<IProduct> => {
  const response = await axios.post<IProduct>(API_URL + 'fetchOneProduct', { dataId });


  return response.data;
};

const productService = {
  addProduct,
  rentProduct,
  fetchProducts,
  fetchUserRentedProducts,
  fetchOneProduct,
};

export default productService;
