import {
  createOrderService,
  deleteOrderService,
  getOrdersService,
  updateOrderService,
} from "@/services/orderService";
import { Order } from "@/types";
import { ReactNode, useCallback, useState } from "react";
import { OrderContext } from "./OrderContext";

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loadingGetOrders, setLoadingGetOrders] = useState<boolean>(false);
  const [loadingCreateOrder, setLoadingCreateOrder] = useState<boolean>(false);
  const [loadingUpdateOrder, setLoadingUpdateOrder] = useState<boolean>(false);
  const [loadingDeleteOrder, setLoadingDeleteOrder] = useState<boolean>(false);

  const getOrders = useCallback(async () => {
    try {
      setLoadingGetOrders(true);

      const orders_response = await getOrdersService();

      console.log("Orders Response: ", orders_response);

      setOrders(orders_response.toReversed());
    } catch (error) {
      console.error("Erro ao buscar pedidos: ", error);
    } finally {
      setLoadingGetOrders(false);
    }
  }, []);

  const createOrder = useCallback(async (order: Omit<Order, "id">) => {
    try {
      setLoadingCreateOrder(true);

      console.log("Entrei aqui");

      await createOrderService(order);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCreateOrder(false);
    }
  }, []);

  const updateOrder = useCallback(
    async (id: number, order: Omit<Order, "id">) => {
      try {
        setLoadingUpdateOrder(true);

        await updateOrderService(id, order);
      } catch (error) {
        console.error("Erro ao atualizar pedido: ", error);
      } finally {
        setLoadingUpdateOrder(false);
      }
    },
    []
  );

  const deleteOrder = useCallback(async (id: number) => {
    try {
      setLoadingDeleteOrder(true);

      await deleteOrderService(id);
    } catch (error) {
      console.error("Erro ao deletar pedido: ", error);
    } finally {
      setLoadingDeleteOrder(false);
    }
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loadingGetOrders,
        loadingCreateOrder,
        loadingUpdateOrder,
        loadingDeleteOrder,
        getOrders,
        createOrder,
        updateOrder,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
