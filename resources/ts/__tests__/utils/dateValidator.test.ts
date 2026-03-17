import { isValidDate } from "../../utils/dateValidator";

describe("isValidDate", () => {
  test("returns true for valid date", () => {
    expect(isValidDate("15/06/1990")).toBe(true);
  });

  test("returns false for wrong format", () => {
    expect(isValidDate("1990-06-15")).toBe(false);
  });

  test("returns false for invalid month > 12", () => {
    expect(isValidDate("15/13/1990")).toBe(false);
  });

  test("returns false for month 0", () => {
    expect(isValidDate("15/00/1990")).toBe(false);
  });

  test("returns false for day 0", () => {
    expect(isValidDate("00/06/1990")).toBe(false);
  });

  test("returns false for day 32", () => {
    expect(isValidDate("32/01/1990")).toBe(false);
  });

  test("returns false for Feb 30", () => {
    expect(isValidDate("30/02/2020")).toBe(false);
  });

  test("returns true for Feb 29 on leap year", () => {
    expect(isValidDate("29/02/2020")).toBe(true);
  });

  test("returns false for Feb 29 on non-leap year", () => {
    expect(isValidDate("29/02/2021")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isValidDate("")).toBe(false);
  });

  test("returns false for year < 1000", () => {
    expect(isValidDate("15/06/999")).toBe(false);
  });

  test("returns true for last day of month", () => {
    expect(isValidDate("31/01/2024")).toBe(true);
  });

  test("returns false for April 31", () => {
    expect(isValidDate("31/04/2024")).toBe(false);
  });
});
