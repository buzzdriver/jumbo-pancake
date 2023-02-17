import { coingeckoIds } from "@jones-dao/sdk";

import { getMarketPrices, getPrice, getPrices } from "../helpers/price";

describe("Test fetching data from coingecko", () => {
  it("Test function getPrice", async () => {
    const ethPriceObj = await getPrice("ethereum");
    const ethPrice = ethPriceObj?.["usd"];
    expect(ethPriceObj).toHaveProperty("usd");
    expect(ethPrice).toBeGreaterThanOrEqual(0);
  });

  it("Tes function getPrices", async () => {
    const ethBtcPriceObj = await getPrices(["ethereum", "bitcoin"]);
    const ethPrice = ethBtcPriceObj["ethereum"];
    const btcPrice = ethBtcPriceObj["bitcoin"];

    expect(ethBtcPriceObj).toHaveProperty("bitcoin");
    expect(ethBtcPriceObj).toHaveProperty("ethereum");
    expect(ethPrice).toBeGreaterThanOrEqual(0);
    expect(btcPrice).toBeGreaterThanOrEqual(0);
  });

  it("Test the function getMarketPrices", async () => {
    const tokenPricesObj = await getMarketPrices();
    const tokenNames = Object.keys(tokenPricesObj).sort();
    const tokenPrices = Object.values(tokenPricesObj);

    const expectedTokenNames = Object.values(coingeckoIds).sort();

    expect(tokenNames).toEqual(expectedTokenNames);
    tokenPrices.map((price) => {
      expect(price).toBeGreaterThanOrEqual(0);
    });
  });
});
