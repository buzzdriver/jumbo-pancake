import React from "react";

import { Button } from "@chakra-ui/react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { ArrowUpRightIcon } from "../../icons";
import { Image } from "../Image";
import { SaleCard } from "./SaleCard";

function TotalRaised() {
  const depositMax = Number(5000);
  const depositCurrent = Number(23254.93);
  let depositArray;

  if (depositMax === 0) {
    depositArray = [{ deposit: depositCurrent }, { deposit: 50000 }];
  } else if (depositCurrent > depositMax) {
    depositArray = [{ deposit: depositCurrent }];
  } else {
    depositArray = [{ deposit: depositCurrent }, { deposit: depositMax - depositCurrent }];
  }

  const depositRatio = depositMax > 0 ? depositCurrent / depositMax : 0;
  const COLORS = ["#DE6B38", "#000000"];

  return (
    <SaleCard title="Total raised" className="right-0 total-raised-bg">
      <div className="text-2xl font-extrabold">
        {depositMax === 0 ? depositCurrent + " ETH" : depositCurrent + " / " + depositMax + " ETH"}
      </div>

      <div className="flex items-center mt-6">
        <div className="flex items-center justify-center">
          <div className="absolute">
            <Image src="/logo/eth.svg" width={42} height={42} alt="" />
          </div>

          <ResponsiveContainer width={140} height={140}>
            <PieChart width={140} height={140}>
              <Pie
                data={depositArray}
                dataKey="deposit"
                innerRadius="93%"
                outerRadius="100%"
                stroke="none"
              >
                {depositArray.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {depositMax === 0 ? (
          ""
        ) : (
          <span className="py-2 px-4 ml-4 font-light lg:ml-8 lg:text-xl text-primary-700 bg-[#36384033] rounded-xl">
            {(depositRatio * 100).toFixed(2)}% filled
          </span>
        )}
      </div>

      <div className="text-right">
        <a
          href="https://arbiscan.io/address/0x8A0027152ad2781C0cbabda0CC53290BF04f1Cf5"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="tertiary" rightIcon={<ArrowUpRightIcon />}>
            Arbiscan
          </Button>
        </a>
      </div>
    </SaleCard>
  );
}

export default TotalRaised;
