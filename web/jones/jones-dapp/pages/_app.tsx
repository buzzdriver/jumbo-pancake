import React, { useEffect } from "react";

import ProgressBar from "@badrap/bar-of-progress";
import { ChakraProvider } from "@chakra-ui/react";
import Router from "next/router";

import { useStore } from "../common/store";
import { theme } from "../common/theme";

import "../styles/globals.css";

import type { AppProps } from "next/app";

const progress = new ProgressBar({
  size: 4,
  color: "#FF8320",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }: AppProps) {
  const {
    actions: { fetchMarketPrices },
  } = useStore((state) => state.marketPrices);

  useEffect(() => {
    fetchMarketPrices();
  }, [fetchMarketPrices, Component]);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
