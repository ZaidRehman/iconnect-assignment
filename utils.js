import createInventory from "./createInventory.js";

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

export const checkIfHighCostCountry = (country, item, isDiscountEnabled) => {
  const inventory = createInventory();
  // Checking country with higher price
  // and then comparing the price difference with relative transportaion cost
  const highCostCountry = "Germany";
  const lowCostCountry = "UK";
  return (
    country === highCostCountry &&
    inventory[highCostCountry][item].price -
      inventory[lowCostCountry][item].price >
      ((isDiscountEnabled && 32) || 40)
  );
};
