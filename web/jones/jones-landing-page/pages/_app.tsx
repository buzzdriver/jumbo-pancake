import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { providers } from 'ethers'
import { Provider, createClient } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../theme'

const client = createClient({
  provider(config) {
    return new providers.AlchemyProvider(
      config.chainId,
      process.env.REACT_APP_ALCHEMY_ID as string
    )
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider client={client}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  )
}

export default MyApp
