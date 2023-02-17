# Jones DAO API

Built with Vercel's serverless functions.

Read more here - https://vercel.com/docs/serverless-functions/introduction

Base url: `https://data.jonesdao.io/api/v1`

---

## Jones

Data related to Jones

**Supply**

Returns circulating supply for the JONES token.

Endpoint: `/jones/supply`

Method: `GET`

Example response:

```json
{
  "totalSupply": 10000000,
  "maxSupply": 10000000,
  "circulatingSupply": 2347826.5271217814
}
```

**Market Cap**

Returns market cap in USD for the JONES token based on current circulating supply and token price from CoinGecko.

Endpoint: `/jones/market-cap`

Method: `GET`

Example response:

```json
{ "marketCap": 30005676.0777883 }
```

**TVL**

Returns the total value locked in Jones. Tvl is separated by vaults, staking and total.

Endpoint: `/jones/tvl`

Method: `GET`

Example response:

```json
{
  "tvl": {
    "staking": 12787389.873931691,
    "vaults": 4667099.9556990815,
    "total": 17454489.829630774
  }
}
```

**Farms**

Farms, separated by general data and personal data.

_General_

General data of the farms. Returns all farms.

Endpoint: `/jones/farms/general`

Method: `GET`

Example response:

```json
{
  "farms": [
    {
      "farmName": "JONES",
      "poolId": "0",
      "deprecatedFarmAddress": "0xf1a26Cf6309a59794da29B5b2E6fABD3070d470f",
      "lpToken": "0x10393c20975cF177a3513071bC110f7962CD67da",
      "buyUrl": "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x10393c20975cF177a3513071bC110f7962CD67da",
      "totalStaked": 1746133.9358888457,
      "totalStakedValue": 3858955.998314349,
      "apr": 15.788109205475584,
      "deprecatedFarmTotalStakedValue": 391762.62408349494
    }
  ]
}
```

_Personal_

Personal data of the farms, depends on address. Returns all farms.

Endpoint: `/jones/farms/personal/[address]`

Endpoint example: `https://data.jonesdao.io/api/v1/jones/farms/personal/0x0351764A06119D751A76ecdBD3956c220225DC9b`

Method: `GET`

Example response:

```json
{
  "farms": [
    {
      "farmName": "JONES-ETH",
      "poolId": "1",
      "deprecatedFarmAddress": "0x360a766F30F0Ba57d2865eFb32502FB800b14dD3",
      "claimable": "15.679263995817758668",
      "claimableValue": 34.65117343075725,
      "userStaked": "37.292789243302744914",
      "userStakedValue": 5417.005484384144,
      "tokenPair": {
        "token0": {
          "symbol": "JONES",
          "staked": 1228.1398146845945
        },
        "token1": {
          "symbol": "ETH",
          "staked": 1.3692010141444018
        }
      },
      "oldDeposit": "0.0",
      "oldClaim": "0.0",
      "oldDepositState": 0
    }
  ]
}
```

_Single farm_

Single farm data, general and personal combined.

Endpoint: `/jones/farm/[poolId]?address=[address]`

Endpoint example: `https://data.jonesdao.io/api/v1/jones/farm/1?address=0x0351764A06119D751A76ecdBD3956c220225DC9b`

Method: `GET`

Example response:

```json
{
  "farm": {
    "farmName": "JONES-ETH",
    "poolId": "1",
    "deprecatedFarmAddress": "0x360a766F30F0Ba57d2865eFb32502FB800b14dD3",
    "lpToken": "0xe8EE01aE5959D3231506FcDeF2d5F3E85987a39c",
    "buyUrl": "https://app.sushi.com/add/0x10393c20975cF177a3513071bC110f7962CD67da/ETH",
    "totalStaked": 11485.555513888892,
    "totalStakedValue": 1668347.1113952151,
    "apr": 46.95242244249474,
    "deprecatedFarmTotalStakedValue": 190016.75782037576,
    "claimable": "15.681962739714349902",
    "claimableValue": 34.65713765476871,
    "userStaked": "37.292789243302744914",
    "userStakedValue": 5416.129195735092,
    "tokenPair": {
      "token0": {
        "symbol": "JONES",
        "staked": 1228.1398146845945
      },
      "token1": {
        "symbol": "ETH",
        "staked": 1.3692010141444018
      }
    },
    "oldDeposit": "0.0",
    "oldClaim": "0.0",
    "oldDepositState": 0
  }
}
```

_Deprecated_

Deprecated farms data. Returns all deprecated farms with general and personal data.

Endpoint: `/jones/farms/deprecated/[address]`

Endpoint example: `https://data.jonesdao.io/api/v1/jones/farms/deprecated/0x0351764A06119D751A76ecdBD3956c220225DC9b`

Method: `GET`

Example response:

```json
{
  "deprecatedFarms": [
    {
      "farmName": "JONES-USDC",
      "deprecatedFarmAddress": "0x13f6A63867046107780Bc3fEBdeE90E7AfCdfd99",
      "tvl": 132343.43258955964,
      "claimable": "0.0",
      "userStaked": "0.0",
      "claimableValue": 0,
      "userStakedValue": 0,
      "oldDepositState": 0
    }
  ]
}
```

**Vaults**

Vaults, separated by general data and personal data.

_General_

General data of the farms. Returns all farms.

Endpoint: `/jones/vaults/general`

Method: `GET`

Example response:

```json
{
  "vaults": [
    {
      "vaultName": "ETH",
      "vaultAddress": "0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346",
      "tokenAddress": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      "jAssetAddress": "0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3",
      "jAssetPictureUrl": "https://gateway.pinata.cloud/ipfs/Qmc6wdeX9Syym23LzsimKBDEVZvvjPYEm9ZPtCfWdJJQN6",
      "version": "V3",
      "isNativeVault": true,
      "apy": 8.299699367755364,
      "isCapSet": true,
      "managementWindowOpen": true,
      "vaultCap": 2000,
      "tvl": 1870513.3100453918,
      "totalDeposited": 1408.296361302348,
      "percentageFilled": 70.4148180651174,
      "jAssetPerToken": 0.9760743151695549,
      "tokenPerJAsset": 1.0245121549236635
    }
  ]
}
```

_Personal_

Personal data of the vaults, depends on address. Returns all vaults.

Endpoint: `/jones/vaults/personal/[address]`

Endpoint example: `https://data.jonesdao.io/api/v1/jones/vaults/personal/0x0351764A06119D751A76ecdBD3956c220225DC9b`

Method: `GET`

Example response:

```json
{
  "vaults": [
    {
      "vaultName": "ETH",
      "vaultAddress": "0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346",
      "tokenAddress": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      "jAssetAddress": "0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3",
      "jAssetPictureUrl": "https://gateway.pinata.cloud/ipfs/Qmc6wdeX9Syym23LzsimKBDEVZvvjPYEm9ZPtCfWdJJQN6",
      "version": "V3",
      "isNativeVault": true,
      "apy": 8.299699367755364,
      "userClaimable": "0.0"
    }
  ]
}
```

_Single vault_

Single vault data, general and personal combined.

Endpoint: `/jones/vault/[vaultName]?address=[address]`

Endpoint example: `https://data.jonesdao.io/api/v1/jones/vault/ETH?address=0x0351764A06119D751A76ecdBD3956c220225DC9b`

Method: `GET`

Example response:

```json
{
  "vault": {
    "vaultName": "ETH",
    "vaultAddress": "0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346",
    "tokenAddress": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    "jAssetAddress": "0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3",
    "jAssetPictureUrl": "https://gateway.pinata.cloud/ipfs/Qmc6wdeX9Syym23LzsimKBDEVZvvjPYEm9ZPtCfWdJJQN6",
    "version": "V3",
    "isNativeVault": true,
    "apy": 8.299699367755364,
    "isCapSet": true,
    "managementWindowOpen": true,
    "vaultCap": 2000,
    "tvl": 1870513.3100453918,
    "totalDeposited": 1408.296361302348,
    "percentageFilled": 70.4148180651174,
    "jAssetPerToken": 0.9760743151695549,
    "tokenPerJAsset": 1.0245121549236635,
    "userClaimable": "0.0"
  }
}
```

---

## Price

Returns the price of a single token from CoinGecko relative to usd. Token name should be consistent with coingecko api-id naming convention.

Endpoint: `/price/[token]`

Endpoint example: `https://data.jonesdao.io/api/v1/price/bitcoin`

Method: `GET`

Example response:

```json
{ "price": { "usd": 39544 } }
```

---

## Prices

Returns the price of a single or multiple tokens from CoinGecko relative to usd. To get prices of multiple tokens, separate each token name by ",". Token names should be consistent with coingecko api-id naming convention. If no query parameter tokenIds provided, will return prices of tokens relevant to Jones protocol.

Endpoint: `prices`
Endpoint: `prices?tokenIds=[tokens]`

Endpoint example: `https://data.jonesdao.io/api/v1/prices`
Endpoint example: `https://data.jonesdao.io/api/v1/prices?tokenIds=bitcoin,ethereum`

Method: `GET`

Example response:

```json
{ "prices": { "bitcoin": 39544, "ethereum": 2932.69 } }
```

---

## Pair

Returns info of a Jones supported lp token. Jones lp tokens are SLP's.

Endpoint: `pair/[address]`

Endpoint example: `https://data.jonesdao.io/api/v1/pair/0x110a0f39b15D04f2F348B61Bd741429C7d188d3F`

Method: `GET`

Example response:

```json
{
  "pair": {
    "address": "0x110a0f39b15D04f2F348B61Bd741429C7d188d3F",
    "price": 81.48311518441321,
    "token0": {
      "address": "0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23",
      "symbol": "jrDPX",
      "decimals": 18,
      "reserve": 7370.062101643418
    },
    "token1": {
      "address": "0x32Eb7902D4134bf98A28b963D26de779AF92A212",
      "symbol": "RDPX",
      "decimals": 18,
      "reserve": 7855.928489475249
    }
  }
}
```

---

## tokenSale

Returns token sale information for a specified address

Endpoint: `jones/tokenSale/[address]`

Endpoint example: `https://data.jonesdao.io/api/v1/jones/tokenSale/0x9D54D95D19639e1E49e3212B8d1f2F691bf2daA0

Method: `GET`

Example response:

```json
{ "userEthClaimable": 0, "userJonesClaimable": 0, "userClaimed": false }
```

---

## airdrop

Returns if an index has claimed airdop

Endpoint: `jones/airdrop/[index]`

Endpoint example: `https://data.jonesdao.io/api/v1/jones/airdrop/0

Method: `GET`

Example response:

```json
{ "claimed": true }
```
