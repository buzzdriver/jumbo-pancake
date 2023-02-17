import React, { FC, useState } from "react";

import { Farm } from "@jones-dao/sdk";

import { unstakeToken } from "../../web3/staking";
import FarmInteractionModal from "./FarmInteractionModal";

interface StakeModalProps {
  getSingleFarm: (poolId: string) => void;
  showUnstakeModal: boolean;
  closeUnstakeModal: () => void;
  stakingInfo: Farm;
}

const UnstakeModal: FC<StakeModalProps> = ({
  getSingleFarm,
  showUnstakeModal,
  closeUnstakeModal,
  stakingInfo: { poolId, farmName, buyUrl, apr, isSingleStaking, userStaked = "0" },
}) => {
  const [inputError, setInputError] = useState("");

  const onUnstake = async (inputAmount: string): Promise<boolean | void> => {
    if (+inputAmount > +userStaked) return setInputError("Amount exceeds claimable balance.");

    const txSuccess = await unstakeToken(poolId, inputAmount);

    if (txSuccess) {
      getSingleFarm(poolId);
      closeUnstakeModal();
    }
    return txSuccess;
  };
  return (
    <FarmInteractionModal
      title="Unstake"
      showModal={showUnstakeModal}
      closeModal={closeUnstakeModal}
      onSubmit={onUnstake}
      inputError={inputError}
      maxBalance={userStaked}
      setInputError={setInputError}
      farmName={farmName}
      provideUrl={buyUrl}
      apr={apr}
      isSingleStaking={!!isSingleStaking}
    />
  );
};

export default UnstakeModal;
