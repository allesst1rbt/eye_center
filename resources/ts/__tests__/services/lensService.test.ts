import {
  getExpireDates,
  getLensService,
  updateLensService,
} from "../../services/lensService";
import api from "../../utils/api";

jest.mock("../../utils/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("lensService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getLensService", () => {
    test("returns lens array", async () => {
      const mockLenses = [{ id: 1, name: "Lens A" }, { id: 2, name: "Lens B" }];
      mockedApi.get.mockResolvedValue({ data: mockLenses });

      const result = await getLensService();

      expect(mockedApi.get).toHaveBeenCalledWith("/lens");
      expect(result).toEqual(mockLenses);
    });

    test("throws on error", async () => {
      mockedApi.get.mockRejectedValue(new Error("Fetch failed"));

      await expect(getLensService()).rejects.toThrow("Fetch failed");
    });
  });

  describe("getExpireDates", () => {
    test("returns terms array", async () => {
      const mockTerms = [{ id: 1, expire_date: "30 dias" }];
      mockedApi.get.mockResolvedValue({ data: mockTerms });

      const result = await getExpireDates();

      expect(mockedApi.get).toHaveBeenCalledWith("/terms");
      expect(result).toEqual(mockTerms);
    });

    test("throws on error", async () => {
      mockedApi.get.mockRejectedValue(new Error("Fetch failed"));

      await expect(getExpireDates()).rejects.toThrow("Fetch failed");
    });
  });

  describe("updateLensService", () => {
    test("calls POST /lens/bulkCreate with multipart header", async () => {
      mockedApi.post.mockResolvedValue({ data: {} });
      const formData = new FormData();

      await updateLensService(formData as any);

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/lens/bulkCreate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    });

    test("throws on server error", async () => {
      mockedApi.post.mockRejectedValue(new Error("Upload failed"));

      await expect(updateLensService(new FormData() as any)).rejects.toThrow("Upload failed");
    });
  });
});
