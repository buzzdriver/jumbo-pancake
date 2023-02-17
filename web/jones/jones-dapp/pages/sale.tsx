import React from "react";

import { Button, Text } from "@chakra-ui/react";

import Disclaimer from "../common/components/Disclaimer";
import InfoFooter from "../common/components/InfoFooter";
import Layout from "../common/components/Layout";
import Chart from "../common/components/Sale/Chart";
import Contribution from "../common/components/Sale/Contribution";
import CountDown from "../common/components/Sale/CountDown";
import { saleInfoSections } from "../common/components/Sale/saleInfoSections";
import TotalRaised from "../common/components/Sale/TotalRaised";
import { ArrowUpRightIcon } from "../common/icons";

function Sale() {
  return (
    <Layout title="Token Sale">
      <div className="pt-6 mx-auto text-white">
        <h1 className="relative mb-2 text-4xl font-extralight">Velcome Jones!</h1>

        <h1 className="relative mb-2 text-4xl font-extrabold tracking-wider">
          Jones DAO TGE has ended
        </h1>

        <div className="mt-6 space-x-4">
          <a
            href="https://docs.jonesdao.io/jones-dao/jones-token/tokenomics"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary" rightIcon={<ArrowUpRightIcon />}>
              <Text>Tokenomics</Text>
            </Button>
          </a>

          <a
            href="https://jonesdao.substack.com/p/jonesdao-token-sale-relaunch"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary" rightIcon={<ArrowUpRightIcon />}>
              <Text>Sale guide</Text>
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 mx-auto mt-6 md:grid-cols-2 gap-x-2 gap-y-4">
        <Contribution />
        <CountDown />
        <Chart />
        <TotalRaised />
      </div>

      <InfoFooter sections={saleInfoSections} />
      <Disclaimer />
    </Layout>
  );
}

export default Sale;
