import {
  createOrderService,
  deleteOrderService,
  getOrdersService,
  updateOrderService,
} from "../../services/orderService";
import api from "../../utils/api";

jest.mock("../../utils/api");
const mockedApi = api as jest.Mocked<typeof api>;

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

describe("orderService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getOrdersService", () => {
    test("fetches paginated orders", async () => {
      const mockPaginated = {
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
      mockedApi.get.mockResolvedValue({ data: mockPaginated });

      const result = await getOrdersService({ page: 1, quant: 15 });

      expect(mockedApi.get).toHaveBeenCalledWith("/order?page=1&perPage=15");
      expect(result).toEqual(mockPaginated);
    });

    test("throws on network error", async () => {
      mockedApi.get.mockRejectedValue(new Error("Network error"));

      await expect(getOrdersService({ page: 1, quant: 15 })).rejects.toThrow("Network error");
    });
  });

  describe("createOrderService", () => {
    test("calls POST /order with order data", async () => {
      mockedApi.post.mockResolvedValue({ data: {} });

      await createOrderService(mockOrder);

      expect(mockedApi.post).toHaveBeenCalledWith("/order", mockOrder);
    });

    test("throws on server error", async () => {
      mockedApi.post.mockRejectedValue(new Error("Server error"));

      await expect(createOrderService(mockOrder)).rejects.toThrow("Server error");
    });
  });

  describe("updateOrderService", () => {
    test("calls PATCH /order/:id with order data", async () => {
      mockedApi.patch.mockResolvedValue({ data: {} });

      await updateOrderService(1, mockOrder);

      expect(mockedApi.patch).toHaveBeenCalledWith("/order/1", mockOrder);
    });

    test("throws on server error", async () => {
      mockedApi.patch.mockRejectedValue(new Error("Update failed"));

      await expect(updateOrderService(1, mockOrder)).rejects.toThrow("Update failed");
    });
  });

  describe("deleteOrderService", () => {
    test("calls DELETE /order/:id", async () => {
      mockedApi.delete.mockResolvedValue({ data: {} });

      await deleteOrderService(1);

      expect(mockedApi.delete).toHaveBeenCalledWith("/order/1");
    });

    test("throws on server error", async () => {
      mockedApi.delete.mockRejectedValue(new Error("Delete failed"));

      await expect(deleteOrderService(1)).rejects.toThrow("Delete failed");
    });
  });
});
