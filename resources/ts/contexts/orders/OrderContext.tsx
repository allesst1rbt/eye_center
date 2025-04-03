import { Order } from "@/types";
import { createContext, useContext } from "react";

export interface OrderContextType {
  loadingGetOrders: boolean;
  loadingCreateOrder: boolean;
  loadingUpdateOrder: boolean;
  loadingDeleteOrder: boolean;
  orders: Order[];
  getOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (id: number, order: Omit<Order, "id">) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
}

export const OrderContext = createContext<OrderContextType>(
  {} as OrderContextType
);

export const useOrderContext = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error(
      "useOrderContext deve ser usado dentro de um OrderProvider"
    );
  }
  return context;
};
