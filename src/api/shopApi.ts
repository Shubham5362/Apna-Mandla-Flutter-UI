import axiosInstance from './axiosInstance';

export const shopApi = {
  getShops: async (params?: any) => {
    const response = await axiosInstance.get('/shops', { params });
    return response.data;
  },
  getShopBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/shops/slug/${slug}`);
    return response.data;
  },
  createShop: async (shopData: any) => {
    const response = await axiosInstance.post('/shops', shopData);
    return response.data;
  },
  updateShop: async (id: string, shopData: any) => {
    const response = await axiosInstance.put(`/shops/${id}`, shopData);
    return response.data;
  }
};
