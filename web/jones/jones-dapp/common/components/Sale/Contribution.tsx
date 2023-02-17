import React, { useCallback, useEffect, useState } from "react";

import { Button, Text } from "@chakra-ui/react";

import { useStore } from "../../store";

import config from "../../config";
import { fetchUrl } from "../../utils/queries";
import { withdrawTokens } from "../../web3/tokenSale";
import { SaleCard } from "./SaleCard";

interface UserAlreadyClaimed {
  userEthClaimable: number;
  userJonesClaimable: number;
  userClaimed: boolean;
}

function Contribution() {
  const [userClaimed, setUserClaimed] = useState(true);
  const [userClaimableEth, setUserClaimableEth] = useState(0);
  const [userClaimableJones, setUserClaimableJones] = useState(0);

  const {
    state: { address },
  } = useStore((state) => state.web3Data);

  const handleWithdraw = async () => {
    if (!address) return;
    const txSuccess = await withdrawTokens(address);
    if (txSuccess) await userClaimable();
  };

  const userClaimable = useCallback(async () => {
    if (address) {
      const { userEthClaimable, userJonesClaimable, userClaimed } =
        await fetchUrl<UserAlreadyClaimed>(`${config.apiUrl}/v1/jones/tokenSale/${address}`);

      setUserClaimableEth(userEthClaimable);
      setUserClaimableJones(userJonesClaimable);
      setUserClaimed(userClaimed);
    }
  }, [address]);

  useEffect(() => {
    userClaimable();
  }, [address, userClaimable]);

  return !address ? (
    <SaleCard title="Connect your wallet" />
  ) : userClaimed ? (
    <SaleCard title="Address already claimed" />
  ) : !+userClaimableJones ? (
    <SaleCard title="Nothing to claim" />
  ) : (
    <SaleCard title="Claimable Balance">
      <div className="mb-10 text-2xl font-extrabold">{userClaimableJones.toFixed(3)} JONES</div>
      <div className="-mb-10 text-2xl font-extrabold">{userClaimableEth.toFixed(3)} ETH</div>
      <div className="mt-24">
        <Button variant="secondary" size="xl" w="50%" onClick={handleWithdraw}>
          <Text>Claim All</Text>
        </Button>
      </div>
    </SaleCard>
  );
}

export default Contribution;
