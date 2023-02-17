import React, { FC, useEffect, useState } from "react";

import { Farm } from "@jones-dao/sdk";

import { getTokenBalance } from "../../utils/web3";
import { stakeToken } from "../../web3/staking";
import FarmInteractionModal from "./FarmInteractionModal";

interface StakeModalProps {
  address: string;
  getSingleFarm: (poolId: string) => void;
  showStakeModal: boolean;
  closeStakeModal: () => void;
  stakingInfo: Farm;
}

const StakeModal: FC<StakeModalProps> = ({
  address,
  getSingleFarm,
  showStakeModal,
  closeStakeModal,
  stakingInfo: { lpToken, poolId, farmName, buyUrl, apr, isSingleStaking },
}) => {
  const [balance, setBalance] = useState("0");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    if (address) {
      const init = async () => {
        setBalance(await getTokenBalance(lpToken, address));
      };

      init();
    }
  }, [address, lpToken]);

  const onStake = async (inputAmount: string): Promise<boolean | void> => {
    if (isNaN(+inputAmount)) return setInputError("Only numbers allowed.");
    if (+inputAmount > +balance) return setInputError("Insufficient balance.");

    const txSuccess = await stakeToken(poolId, inputAmount);

    if (txSuccess) {
      getSingleFarm(poolId);
      closeStakeModal();
    }
    return txSuccess;
  };

  return (
    <FarmInteractionModal
      title="Stake"
      showModal={showStakeModal}
      closeModal={closeStakeModal}
      onSubmit={onStake}
      inputError={inputError}
      maxBalance={balance}
      setInputError={setInputError}
      farmName={farmName}
      provideUrl={buyUrl}
      apr={apr}
      isSingleStaking={!!isSingleStaking}
      lpToken={lpToken}
    />
  );
};

export default StakeModal;
