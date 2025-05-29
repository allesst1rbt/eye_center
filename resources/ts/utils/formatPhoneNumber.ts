import { onlyNumbers } from "./formatUtils";

export const formatPhoneNumber = (value: string) => {
  const cleaned = onlyNumbers(value);

  const limited = cleaned.slice(0, 11);

  if (limited.length >= 11) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(
      7
    )}`;
  } else if (limited.length > 2) {
    if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(
        7
      )}`;
    }
  }

  return limited;
};
