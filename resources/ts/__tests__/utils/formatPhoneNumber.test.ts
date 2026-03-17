import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

describe("formatPhoneNumber", () => {
  test("formats complete 11-digit phone number", () => {
    expect(formatPhoneNumber("11999999999")).toBe("(11) 99999-9999");
  });

  test("returns raw digits when 2 or fewer digits", () => {
    expect(formatPhoneNumber("11")).toBe("11");
  });

  test("formats partial phone with 3 digits", () => {
    expect(formatPhoneNumber("119")).toBe("(11) 9");
  });

  test("formats partial phone with 7 digits", () => {
    expect(formatPhoneNumber("1199999")).toBe("(11) 99999");
  });

  test("formats partial phone with 9 digits", () => {
    expect(formatPhoneNumber("119999999")).toBe("(11) 99999-99");
  });

  test("strips formatting before re-formatting", () => {
    expect(formatPhoneNumber("(11) 99999-9999")).toBe("(11) 99999-9999");
  });

  test("handles empty string", () => {
    expect(formatPhoneNumber("")).toBe("");
  });

  test("truncates input beyond 11 digits", () => {
    expect(formatPhoneNumber("119999999991234")).toBe("(11) 99999-9999");
  });
});
