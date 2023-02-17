import fetch from "node-fetch";

const BASE_URL = "http://localhost:8000/api";
const testAddress = "0x0351764A06119D751A76ecdBD3956c220225DC9b";

const ENDPOINTS = [
  `/v1/jones/farm/0?address=${testAddress}`,
  `/v1/jones/farms/deprecated/${testAddress}`,
  `/v1/jones/farms/personal/${testAddress}`,
  "/v1/jones/farms/general",
  "/v1/jones/market-cap",
  "/v1/jones/prices",
  "/v1/jones/supply",
  "/v1/jones/tvl",
  "/v1/pair/0xe8EE01aE5959D3231506FcDeF2d5F3E85987a39c",
  "/v1/price/jones-dao",
];

it.skip("Tests all endpoints", async () => {
  for (let i = 0; i < ENDPOINTS.length; i++) {
    const endpoint = ENDPOINTS[i];
    const response = await fetch(`${BASE_URL}${endpoint}`);
    expect(response.status).toBe(200);
  }
});
