import { Lens, Terms } from "@/types";
import FormData from "form-data";
import { createContext, useContext } from "react";

export interface LensContextType {
  lens: Lens[];
  terms: Terms[];
  getLens: () => void;
  updateLens: (formData: FormData) => Promise<void>;
  loadingGetLens: boolean;
  loadingUpdateLens: boolean;
}

export const LensContext = createContext<LensContextType>(
  {} as LensContextType
);

export const useLens = (): LensContextType => {
  const context = useContext(LensContext);
  if (!context) {
    throw new Error("useLens deve ser usado dentro de um LensProvider");
  }
  return context;
};
