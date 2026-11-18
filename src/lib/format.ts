const usd = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatUsd = (n: number): string => usd.format(n);

export const formatKm = (km: number): string =>
  `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(km)} km`;
