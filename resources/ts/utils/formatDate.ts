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

export const formatISODate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};
