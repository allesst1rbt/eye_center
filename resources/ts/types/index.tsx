export interface Order {
  id?: number;
  customer_name: string;
  customer_email?: string;
  customer_number: string;
  lens_id: number | null;
  customer_birthdate: string;
  terms_id: number | null;
  created_at?: string;
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
  loadingGetOrders: boolean;
  loadingCreateOrder: boolean;
  loadingUpdateOrder: boolean;
  loadingDeleteOrder: boolean;
  getOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (id: number, order: Omit<Order, "id">) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
};
