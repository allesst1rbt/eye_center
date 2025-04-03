import { Order } from "@/types";
import api from "@/utils/api";

export const getOrdersService = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/order");

  return response.data;
};

export const createOrderService = async (
  order: Omit<Order, "id">
): Promise<void> => {
  return await api.post("/order", order);
};

export const updateOrderService = async (
  id: number,
  order: Omit<Order, "id">
): Promise<void> => {
  return await api.patch(`/order/${id}`, order);
};

export const deleteOrderService = async (id: number): Promise<void> => {
  return await api.delete(`/order/${id}`);
};
