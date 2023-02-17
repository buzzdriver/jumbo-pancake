import { FC, useCallback, useEffect, useState } from "react";

import { Button, ButtonProps } from "@chakra-ui/react";

import { useStore } from "../../store";
import { defaultChain } from "../../store/web3Data";

import { useWeb3Modal } from "../../hooks/useWeb3Modal";
import { switchNetwork } from "../../utils/network";
import { approveToken, getAllowance } from "../../utils/web3";

interface InteractionButtonProps {
  onSubmit: () => Promise<void>;
  tokenAddress?: string;
  spenderAddress: string;
  actionName: string;
  inputAmount: string;
  tokenName: string;
  requireApprove: boolean;
  disabled?: boolean;
  disabledText?: string;
}
export const InteractionButton: FC<InteractionButtonProps & ButtonProps> = ({
  onSubmit,
  tokenAddress,
  spenderAddress,
  actionName,
  inputAmount,
  tokenName,
  requireApprove,
  disabled,
  disabledText,
  ...buttonStyling
}) => {
  const [isApproved, setIsApproved] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [inTx, setInTx] = useState(false);
  const {
    state: { address, isSupportedChain },
  } = useStore((state) => state.web3Data);
  const { connect } = useWeb3Modal();

  const checkAndSetAllowance = useCallback(async () => {
    if (address && tokenAddress) {
      const allowanceResult = await getAllowance(tokenAddress, address, spenderAddress);

      setAllowance(allowanceResult);
    }
  }, [address, spenderAddress, tokenAddress]);

  useEffect(() => {
    if (address && requireApprove) {
      const init = async () => {
        await checkAndSetAllowance();
      };

      init();
    }
  }, [address, checkAndSetAllowance, requireApprove]);

  useEffect(() => {
    setIsApproved(requireApprove ? allowance >= +inputAmount : true);
  }, [allowance, inputAmount, requireApprove]);

  const handleApprove = async () => {
    if (tokenAddress) {
      const txSuccess = await approveToken(tokenAddress, spenderAddress);
      if (txSuccess) await checkAndSetAllowance();
    }
  };

  const getButtonState = (): { text: string; fn: (() => void) | undefined } => {
    if (!address)
      return {
        text: "Connect wallet",
        fn: connect,
      };
    else if (!isSupportedChain)
      return {
        text: "Connect to Arbitrum",
        fn: () => switchNetwork(defaultChain),
      };
    else if (!isApproved)
      return {
        text: "Approve",
        fn: async () => {
          setInTx(true);
          await handleApprove();
          setInTx(false);
        },
      };
    else if (!+inputAmount)
      return {
        text: `Enter ${tokenName} amount`,
        fn: undefined,
      };
    else
      return {
        text: actionName,
        fn: async () => {
          setInTx(true);
          await onSubmit();
          setInTx(false);
        },
      };
  };

  const buttonState = getButtonState();
  const disableButton = !buttonState.fn || inTx || disabled;

  return (
    <Button
      size="2xl"
      w="full"
      onClick={buttonState.fn}
      disabled={disableButton}
      isLoading={inTx}
      loadingText="Pending"
      _loading={{ bg: "alert.300" }}
      {...buttonStyling}
    >
      {disabled ? disabledText : buttonState.text}
    </Button>
  );
};
