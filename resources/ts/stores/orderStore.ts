import {
  createOrderService,
  deleteOrderService,
  getOrdersService,
  updateOrderService,
} from "@/services/orderService";
import { OrderStore } from "@/types";
import { create } from "zustand";

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loadingGetOrders: false,
  loadingCreateOrder: false,
  loadingUpdateOrder: false,
  loadingDeleteOrder: false,

  getOrders: async () => {
    try {
      set({ loadingGetOrders: true });
      const orders = await getOrdersService();
      set({ orders });
    } catch (error) {
      console.error("Erro ao buscar pedidos: ", error);
    } finally {
      set({ loadingGetOrders: false });
    }
  },

  createOrder: async (order) => {
    try {
      set({ loadingCreateOrder: true });
      await createOrderService(order);
    } catch (error) {
      console.error("Erro ao criar pedido: ", error);
    } finally {
      set({ loadingCreateOrder: false });
    }
  },

  updateOrder: async (id, order) => {
    try {
      set({ loadingUpdateOrder: true });
      await updateOrderService(id, order);
    } catch (error) {
      console.error("Erro ao atualizar pedido: ", error);
    } finally {
      set({ loadingUpdateOrder: false });
    }
  },

  deleteOrder: async (id) => {
    try {
      set({ loadingDeleteOrder: true });
      await deleteOrderService(id);
    } catch (error) {
      console.error("Erro ao deletar pedido: ", error);
    } finally {
      set({ loadingDeleteOrder: false });
    }
  },
}));
