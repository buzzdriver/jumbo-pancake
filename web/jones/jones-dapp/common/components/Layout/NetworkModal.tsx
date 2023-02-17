import React, { FC } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { useStore } from "../../store";

import { displayChainIds, supportedChains, switchNetwork } from "../../utils/network";
import { Image } from "../Image";

const NetworkModal: FC = () => {
  const {
    state: { networkModalOpen },
    actions: { showNetworkModal },
  } = useStore((state) => state.feedbackComponents);

  return (
    <Modal
      isOpen={networkModalOpen}
      isCentered
      onClose={() => {
        showNetworkModal(false);
      }}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg="gray.800" p={8} color="white" mx={2}>
        <ModalHeader fontSize="3xl" fontWeight="extrabold">
          Supported networks
        </ModalHeader>
        <ModalCloseButton color="primary.700" />
        <ModalBody>
          <Text>Select from:</Text>
          <div className="grid grid-cols-2 mt-6 gap-x-4">
            {displayChainIds.map((chainId) => (
              <Button
                variant="secondary"
                key={chainId}
                onClick={async () => {
                  await switchNetwork(supportedChains[chainId].chainId);
                }}
                size="xl"
                leftIcon={
                  <Image
                    src={`/logo/${supportedChains[chainId].icon}.svg`}
                    width={24}
                    height={24}
                    alt={`${supportedChains[chainId].name} logo`}
                  />
                }
              >
                <Text>{supportedChains[chainId].name}</Text>
              </Button>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NetworkModal;
