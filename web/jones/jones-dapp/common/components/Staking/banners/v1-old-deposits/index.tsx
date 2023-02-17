import { useState } from "react";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Text,
} from "@chakra-ui/react";
import { OldDepositState } from "@jones-dao/sdk";

import { ArrowUpRightIcon, InfoIconCustom } from "../../../../icons";
import { renderNumber } from "../../../../utils/numbers";

export const StakingOldDepositsInfoBanner = () => {
  const [showOldDepositsBanner, setShowOldDepositsBanner] = useState(true);

  return !showOldDepositsBanner ? null : (
    <Alert
      colorScheme="alert.700"
      textColor="white"
      rounded="lg"
      py={4}
      my={12}
      alignItems="flex-start"
    >
      <AlertIcon as={InfoIconCustom} />
      <Box>
        <AlertTitle fontSize="sm" fontWeight="semibold">
          You have assets staked in the older staking contract that require migration
        </AlertTitle>
        <AlertDescription fontSize="sm">
          To migrate please use the Claim and Unstake button. All pending rewards will be claimed
          automatically. Then you may Stake again to migrate to v2 contracts.
        </AlertDescription>
        <a
          href="https://jonesdao.ghost.io/farm-migration-emissions-reduction-guide/"
          target="_blank"
          rel="noreferrer"
        >
          <Button mt={3} display="block" variant="link-white" rightIcon={<ArrowUpRightIcon />}>
            Learn
          </Button>
        </a>
      </Box>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={() => setShowOldDepositsBanner(false)}
      />
    </Alert>
  );
};

export const StakingOldDepositsUnstakeBanner = ({
  oldDeposit,
  oldClaim,
  handleUnstakeOld,
  oldDepositState,
  tokenName,
}: {
  oldDeposit: string;
  oldClaim: string;
  handleUnstakeOld: () => void;
  oldDepositState: OldDepositState;
  tokenName: string;
}) => {
  const bold = (v: string) => <strong>{v}</strong>;

  const OldClaim = () => <strong>{renderNumber(+oldClaim, 4)}</strong>;
  const OldDeposit = () => (
    <>
      <strong>{renderNumber(+oldDeposit, 4)}</strong> of your <strong>{tokenName}</strong>
    </>
  );

  const buttonText = {
    [OldDepositState.CLAIM]: "Claim",
    [OldDepositState.DEPOSIT]: "Unstake",
    [OldDepositState.DEPOSIT_CLAIM]: "Claim and Unstake",
    [OldDepositState.NONE]: "Not available",
  };
  const unstakeText = {
    [OldDepositState.CLAIM]: (
      <>
        The previous contract holds <OldClaim /> of your <strong>$JONES</strong> reward(s). To
        migrate please click the {bold(buttonText[oldDepositState])} button. After claiming you may
        stake again to migrate to v2 contracts.
      </>
    ),
    [OldDepositState.DEPOSIT]: (
      <>
        The previous contract holds <OldDeposit /> token(s). To migrate please click the{" "}
        {bold(buttonText[oldDepositState])} button. After claiming you may stake again to migrate to
        v2 contracts.
      </>
    ),
    [OldDepositState.DEPOSIT_CLAIM]: (
      <>
        The previous contract holds <OldDeposit /> token(s), and <OldClaim />{" "}
        <strong>$JONES</strong> reward(s). To migrate please click the{" "}
        {bold(buttonText[oldDepositState])} button (pending rewards are claimed automatically).
        After claiming & unstaking you may stake again to migrate to v2 contracts.
      </>
    ),
    [OldDepositState.NONE]: "Not available",
  };

  return (
    <Alert
      colorScheme="alert.700"
      textColor="white"
      rounded="3xl"
      minH={36}
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "center", md: "flex-start" }}
      justifyContent="space-between"
      py={4}
      border="1px white solid"
    >
      <Box display="flex" w={{ base: "100%", md: "65%" }}>
        <AlertIcon as={InfoIconCustom} />
        <Box>
          <AlertTitle fontSize="sm" fontWeight="semibold">
            How to migrate to the new v2 staking contract
          </AlertTitle>
          <AlertDescription fontSize="sm">{unstakeText[oldDepositState]}</AlertDescription>

          <a href="https://docs.jonesdao.io/jones-dao/" target="_blank" rel="noreferrer">
            <Button mt={4} display="block" variant="link-white" rightIcon={<ArrowUpRightIcon />}>
              Learn
            </Button>
          </a>
        </Box>
      </Box>

      <Button
        variant="primary"
        size="xl"
        minW={52}
        h={14}
        onClick={handleUnstakeOld}
        mt={{ base: 4, md: 0 }}
      >
        <Text>{buttonText[oldDepositState]}</Text>
      </Button>
    </Alert>
  );
};
