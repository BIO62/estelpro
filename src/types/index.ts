export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  description?: string;
  variants?: string[];
  category?: string;
  brand?: string;
  inStock?: boolean;
}

export type { CartItem, CartSelection } from '@/lib/cart';

export interface Branch {
  name: string;
  address: string;
  hours: string;
  image: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
  total: number;
  address?: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}
