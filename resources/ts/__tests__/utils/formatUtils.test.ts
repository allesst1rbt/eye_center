import { onlyNumbers } from "../../utils/formatUtils";

describe("onlyNumbers", () => {
  test("removes non-numeric characters", () => {
    expect(onlyNumbers("abc123def")).toBe("123");
  });

  test("returns empty string when no numbers", () => {
    expect(onlyNumbers("abcdef")).toBe("");
  });

  test("returns same string when all numbers", () => {
    expect(onlyNumbers("12345")).toBe("12345");
  });

  test("strips phone formatting", () => {
    expect(onlyNumbers("(11) 99999-9999")).toBe("11999999999");
  });

  test("handles empty string", () => {
    expect(onlyNumbers("")).toBe("");
  });

  test("strips dots and dashes", () => {
    expect(onlyNumbers("123.456-789")).toBe("123456789");
  });
});
