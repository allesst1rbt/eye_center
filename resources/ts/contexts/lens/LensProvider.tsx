import {
  getExpireDates,
  getLensService,
  updateLensService,
} from "@/services/lensService";
import { Lens, Terms } from "@/types";
import FormData from "form-data";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { LensContext } from "./LensContext";

export const LensProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lens, setLens] = useState<Lens[]>([]);
  const [terms, setTerms] = useState<Terms[]>([]);
  const [loadingGetLens, setLoadingGetLens] = useState<boolean>(false);
  const [loadingUpdateLens, setLoadingUpdateLens] = useState<boolean>(false);

  const getLens = useCallback(async () => {
    try {
      setLoadingGetLens(true);
      const response = await getLensService();
      const terms = await getExpireDates();

      setLens(response);
      setTerms(terms);
    } catch (error) {
      console.error("Erro ao buscar lentes:", error);
    } finally {
      setLoadingGetLens(false);
    }
  }, []);

  const updateLens = useCallback(async (formData: FormData) => {
    try {
      setLoadingUpdateLens(true);

      await updateLensService(formData);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar o arquivo.");
    } finally {
      setLoadingUpdateLens(false);
    }
  }, []);

  useEffect(() => {
    getLens();
  }, [getLens]);

  return (
    <LensContext.Provider
      value={{
        lens,
        terms,
        getLens,
        updateLens,
        loadingGetLens,
        loadingUpdateLens,
      }}
    >
      {children}
    </LensContext.Provider>
  );
};
