import {
  getExpireDates,
  getLensService,
  updateLensService,
} from "../../services/lensService";
import { useLensStore } from "../../stores/lensStore";

jest.mock("../../services/lensService");
const mockedGetLens = getLensService as jest.MockedFunction<typeof getLensService>;
const mockedGetExpireDates = getExpireDates as jest.MockedFunction<typeof getExpireDates>;
const mockedUpdateLens = updateLensService as jest.MockedFunction<typeof updateLensService>;

describe("lensStore", () => {
  beforeEach(() => {
    useLensStore.setState({
      lens: [],
      terms: [],
      loadingGetLens: false,
      loadingUpdateLens: false,
    });
    jest.clearAllMocks();
  });

  describe("getLens", () => {
    test("sets lens and terms on success", async () => {
      const mockLenses = [{ id: 1, name: "Lens A" }];
      const mockTerms = [{ id: 1, expire_date: "30 dias" }];
      mockedGetLens.mockResolvedValue(mockLenses);
      mockedGetExpireDates.mockResolvedValue(mockTerms);

      await useLensStore.getState().getLens();

      expect(useLensStore.getState().lens).toEqual(mockLenses);
      expect(useLensStore.getState().terms).toEqual(mockTerms);
    });

    test("resets loading to false on success", async () => {
      mockedGetLens.mockResolvedValue([]);
      mockedGetExpireDates.mockResolvedValue([]);

      await useLensStore.getState().getLens();

      expect(useLensStore.getState().loadingGetLens).toBe(false);
    });

    test("throws and resets loading on error", async () => {
      mockedGetLens.mockRejectedValue(new Error("Fetch failed"));

      await expect(useLensStore.getState().getLens()).rejects.toThrow("Fetch failed");
      expect(useLensStore.getState().loadingGetLens).toBe(false);
    });
  });

  describe("updateLens", () => {
    test("calls service with formData", async () => {
      mockedUpdateLens.mockResolvedValue(undefined);
      const formData = new FormData();

      await useLensStore.getState().updateLens(formData as any);

      expect(mockedUpdateLens).toHaveBeenCalledWith(formData);
      expect(useLensStore.getState().loadingUpdateLens).toBe(false);
    });

    test("throws and resets loading on error", async () => {
      mockedUpdateLens.mockRejectedValue(new Error("Upload failed"));

      await expect(useLensStore.getState().updateLens(new FormData() as any)).rejects.toThrow("Upload failed");
      expect(useLensStore.getState().loadingUpdateLens).toBe(false);
    });
  });
});
