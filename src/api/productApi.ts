import axiosInstance from './axiosInstance';

export const productApi = {
  getProducts: async (params?: any) => {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  },
  getProduct: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (productData: any) => {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id: string, productData: any) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  }
};
