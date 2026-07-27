export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description?: string;
  shopId?: string;
  shopName?: string;
}

export interface Offer {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
}

export interface UdharRequest {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  message: string;
  shopId: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface UdharAccount {
  id: string;
  shopId: string;
  shopName: string;
  customerId: string;
  customerName: string;
  limit: number;
  minOrder: number;
  interestRate: number; // percentage per month
  interestEnabled: boolean;
  paymentPeriod: number; // days
  balance: number;
  status: 'active' | 'suspended';
  createdAt: string;
  dueDate: string;
}

export interface UdharTransaction {
  id: string;
  accountId: string;
  type: 'purchase' | 'payment' | 'interest';
  amount: number;
  description?: string;
  date: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  image?: string; // For compatibility with older mock data
  rating: number;
  category: string;
  location: string;
  description: string;
  banners: string[];
  gallery: string[];
  offers: Offer[];
  products: Product[];
  phone?: string;
  address?: string;
  plusCode?: string;
  themeColor?: string;
  hasActiveSubscription: boolean;
}
