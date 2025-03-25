export const formatPhoneNumber = (value: string) => {
  // Remove tudo que não for número
  const cleaned = value.replace(/\D/g, "");

  // Limita a 11 caracteres
  const limited = cleaned.slice(0, 11);

  // Formata o número no padrão (XX) XXXXX-XXXX
  if (limited.length === 11) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(
      7
    )}`;
  }

  return limited; // Retorna os números digitados até o momento (sem formatação)
};
