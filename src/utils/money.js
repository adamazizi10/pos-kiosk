import appConfig from "../app.config";

const { currencyCode} = appConfig.store



export const formatMoney = (cents = 0) => {
  const amount = Number.isFinite(cents) ? cents / 100 : 0;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const dollarsToCents = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  const numberValue =
    typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(numberValue)) return 0;
  return Math.round(numberValue * 100);
};

export const centsToDollars = (cents = 0) => (cents / 100).toFixed(2);
