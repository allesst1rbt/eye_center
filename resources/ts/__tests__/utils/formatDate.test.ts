import { formatDate, formatISODate } from "../../utils/formatDate";

describe("formatDate", () => {
  test("returns digits unchanged when less than 3", () => {
    expect(formatDate("15")).toBe("15");
  });

  test("formats 4 digits as dd/mm", () => {
    expect(formatDate("1506")).toBe("15/06");
  });

  test("formats 8 digits as dd/mm/yyyy", () => {
    expect(formatDate("15061990")).toBe("15/06/1990");
  });

  test("strips existing slashes and re-formats", () => {
    expect(formatDate("15/06/1990")).toBe("15/06/1990");
  });

  test("handles empty string", () => {
    expect(formatDate("")).toBe("");
  });

  test("truncates input beyond 8 digits", () => {
    expect(formatDate("150619901234")).toBe("15/06/1990");
  });

  test("formats 5 digits as dd/mm/d", () => {
    expect(formatDate("15061")).toBe("15/06/1");
  });
});

describe("formatISODate", () => {
  test("formats ISO string to dd/mm/yyyy", () => {
    const result = formatISODate("2024-06-15T00:00:00.000Z");
    expect(result).toMatch(/15\/06\/2024/);
  });

  test("pads single digit day and month with zero", () => {
    const result = formatISODate("2024-01-05T00:00:00.000Z");
    expect(result).toMatch(/05\/01\/2024/);
  });
});
