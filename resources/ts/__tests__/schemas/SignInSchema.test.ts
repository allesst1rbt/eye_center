import SignInSchema from "../../schemas/SignInSchema";

describe("SignInSchema", () => {
  test("validates correct credentials", () => {
    const result = SignInSchema.safeParse({ email: "test@test.com", password: "123456" });
    expect(result.success).toBe(true);
  });

  test("fails with empty email", () => {
    const result = SignInSchema.safeParse({ email: "", password: "123456" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("O e-mail é obrigatório");
  });

  test("fails with invalid email format", () => {
    const result = SignInSchema.safeParse({ email: "notanemail", password: "123456" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("E-mail inválido");
  });

  test("fails with empty password", () => {
    const result = SignInSchema.safeParse({ email: "test@test.com", password: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("A senha é obrigatória");
  });

  test("fails with password shorter than 6 characters", () => {
    const result = SignInSchema.safeParse({ email: "test@test.com", password: "123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("A senha deve ter pelo menos 6 caracteres");
  });

  test("fails with missing fields", () => {
    const result = SignInSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
