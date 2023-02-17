import axios from 'axios'

export const fetchUrl = async (url: string): Promise<any> => {
  try {
    const { data } = await axios.get(url)

    return data
  } catch (err) {
    console.error(err)
  }
}

export const getEthPriceUsd = async (): Promise<number> => {
  const ethPriceUrl =
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'

  const data = await fetchUrl(ethPriceUrl)
  const ethPrice = data?.ethereum.usd ?? 0

  return ethPrice
}

export const getTokenPriceUsd = async (tokenId: string): Promise<number> => {
  const tokenPriceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
  const data = await fetchUrl(tokenPriceUrl)

  if (!data) return 0

  const tokenPrice = data[tokenId]?.usd ?? 0

  return tokenPrice
}

interface VaultConfig {
  [key: string]: {
    maxDrawdown: number | undefined
    roi: {
      [key: string]: number
    }
  }
}

export const vaultsConfig: VaultConfig = {
  ETH: {
    maxDrawdown: undefined,
    roi: {
      guardedLaunch: 0.912,
      feb22: 0.75,
      mar22: 0.11,
      apr22: 0.473036,
      may22: 1.0882,
      jun22: 1.81,
    },
  },
  GOHM: {
    maxDrawdown: undefined,
    roi: {
      feb22: 0.091,
      mar22: -0.05,
      apr22: -0.106037,
      may22: 0.0,
      jun22: 0.0,
    },
  },
  DPX: {
    maxDrawdown: undefined,
    roi: {
      mar22: -0.93,
      apr22: 1.51635,
      may22: 1.5771,
      jun22: 2.6855,
    },
  },
  RDPX: {
    maxDrawdown: undefined,
    roi: {
      may22: 0.9771,
      jun22: -0.24,
    },
  },
}
