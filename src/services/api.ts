import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: 'https://server-28aj.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product data interface that matches the backend response
export interface ApiProduct {
  _id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number;
  totalStock: number;
  averageReview: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Product service functions
export const productService = {
  /**
   * Fetches all products from the API
   * @returns Promise with product data
   */
  getProducts: async (): Promise<ApiProduct[]> => {
    try {
      const response = await API.get<ApiResponse<ApiProduct[]>>('/shop/products/get');
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Fetches a single product by ID
   * @param id Product ID
   * @returns Promise with product data
   */
  getProductById: async (id: string): Promise<ApiProduct | null> => {
    try {
      const response = await API.get<ApiResponse<ApiProduct>>(`/shop/products/${id}`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }
};

export default API; 