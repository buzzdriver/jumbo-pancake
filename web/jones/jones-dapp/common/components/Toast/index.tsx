import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  Slide,
  Text,
  useBreakpointValue,
  UseToastOptions,
} from "@chakra-ui/react";

import { ArrowUpRightIcon } from "../../icons";
import { theme } from "../../theme";
import { getJonesColor } from "../../theme/helpers";
import { Image } from "../Image";

export enum ToastStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  ERROR = "error",
}

interface ToastProps {
  toastStatus: ToastStatus;
  closeToast: () => void;
  title: string;
  description?: string;
  action?: React.ReactNode;
  txHash?: string;
}

const Toast = ({ toastStatus, closeToast, title, description, action, txHash }: ToastProps) => {
  const { alertPending, errorDark, successMain } = getJonesColor(theme);
  const top = useBreakpointValue({ base: 0, md: 64 });

  const toastValues: { [token in ToastStatus]: { bg: string; icon: () => JSX.Element } } = {
    [ToastStatus.CONFIRMED]: {
      bg: successMain,
      icon: () => (
        <Image width={16} height={16} src="/icons/Icon_Confirmed.svg" alt="ConfirmedLogo" />
      ),
    },
    [ToastStatus.ERROR]: {
      bg: errorDark,
      icon: () => <Image width={16} height={16} src="/icons/Icon_Error.svg" alt="ErrorLogo" />,
    },
    [ToastStatus.PENDING]: {
      bg: alertPending,
      icon: () => (
        <Image
          width={16}
          height={16}
          className="animate-spin"
          src="/icons/Icon_Pending-Spinner.svg"
          alt="PendingLogo"
        />
      ),
    },
  };

  const { bg, icon } = toastValues[toastStatus];

  return (
    <Slide
      in
      transition={{ enter: { duration: 0.6 }, exit: { duration: 1 } }}
      style={{ position: "relative", top, right: 32 }}
    >
      <Alert
        bg={bg}
        rounded="base"
        fontSize="sm"
        fontWeight="semibold"
        w="304px"
        minH={20}
        py={4}
        px={5}
      >
        <Flex align="start">
          <Box pt={1}>
            <AlertIcon as={icon} />
          </Box>
          <Box ml={4}>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription fontWeight="normal">{description}</AlertDescription>
            <Box>{action}</Box>
            <Box>
              {txHash && (
                <a href={"https://arbiscan.io/tx/" + txHash} target="_blank" rel="noreferrer">
                  <Button variant="link-white" rightIcon={<ArrowUpRightIcon />} iconSpacing={2}>
                    <Text fontWeight="semibold">View on Arbiscan</Text>
                  </Button>
                </a>
              )}
            </Box>
          </Box>
        </Flex>
        <CloseButton onClick={closeToast} position="absolute" top={2} right={3} />
      </Alert>
    </Slide>
  );
};

export const getToastConfig = (
  id: number,
  toastProps: ToastProps,
  shouldHaveDuration: boolean,
): UseToastOptions => ({
  position: "top-right",
  isClosable: true,
  duration: shouldHaveDuration ? 10_000 : null,
  id,
  render: () => <Toast {...toastProps} />,
});
