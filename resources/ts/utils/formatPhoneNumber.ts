export const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");

  const limited = cleaned.slice(0, 11);

  if (limited.length === 11) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(
      7
    )}`;
  }

  return limited;
};
