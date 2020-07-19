import readline from "readline";
import createInventory from "./createInventory.js";
import {
  getNextCountry,
  calculateTranportCharge,
  isDiscountAvailable,
  checkIfHighCostCountry,
} from "./utils.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const calculatePriceForItem = (inventory, country, passport, item, itemQty) => {
  let price = "OUT_OF_STOCK";
  const nextCountry = getNextCountry(country);
  const isDiscountEnabled = isDiscountAvailable(passport, nextCountry);

  if (checkIfHighCostCountry(country, item, isDiscountEnabled)) {
    const country1Qty = itemQty - (itemQty % 10);
    let country2Qty = itemQty % 10;
    if (country1Qty < inventory[nextCountry][item].quantity) {
      price =
        inventory[nextCountry][item].price * country1Qty +
        calculateTranportCharge(
          isDiscountAvailable(passport, nextCountry),
          country1Qty
        );
      inventory[nextCountry][item].quantity -= country1Qty;
    } else {
      price =
        inventory[nextCountry][item].price *
          inventory[nextCountry][item].quantity +
        calculateTranportCharge(
          isDiscountAvailable(passport, nextCountry),
          country1Qty
        );
      country2Qty += country1Qty - inventory[nextCountry][item].quantity;
      inventory[nextCountry][item].quantity = 0;
    }
    if (country2Qty < inventory[country][item].quantity) {
      price += inventory[country][item].price * country2Qty;
      inventory[country][item].quantity -= country2Qty;
    } else {
      return "OUT_OF_STOCK";
    }
  } else if (itemQty < inventory[country][item].quantity) {
    price = inventory[country][item].price * itemQty;
    inventory[country][item].quantity -= itemQty;
  } else if (
    itemQty <
    inventory.UK[item].quantity + inventory.Germany[item].quantity
  ) {
    const nextCountryQty = itemQty - inventory[country][item].quantity;
    price =
      inventory[country][item].price * inventory[country][item].quantity +
      inventory[nextCountry][item].price * nextCountryQty;
    price += calculateTranportCharge(isDiscountEnabled, nextCountryQty);
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
  rl.question(`INPUT ${index}: `, function (input) {
    if (input) {
      const { salePrice, inventory } = calculateTotalPrice(input.split(":"));
      console.log(
        `OUTPUT ${index}: ${salePrice}:${inventory["UK"]["Mask"].quantity}:${inventory["Germany"]["Mask"].quantity}:${inventory["UK"]["Gloves"].quantity}:${inventory["Germany"]["Gloves"].quantity}`
      );
    }
    main(++index);
  });
};
main(1);
