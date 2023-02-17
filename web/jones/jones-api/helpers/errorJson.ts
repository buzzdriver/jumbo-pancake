interface ErrorInterface {
  id: string;
  title: string;
  message: string;
  url: string | undefined;
  statusCode: number;
}

interface Error {
  INVALID_ADDRESS: ErrorInterface;
  ALLOWANCE: ErrorInterface;
  BALANCE: ErrorInterface;
  AIRDROP: ErrorInterface;
  FARM: ErrorInterface;
  FARMS: ErrorInterface;
  TOKENSALE: ErrorInterface;
  VAULT: ErrorInterface;
  VAULTS: ErrorInterface;
  MARKETCAP: ErrorInterface;
  PRICES: ErrorInterface;
  SUPPLY: ErrorInterface;
  TVL: ErrorInterface;
  PAIR: ErrorInterface;
  PRICE: ErrorInterface;
}

export const errorMapping: Error = {
  INVALID_ADDRESS: {
    id: "INVALID_ADDRESS",
    title: "Address is invalid",
    message: "",
    url: "",
    statusCode: 400,
  },

  ALLOWANCE: {
    id: "ALLOWANCE",
    title: "Error in Allowance Endpoint",
    message: "Something went wrong in allowance",
    url: "",
    statusCode: 500,
  },

  BALANCE: {
    id: "BALANCE",
    title: "Error in Balanace Endpoint",
    message: "Something went wrong in balance",
    url: "",
    statusCode: 500,
  },

  AIRDROP: {
    id: "AIRDROP",
    title: "Error in Airdrop Endpoint",
    message: "Something went wrong in airdrop",
    url: "",
    statusCode: 500,
  },

  FARM: {
    id: "FARM",
    title: "Error in Farm Endpoint",
    message: "Something went wrong in farm",
    url: "",
    statusCode: 500,
  },

  FARMS: {
    id: "FARMS",
    title: "Error in Farms Endpoint",
    message: "Something went wrong in farms",
    url: "",
    statusCode: 500,
  },

  TOKENSALE: {
    id: "TOKENSALE",
    title: "Error in TokenSale Endpoint",
    message: "Something went wrong in tokenSale",
    url: "",
    statusCode: 500,
  },

  VAULT: {
    id: "VAULT",
    title: "Error in Vault Endpoint",
    message: "Something went wrong in vault",
    url: "",
    statusCode: 500,
  },

  VAULTS: {
    id: "VAULTS",
    title: "Error in Vaults Endpoint",
    message: "Something went wrong in vaults",
    url: "",
    statusCode: 500,
  },

  MARKETCAP: {
    id: "MARKETCAP",
    title: "Error in Marketcap Endpoint",
    message: "Something went wrong in market-cap",
    url: "",
    statusCode: 500,
  },

  PRICES: {
    id: "PRICES",
    title: "Error in Prices Endpoint",
    message: "Something went wrong in prices",
    url: "",
    statusCode: 500,
  },

  SUPPLY: {
    id: "SUPPLY",
    title: "Error in Supply Endpoint",
    message: "Something went wrong in supply",
    url: "",
    statusCode: 500,
  },

  TVL: {
    id: "TVL",
    title: "Error in TVL Endpoint",
    message: "Something went wrong in tvl",
    url: "",
    statusCode: 500,
  },

  PAIR: {
    id: "PAIR",
    title: "Error in Pair Endpoint",
    message: "Something went wrong in pair",
    url: "",
    statusCode: 500,
  },

  PRICE: {
    id: "PRICE",
    title: "Error in Price Endpoint",
    message: "Something went wrong in price",
    url: "",
    statusCode: 500,
  },
};
