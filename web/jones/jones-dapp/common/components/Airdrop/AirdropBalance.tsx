import { FC } from "react";

import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useStore } from "../../store";

import { claimToken } from "../../web3/airdrop";
import { Card } from "../Card";

const amountlist = [
  2450000000000000000000, 2496125461000000000000, 2000000000000000000000, 2046125461000000000000,
  1000000000000000000000, 1046125461000000000000, 550000000000000000000, 596125461000000000000,
  46125461000000000000,
];

interface AirdropBalanceProps {
  claimableAmount: string;
  index: number;
  merkleProof: string[];
  checkUserEligible: () => void;
}

const AirdropBalance: FC<AirdropBalanceProps> = ({
  claimableAmount,

  index,
  merkleProof,
  checkUserEligible,
}) => {
  const router = useRouter();

  const {
    state: { address },
  } = useStore((state) => state.web3Data);

  const truncateToDecimals = (num: number, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num) / calcDec;
  };

  const amountIndex = Number(claimableAmount.substring(3)) - 1;
  const amount = truncateToDecimals(amountlist[amountIndex], 18);

  async function claimTokens() {
    if (address) {
      const txSuccess = await claimToken(
        claimableAmount,
        address.toLocaleLowerCase(),
        index,
        merkleProof,
      );
      if (txSuccess) checkUserEligible();
    }
  }

  async function claimAndStake() {
    await claimTokens();
    router.push("/staking");
  }

  return (
    <Card className="w-full p-10 mt-10 transform h-80">
      <div className="space-y-2">
        <p className="text-sm font-thin">Claimable balance</p>
        <p className="text-3xl font-bold">{amount.toFixed(2)} JONES</p>
      </div>
      <div className="mt-5">
        <Button onClick={() => claimAndStake()} variant="secondary" size="xl" w={40}>
          <Text>Claim & Stake</Text>
        </Button>
      </div>
      <div className="mt-5">
        <Button onClick={() => claimTokens()} variant="secondary" size="xl" w={40}>
          <Text>Claim All</Text>
        </Button>
      </div>
    </Card>
  );
};

export default AirdropBalance;
