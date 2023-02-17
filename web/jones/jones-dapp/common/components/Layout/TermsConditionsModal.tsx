import React, { FC, useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { useStore } from "../../store";

import config from "../../config";
import TermsText from "./TermsText";

const TermsConditions: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const {
    state: { address },
  } = useStore((state) => state.web3Data);
  const listInnerRef = useRef<HTMLDivElement>(null);

  const handleAccept = () => {
    window.localStorage.setItem(config.termsConditionsVersion, JSON.stringify(true));
    onClose();
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const margin = 1.05; // for zoomed in screens
      if ((scrollTop + clientHeight) * margin >= scrollHeight) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }
  };

  useEffect(() => {
    const storedTerms =
      typeof window !== "undefined" && window.localStorage.getItem(config.termsConditionsVersion);
    const userAcceptedTerms = storedTerms && JSON.parse(storedTerms);

    if (!userAcceptedTerms && address && !isOpen) {
      onOpen();
    }
  }, [address, isOpen, onOpen]);

  const scrollbarStyle = {
    width: 1,
    borderRadius: "md",
  };

  const sidePadding = { base: 8, sm: 12 };

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <Box zIndex="1600" position="absolute" data-test="terms-conditions-modal">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />

        <ModalContent
          bg="gray.800"
          height={"calc(100% - 7.5rem)"}
          maxH="880px"
          maxW="660px"
          rounded="xl"
          mx={{ base: 4, sm: 14 }}
          pr={{ base: 4, sm: 5 }}
        >
          <ModalHeader fontSize="2xl" fontWeight="600" py={9} px={sidePadding}>
            Terms of Service
          </ModalHeader>

          <ModalBody
            sx={{
              "&::-webkit-scrollbar": {
                ...scrollbarStyle,
                backgroundColor: "#1F1F1F",
              },

              "&::-webkit-scrollbar-thumb": {
                ...scrollbarStyle,
                backgroundColor: "gray.500",
              },
            }}
            onScroll={onScroll}
            ref={listInnerRef}
            py={4}
            pl={sidePadding}
            pr={{ base: 8, sm: 7 }}
            data-test="terms-popup-body"
          >
            <TermsText withAccept />
          </ModalBody>

          <ModalFooter display="flex" justifyContent="flex-start" py={8} px={sidePadding}>
            <Button
              onClick={handleAccept}
              size="xl"
              width={{ base: "100%", sm: "fit-content" }}
              disabled={buttonDisabled}
              data-test="accept-terms-button"
            >
              Accept Terms
            </Button>
          </ModalFooter>
        </ModalContent>
      </Box>
    </Modal>
  );
};

export default TermsConditions;
