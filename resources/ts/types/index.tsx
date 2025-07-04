export interface Order {
  id?: number;
  customer_name: string;
  customer_email?: string;
  customer_number: string;
  customer_birthdate: string;
  order_confirmation: number;
  order_remember: number;
  lens_id: number | null;
  terms_id: number | null;
  created_at?: string;
  updated_at?: string;
  employee_name?: string;
}

export interface PaginatedOrderResponse {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Lens {
  id: number;
  name: string;
}

export interface Terms {
  id: number;
  expire_date: string;
}

export type OrderStore = {
  orders: Order[];
  pagination: Omit<PaginatedOrderResponse, 'data'> | null;
  loadingGetOrders: boolean;
  loadingCreateOrder: boolean;
  loadingUpdateOrder: boolean;
  loadingDeleteOrder: boolean;
  getOrders: (page: number, quant: number) => Promise<void>;
  createOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (id: number, order: Omit<Order, "id">) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
};
