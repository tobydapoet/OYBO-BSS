export const formatMoney = (amount: string) => {
  const formattedNumber = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));

  return `€${formattedNumber}`;
};
