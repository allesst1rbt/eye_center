import { Lens, Terms } from "@/types";
import api from "@/utils/api";
import FormData from "form-data";

export const getLensService = async (): Promise<Lens[]> => {
  const response = await api.get<Lens[]>("/lens");

  return response.data;
};

export const getExpireDates = async (): Promise<Terms[]> => {
  const response = await api.get<Terms[]>("/terms");

  return response.data;
};

export const updateLensService = async (formData: FormData): Promise<void> => {
  return await api.post("/lens/bulkCreate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
