import { FC } from "react";

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Text,
  TextProps,
} from "@chakra-ui/react";

import { FarmV1, OldDepositState } from "@jones-dao/sdk";

import { renderNumber, renderUsd } from "../../utils/numbers";
import { unstakeOld, claimOld, exitOld } from "../../web3/staking";
import { Image } from "../Image";
import { InfoIconCustom } from "../../icons";

interface FarmProps extends FarmV1 {
  getFarmsPersonal: () => void;
}

const DeprecatedStakingPool: FC<FarmProps> = (props) => {
  const {
    farmName,
    deprecatedFarmAddress,
    getFarmsPersonal,
    tvl = 0,
    claimable = "0",
    claimableValue = 0,
    userStaked = "0",
    userStakedValue = 0,
    oldDepositState = 0,
  } = props;

  const buttonText = {
    [OldDepositState.CLAIM]: "Claim",
    [OldDepositState.DEPOSIT]: "Unstake",
    [OldDepositState.DEPOSIT_CLAIM]: "Claim and Unstake",
    [OldDepositState.NONE]: "Not available",
  };

  const handleUnstakeOld = async () => {
    if (deprecatedFarmAddress) {
      let txPromise;

      switch (oldDepositState) {
        case OldDepositState.CLAIM:
          txPromise = claimOld(deprecatedFarmAddress);
          break;
        case OldDepositState.DEPOSIT:
          txPromise = unstakeOld(deprecatedFarmAddress, userStaked);
          break;
        default:
          txPromise = exitOld(deprecatedFarmAddress);
      }

      const txSuccess = await txPromise;
      if (txSuccess) getFarmsPersonal();
    }
  };

  const FarmField = (props: TextProps) => (
    <Text position="relative" fontWeight="medium" fontSize={{ base: "sm", md: "md" }} {...props}>
      {props.children}
    </Text>
  );

  return (
    <AccordionItem bg="card.300" rounded="xl" border={0}>
      <AccordionButton
        textAlign="left"
        px={{ base: 2, md: 6 }}
        p={4}
        rounded="xl"
        textColor="white"
        display="grid"
        alignItems="center"
        w="full"
        gridTemplateColumns={{
          base: "repeat(8, minmax(0, 1fr))",
          md: "repeat(10, minmax(0, 1fr))",
        }}
      >
        <div className="relative flex justify-end">
          <Image
            src={`/staking/${farmName.toLowerCase()}.svg`}
            width={60}
            height={30}
            alt="staking-logo"
          />
        </div>

        <div className="col-span-3 ml-2">
          <FarmField fontWeight={{ base: "medium", md: "bold" }} minW="fit-content">
            {farmName}
          </FarmField>
        </div>

        <div className="md:hidden" />

        <div className="flex justify-end">
          <FarmField>N/A</FarmField>
        </div>

        <div className="hidden md:block" />

        <div className="hidden col-span-2 md:block">
          <FarmField>{renderUsd(tvl, 2)}</FarmField>
        </div>

        <div className="hidden md:block">
          <Box
            bg="alert.700"
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            textColor="white"
            rounded="full"
            fontSize="sm"
            fontWeight="semibold"
            py={{ base: 2, lg: 1 }}
            px={2}
            w="fit-content"
          >
            <InfoIconCustom mr={{ base: 0, lg: 2 }} />
            <Text display={{ base: "none", lg: "block" }}>Claim</Text>
          </Box>
        </div>

        <div className="col-span-2 md:col-span-1">
          <div className="flex items-end justify-end space-x-1">
            <Image src="/staking/hat-logo.svg" width={24} height={24} alt="logo" />
            <FarmField color="primary.700" fontSize="sm">
              {renderNumber(+claimable)}
            </FarmField>
          </div>
          <div className="mt-2">
            <FarmField fontSize="xs" color="gray.500" textAlign="right">
              {renderUsd(+claimableValue)}
            </FarmField>
          </div>
        </div>
      </AccordionButton>
      <AccordionPanel className="grid md:grid-cols-10">
        <div className="hidden md:block" />

        <div className="space-y-5 text-white md:pl-4 md:col-span-4">
          <div className="flex flex-col">
            <FarmField color="gray.500">Your stake</FarmField>

            <div className="flex justify-between">
              <FarmField>{farmName}</FarmField>
              <FarmField>{renderNumber(+userStaked)}</FarmField>
            </div>

            <div className="flex justify-between mt-1">
              <div />
              <FarmField color="gray.500">{renderUsd(+userStakedValue)}</FarmField>
            </div>
          </div>

          <Divider color="gray.500" />

          <div className="flex flex-col">
            <FarmField color="gray.500">Claimable</FarmField>

            <div className="flex justify-between">
              <FarmField>JONES</FarmField>
              <FarmField color="primary.700">{renderNumber(+claimable)}</FarmField>
            </div>
          </div>

          <Divider color="gray.500" />
        </div>

        <div className="flex flex-col mt-4 space-y-4 md:ml-auto md:mr-20 md:col-span-5">
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
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default DeprecatedStakingPool;
