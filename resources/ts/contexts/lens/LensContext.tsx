import { Lens } from "@/types";
import { createContext, useContext } from "react";

export interface LensContextType {
  lens: Lens[];
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
