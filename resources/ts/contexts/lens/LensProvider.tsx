import { getLensService, updateLensService } from "@/services/lensService";
import { Lens } from "@/types";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { LensContext } from "./LensContext";

export const LensProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lens, setLens] = useState<Lens[]>([]);
  const [loadingGetLens, setLoadingGetLens] = useState<boolean>(false);
  const [loadingUpdateLens, setLoadingUpdateLens] = useState<boolean>(false);

  const getLens = useCallback(async () => {
    try {
      setLoadingGetLens(true);
      const response = await getLensService();

      setLens(response);
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

      getLens();
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
      value={{ lens, getLens, updateLens, loadingGetLens, loadingUpdateLens }}
    >
      {children}
    </LensContext.Provider>
  );
};
