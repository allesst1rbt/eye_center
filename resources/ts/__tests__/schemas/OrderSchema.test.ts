import { orderSchema } from "../../schemas/OrderSchema";

const validOrder = {
  customer_name: "João Silva",
  customer_number: "(11) 99999-9999",
  customer_birthdate: "15/06/1990",
  lens_id: 1,
  terms_id: 1,
};

describe("orderSchema", () => {
  test("validates correct order", () => {
    expect(orderSchema.safeParse(validOrder).success).toBe(true);
  });

  test("fails with empty customer_name", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_name: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Nome é obrigatório.");
  });

  test("fails with invalid phone format", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_number: "11999999999" });
    expect(result.success).toBe(false);
  });

  test("fails with empty phone", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_number: "" });
    expect(result.success).toBe(false);
  });

  test("fails with invalid birthdate", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_birthdate: "30/02/1990" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Data de nascimento inválida.");
  });

  test("fails with empty birthdate", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_birthdate: "" });
    expect(result.success).toBe(false);
  });

  test("allows optional email when empty string", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_email: "" });
    expect(result.success).toBe(true);
  });

  test("validates with valid email", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_email: "joao@test.com" });
    expect(result.success).toBe(true);
  });

  test("fails with invalid email format", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_email: "notanemail" });
    expect(result.success).toBe(false);
  });

  test("validates optional id field", () => {
    const result = orderSchema.safeParse({ ...validOrder, id: "5" });
    expect(result.success).toBe(true);
    expect((result as any).data?.id).toBe(5);
  });
});
