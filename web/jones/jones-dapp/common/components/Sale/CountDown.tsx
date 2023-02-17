import React from "react";

import { Button } from "@chakra-ui/react";

import { ArrowUpRightIcon } from "../../icons";
import { Image } from "../Image";
import { SaleCard } from "./SaleCard";

function CountDown() {
  return (
    <SaleCard title={"Sale has ended"}>
      <div className="flex justify-between w-full mb-8 ">
        <div>
          <h1 className="text-2xl font-extrabold">CLOSED</h1>
          <div className="text-slate-500 ">30 Jan 2022</div>
        </div>
      </div>
      <Image src="/logo/arbitrum-dark.svg" width={42} height={42} className="rounded-full" alt="" />
      <p className="font-light">Exclusively available on</p>
      <p className="font-bold">Arbitrum Network</p>
      <div className="text-right">
        <a href="https://bridge.arbitrum.io" target="_blank" rel="noreferrer">
          <Button variant="tertiary" rightIcon={<ArrowUpRightIcon />}>
            Bridge
          </Button>
        </a>
      </div>
    </SaleCard>
  );
}

export default CountDown;
