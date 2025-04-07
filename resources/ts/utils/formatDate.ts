export const formatDate = (value: string) => {
  const cleaned = value.replace(/\D/g, "");

  const limited = cleaned.slice(0, 8);

  if (limited.length >= 5) {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  } else if (limited.length >= 3) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return limited;
  }
};
