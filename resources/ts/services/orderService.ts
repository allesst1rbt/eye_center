import { Order, PaginatedOrderResponse } from "@/types";
import api from "@/utils/api";

interface getOrdersParams {
  page: number;
  quant: number;
}

export const getOrdersService = async ({
  page,
  quant,
}: getOrdersParams): Promise<PaginatedOrderResponse> => {
  const response = await api.get<PaginatedOrderResponse>(
    `/order?page=${page}&perPage=${quant}`
  );

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
