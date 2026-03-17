import { authLogin } from "../../services/authService";
import api from "../../utils/api";

jest.mock("../../utils/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("authService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("authLogin", () => {
    test("returns token and user on success", async () => {
      const mockData = {
        token: "fake-token",
        user: { id: 1, name: "Test User", email: "test@test.com" },
      };
      mockedApi.post.mockResolvedValue({ data: mockData });

      const result = await authLogin({ email: "test@test.com", password: "123456" });

      expect(mockedApi.post).toHaveBeenCalledWith("/login", {
        email: "test@test.com",
        password: "123456",
      });
      expect(result).toEqual(mockData);
    });

    test("throws error on failed login", async () => {
      mockedApi.post.mockRejectedValue(new Error("Unauthorized"));

      await expect(
        authLogin({ email: "wrong@test.com", password: "wrong" })
      ).rejects.toThrow("Unauthorized");
    });
  });
});
