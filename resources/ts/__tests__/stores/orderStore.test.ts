import {
  createOrderService,
  deleteOrderService,
  getOrdersService,
  updateOrderService,
} from "../../services/orderService";
import { useOrderStore } from "../../stores/orderStore";

jest.mock("../../services/orderService");
const mockedGetOrders = getOrdersService as jest.MockedFunction<typeof getOrdersService>;
const mockedCreateOrder = createOrderService as jest.MockedFunction<typeof createOrderService>;
const mockedUpdateOrder = updateOrderService as jest.MockedFunction<typeof updateOrderService>;
const mockedDeleteOrder = deleteOrderService as jest.MockedFunction<typeof deleteOrderService>;

const mockOrder = {
  customer_name: "João Silva",
  customer_email: "joao@test.com",
  customer_number: "5511999999999",
  customer_birthdate: "15/06/1990",
  order_confirmation: 0 as number,
  order_remember: 0 as number,
  lens_id: 1,
  terms_id: 1,
};

const mockPaginatedResponse = {
  data: [{ id: 1, ...mockOrder }],
  current_page: 1,
  total: 1,
  per_page: 15,
  last_page: 1,
  first_page_url: "",
  last_page_url: "",
  from: 1,
  to: 1,
  path: "",
  links: [],
  next_page_url: null,
  prev_page_url: null,
};

describe("orderStore", () => {
  beforeEach(() => {
    useOrderStore.setState({
      orders: [],
      pagination: null,
      loadingGetOrders: false,
      loadingCreateOrder: false,
      loadingUpdateOrder: false,
      loadingDeleteOrder: false,
    });
    jest.clearAllMocks();
  });

  describe("getOrders", () => {
    test("sets orders and pagination on success", async () => {
      mockedGetOrders.mockResolvedValue(mockPaginatedResponse);

      await useOrderStore.getState().getOrders(1, 15);

      expect(useOrderStore.getState().orders).toEqual([{ id: 1, ...mockOrder }]);
      expect(useOrderStore.getState().pagination?.total).toBe(1);
    });

    test("resets loading to false on success", async () => {
      mockedGetOrders.mockResolvedValue(mockPaginatedResponse);

      await useOrderStore.getState().getOrders(1, 15);

      expect(useOrderStore.getState().loadingGetOrders).toBe(false);
    });

    test("resets loading to false on error", async () => {
      mockedGetOrders.mockRejectedValue(new Error("Network error"));

      await useOrderStore.getState().getOrders(1, 15);

      expect(useOrderStore.getState().loadingGetOrders).toBe(false);
    });
  });

  describe("createOrder", () => {
    test("calls service with order data", async () => {
      mockedCreateOrder.mockResolvedValue(undefined);

      await useOrderStore.getState().createOrder(mockOrder);

      expect(mockedCreateOrder).toHaveBeenCalledWith(mockOrder);
      expect(useOrderStore.getState().loadingCreateOrder).toBe(false);
    });

    test("throws and resets loading on error", async () => {
      mockedCreateOrder.mockRejectedValue(new Error("Server error"));

      await expect(useOrderStore.getState().createOrder(mockOrder)).rejects.toThrow("Server error");
      expect(useOrderStore.getState().loadingCreateOrder).toBe(false);
    });
  });

  describe("updateOrder", () => {
    test("calls service with id and order data", async () => {
      mockedUpdateOrder.mockResolvedValue(undefined);

      await useOrderStore.getState().updateOrder(1, mockOrder);

      expect(mockedUpdateOrder).toHaveBeenCalledWith(1, mockOrder);
      expect(useOrderStore.getState().loadingUpdateOrder).toBe(false);
    });

    test("throws and resets loading on error", async () => {
      mockedUpdateOrder.mockRejectedValue(new Error("Update failed"));

      await expect(useOrderStore.getState().updateOrder(1, mockOrder)).rejects.toThrow("Update failed");
      expect(useOrderStore.getState().loadingUpdateOrder).toBe(false);
    });
  });

  describe("deleteOrder", () => {
    test("calls service with id", async () => {
      mockedDeleteOrder.mockResolvedValue(undefined);

      await useOrderStore.getState().deleteOrder(1);

      expect(mockedDeleteOrder).toHaveBeenCalledWith(1);
      expect(useOrderStore.getState().loadingDeleteOrder).toBe(false);
    });

    test("throws and resets loading on error", async () => {
      mockedDeleteOrder.mockRejectedValue(new Error("Delete failed"));

      await expect(useOrderStore.getState().deleteOrder(1)).rejects.toThrow("Delete failed");
      expect(useOrderStore.getState().loadingDeleteOrder).toBe(false);
    });
  });
});
