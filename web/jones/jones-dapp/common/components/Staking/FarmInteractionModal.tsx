import React, { FC, useEffect, useState } from "react";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Box,
} from "@chakra-ui/react";
import { addresses } from "@jones-dao/sdk";

import { ArrowUpRightIcon } from "../../icons";
import { formatToDecimals, renderNumber, renderPercentage } from "../../utils/numbers";
import { InteractionButton } from "../InteractionButton";
import { TokenInput } from "../TokenInput";

interface StakingsModalProps {
  title: string;
  showModal: boolean;
  closeModal: () => void;
  onSubmit: (inputAmount: string) => Promise<boolean | void>;
  inputError: string;
  setInputError: (error: string) => void;
  maxBalance: string;
  provideUrl: string;
  isSingleStaking: boolean;
  farmName: string;
  apr: number;
  lpToken?: string;
}

const FarmInteractionModal: FC<StakingsModalProps> = ({
  title,
  showModal,
  closeModal,
  onSubmit,
  inputError,
  maxBalance,
  setInputError,
  farmName,
  provideUrl,
  apr,
  isSingleStaking,
  lpToken,
}) => {
  const [inputAmount, setInputAmount] = useState("0");

  useEffect(() => {
    if (!+inputAmount) setInputError("");
  }, [inputAmount, setInputError]);

  const handleSubmit = async () => {
    const txSuccess = await onSubmit(inputAmount);
    if (txSuccess) setInputAmount("");
  };

  return (
    <Modal isCentered isOpen={showModal} onClose={closeModal}>
      <Box data-test="farm-interaction-modal">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
        <ModalContent bg="gray.800" p={8} color="white">
          <ModalHeader fontSize="3xl" textAlign="center" fontWeight="bold">
            {title}
          </ModalHeader>
          <ModalCloseButton color="primary.700" data-test="farm-interaction-close" />
          <ModalBody>
            <Stack spacing={6}>
              <TokenInput
                maxInput={maxBalance}
                inputAmount={inputAmount}
                setInputAmount={setInputAmount}
                inputError={inputError}
                placeholder={`Enter ${farmName} amount`}
              />

              <InteractionButton
                onSubmit={handleSubmit}
                spenderAddress={addresses.MILLINER}
                actionName={title}
                inputAmount={inputAmount}
                tokenName={farmName}
                tokenAddress={lpToken}
                requireApprove={!!lpToken}
              />

              <div>
                <div className="flex justify-between text-sm">
                  <p>You will {title.toLowerCase()}</p>

                  <p>
                    {renderNumber(formatToDecimals(+inputAmount))} {farmName}
                  </p>
                </div>

                {apr !== undefined && (
                  <div className="flex justify-between mt-2 text-sm">
                    <p>Current APR</p>

                    <p>{renderPercentage(+apr)}</p>
                  </div>
                )}
              </div>
            </Stack>

            <div className="flex justify-center mt-10 space-x-8 text-xs sm:space-x-16">
              <a href={provideUrl} target="_blank" rel="noreferrer">
                <div className="flex items-center space-x-1 text-jones-gray">
                  <span>{isSingleStaking ? `Get more ${farmName}` : "Add liquidity"}</span>
                  <ArrowUpRightIcon />
                </div>
              </a>

              <a href="https://docs.jonesdao.io/jones-dao/" target="_blank" rel="noreferrer">
                <div className="text-blue-500">Need Help?</div>
              </a>
            </div>
          </ModalBody>
        </ModalContent>
      </Box>
    </Modal>
  );
};

export default FarmInteractionModal;
