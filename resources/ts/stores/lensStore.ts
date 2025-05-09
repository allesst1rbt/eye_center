import {
  getExpireDates,
  getLensService,
  updateLensService,
} from "@/services/lensService";
import { Lens, Terms } from "@/types";
import FormData from "form-data";
import { create } from "zustand";

type LensStore = {
  lens: Lens[];
  terms: Terms[];
  loadingGetLens: boolean;
  loadingUpdateLens: boolean;
  getLens: () => Promise<void>;
  updateLens: (formData: FormData) => Promise<void>;
};

export const useLensStore = create<LensStore>((set) => ({
  lens: [],
  terms: [],
  loadingGetLens: false,
  loadingUpdateLens: false,

  getLens: async () => {
    try {
      set({ loadingGetLens: true });
      const lens = await getLensService();
      const terms = await getExpireDates();
      set({ lens, terms });
    } catch (error) {
      console.error("Erro ao buscar lentes:", error);
    } finally {
      set({ loadingGetLens: false });
    }
  },

  updateLens: async (formData: FormData) => {
    try {
      set({ loadingUpdateLens: true });
      await updateLensService(formData);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar o arquivo.");
    } finally {
      set({ loadingUpdateLens: false });
    }
  },
}));
