import readline from "readline";
import createInventory from "./createInventory.js";
import { getNextCountry, calculateTranportCharge, isDiscountAvailable } from "./utils.js";

const calculatePriceForItem = (inventory, country, passport, item, itemQty) => {
  let price = "OUT_OF_STOCK";
  if (itemQty < inventory[country][item].quantity) {
    price = inventory[country][item].price * itemQty;
    inventory[country][item].quantity -= itemQty;
  } else if (
    itemQty <
    inventory.UK[item].quantity + inventory.Germany[item].quantity
  ) {
    const nextCountry = getNextCountry(country);
    const nextCountryQty = itemQty - inventory[country][item].quantity;
    price =
      inventory[country][item].price * inventory[country][item].quantity +
      inventory[nextCountry][item].price * nextCountryQty;
    price += calculateTranportCharge(
      isDiscountAvailable(passport, nextCountry),
      nextCountryQty
    );
    inventory[country][item].quantity = 0;
    inventory[nextCountry][item].quantity -= nextCountryQty;
  }
  return price;
};

const calculateTotalPrice = (inputs = []) => {
  const inventory = createInventory();
  let passport;
  if (inputs.length == 6) {
    passport = inputs.splice(1, 1)[0];
  }
  const [country, item1, item1Qty, item2, item2Qty] = inputs;

  const item1Price = calculatePriceForItem(
    inventory,
    country,
    passport,
    item1,
    item1Qty
  );
  const item2Price = calculatePriceForItem(
    inventory,
    country,
    passport,
    item2,
    item2Qty
  );

  if (item1Price === "OUT_OF_STOCK" || item2Price === "OUT_OF_STOCK") {
    return {
      salePrice: "OUT_OF_STOCK",
      inventory: createInventory(),
    };
  }
  return {
    salePrice: item1Price + item2Price,
    inventory,
  };
};

const main = (index) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(`INPUT ${index}: `, function (input) {
    if(input) {
      const { salePrice, inventory } = calculateTotalPrice(input.split(":"));
      console.log(
        `OUTPUT ${index}: ${salePrice}:${inventory["UK"]["Mask"].quantity}:${inventory["Germany"]["Mask"].quantity}:${inventory["UK"]["Gloves"].quantity}:${inventory["Germany"]["Gloves"].quantity}`
      );
    }
    main(++index);
  });
};
main(1);
