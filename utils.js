export const getNextCountry = (country) =>
  (country == "UK" && "Germany") || "UK";

export const isDiscountAvailable = (passport, country) =>
  passport &&
  ((passport[0] === "B" && country === "UK") ||
    (passport[0] === "A" && country === "Germany"));

export const getTransportBaseCharge = (isDiscountEnabled) =>
  (isDiscountEnabled && 320) || 400;

export const calculateTranportCharge = (isDiscountEnabled, qty) => {
  return Math.ceil(qty / 10) * getTransportBaseCharge(isDiscountEnabled);
};
