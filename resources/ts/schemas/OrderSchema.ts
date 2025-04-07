import { isValidDate } from "@/utils/dateValidator";
import { z } from "zod";

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

export const orderSchema = z.object({
  id: z.coerce.number().optional(),
  customer_name: z.string().min(1, "Nome é obrigatório."),
  customer_email: z.string().email().optional().or(z.literal("")),
  customer_number: z
    .string()
    .min(1, "Número de telefone é obrigatório.")
    .regex(
      phoneRegex,
      "O número de telefone deve estar no formato (xx) xxxxx-xxxx."
    ),
  customer_birthdate: z
    .string()
    .min(1, "Data de nascimento é obrigatória.")
    .refine(isValidDate, { message: "Data de nascimento inválida." }),
  lens_id: z.number({ invalid_type_error: "Selecione uma lente." }),
  terms_id: z.number({ invalid_type_error: "Você deve aceitar os termos." }),
  customer_signature: z.string().min(1, "Assinatura é obrigatória."),
});
