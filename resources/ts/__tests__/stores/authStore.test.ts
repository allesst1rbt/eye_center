import { authLogin } from "../../services/authService";
import { useAuthStore } from "../../stores/authStore";

jest.mock("../../services/authService");
const mockedAuthLogin = authLogin as jest.MockedFunction<typeof authLogin>;

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    test("token is null when localStorage is empty", () => {
      expect(useAuthStore.getState().token).toBeNull();
    });

    test("user is null initially", () => {
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("login", () => {
    test("sets token and user on success", async () => {
      const mockResponse = {
        token: "fake-token",
        user: { id: 1, name: "Test", email: "test@test.com" },
      };
      mockedAuthLogin.mockResolvedValue(mockResponse);

      await useAuthStore.getState().login({ email: "test@test.com", password: "123456" });

      expect(useAuthStore.getState().token).toBe("fake-token");
      expect(useAuthStore.getState().user).toEqual(mockResponse.user);
    });

    test("saves token to localStorage on success", async () => {
      mockedAuthLogin.mockResolvedValue({
        token: "stored-token",
        user: { id: 1, name: "Test", email: "test@test.com" },
      });

      await useAuthStore.getState().login({ email: "test@test.com", password: "123456" });

      expect(localStorage.getItem("token")).toBe("stored-token");
    });

    test("throws and does not set token on failure", async () => {
      mockedAuthLogin.mockRejectedValue(new Error("Unauthorized"));

      await expect(
        useAuthStore.getState().login({ email: "bad@test.com", password: "bad" })
      ).rejects.toThrow("Unauthorized");

      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("logout", () => {
    test("clears token and user from state", () => {
      useAuthStore.setState({
        token: "fake-token",
        user: { id: 1, name: "Test", email: "test@test.com" },
      });

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
    });

    test("clears localStorage on logout", () => {
      localStorage.setItem("token", "fake-token");

      useAuthStore.getState().logout();

      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
