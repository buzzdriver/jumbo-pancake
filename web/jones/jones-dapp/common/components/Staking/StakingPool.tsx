import { FC, useState } from "react";

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonProps,
  Center,
  Divider,
  Text,
  TextProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Farm, OldDepositState } from "@jones-dao/sdk";

import { useStore } from "../../store";
import { defaultChain } from "../../store/web3Data";

import { useWeb3Modal } from "../../hooks/useWeb3Modal";
import { ArrowUpRightIcon, InfoIconCustom } from "../../icons";
import { switchNetwork } from "../../utils/network";
import { renderNumber, renderPercentage, renderUsd } from "../../utils/numbers";
import { claimOld, compound, exitOld, harvest, unstakeOld } from "../../web3/staking";
import { Image } from "../Image";
import { StyledSkeleton } from "../Styled/StyledSkeleton";
import StyledTooltip from "../Styled/StyledTooltip";
import { StakeModal, UnstakeModal } from "./";
import { StakingOldDepositsUnstakeBanner } from "./banners/v1-old-deposits";

interface FarmProps extends Farm {
  userDataLoading: boolean;
}

const FarmPool: FC<FarmProps> = (props) => {
  const {
    farmName,
    deprecatedFarmAddress,
    isSingleStaking,
    totalStakedValue,
    tokenPair,
    userDataLoading,
    poolId,
    buyUrl,
    apr,
    claimable = "0",
    claimableValue = 0,
    userStaked = "0",
    userStakedValue = 0,
    oldDeposit = "0",
    oldClaim = "0",
    oldDepositState = 0,
  } = props;

  const {
    web3Data: {
      state: { address, isSupportedChain },
    },
    staking: {
      actions: { getSingleFarm },
    },
  } = useStore(({ staking, web3Data }) => ({ staking, web3Data }));

  const { connect } = useWeb3Modal();
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const userHasPreviousDeposit = oldDepositState !== OldDepositState.NONE;

  const handleClaim = async () => {
    const txSuccess = await harvest(poolId);
    if (txSuccess) getSingleFarm(poolId);
  };

  const handleCompound = async () => {
    const txSuccess = await compound(poolId);
    if (txSuccess) getSingleFarm(poolId);
  };

  const handleUnstakeOld = async () => {
    if (deprecatedFarmAddress) {
      let txPromise;

      switch (oldDepositState) {
        case OldDepositState.CLAIM:
          txPromise = claimOld(deprecatedFarmAddress);
          break;
        case OldDepositState.DEPOSIT:
          txPromise = unstakeOld(deprecatedFarmAddress, oldDeposit);
          break;
        default:
          txPromise = exitOld(deprecatedFarmAddress);
      }

      const txSuccess = await txPromise;
      if (txSuccess) getSingleFarm(poolId);
    }
  };

  const FarmField = (props: TextProps) => (
    <Text position="relative" fontWeight="medium" fontSize={{ base: "sm", md: "md" }} {...props}>
      {props.children}
    </Text>
  );

  const PersonalData = (props: TextProps) => (
    <StyledSkeleton isLoaded={!userDataLoading} minW={18}>
      <FarmField textAlign="right" {...props}>
        {props.children}
      </FarmField>
    </StyledSkeleton>
  );

  const FarmButton = (props: ButtonProps & { title: string }) => (
    <Button
      variant={props.variant || "secondary"}
      size={useBreakpointValue({ base: "sm", sm: "xl" })}
      minW={52}
      {...props}
    >
      <Text>{props.title}</Text>
    </Button>
  );

  const breakPointsConnect = useBreakpointValue({ base: "lg", sm: "xl" });

  const CompoundToolTip = () => {
    return (
      <StyledTooltip
        label={
          <Text>
            <strong>Compound</strong> will claim all assets and stake in one contract. If you wish
            to topup with a stake please use stake independently.
          </Text>
        }
      >
        <Center>
          <InfoIconCustom />
        </Center>
      </StyledTooltip>
    );
  };

  const ConnectOrStake = () => {
    return (
      <>
        {!address ? (
          <FarmButton
            onClick={connect}
            title="Connect wallet"
            variant="primary"
            size={breakPointsConnect}
          />
        ) : !isSupportedChain ? (
          <FarmButton
            onClick={() => switchNetwork(defaultChain)}
            title="Connect to Arbitrum"
            variant="primary"
            size={breakPointsConnect}
          />
        ) : (
          <>
            <FarmButton
              onClick={() => setShowStakeModal(true)}
              title="Stake"
              data-test="Stake-btn"
            />
            <FarmButton onClick={handleClaim} title="Claim" disabled={!Number(claimable)} />
            {isSingleStaking && (
              <FarmButton
                onClick={handleCompound}
                title="Compound"
                rightIcon={<CompoundToolTip />}
                disabled={!Number(claimable)}
              />
            )}
            <FarmButton
              onClick={() => setShowUnstakeModal(true)}
              title="Unstake"
              data-test="Unstake-btn"
            />
          </>
        )}
      </>
    );
  };

  const [expandedPanel, setExpandedPanel] = useState(false);

  const widthHeightRatio = 165 / 96;
  const imageHeight = useBreakpointValue({ base: "24px", sm: "32px" });
  const imageWidth = useBreakpointValue({
    base: `${widthHeightRatio * 24}px`,
    sm: `${32 * widthHeightRatio}px`,
  });

  return (
    <Box data-test="staking-pool" position="relative">
      <AccordionItem
        bg={expandedPanel ? "#00000099" : "card.600"}
        backdropFilter="auto"
        backdropBlur={expandedPanel ? "60px" : 100}
        rounded="xl"
        border={0}
      >
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
          onClick={() => setExpandedPanel(!expandedPanel)}
        >
          <div className="relative flex justify-end">
            <Image
              src={`/staking/${farmName.toLowerCase()}.png`}
              width={isSingleStaking ? imageHeight : imageWidth}
              height={imageHeight}
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
            <FarmField>{renderPercentage(+apr)}</FarmField>
          </div>
          <div className="hidden md:block" />
          <div className="hidden col-span-2 md:block">
            <FarmField>{renderUsd(+totalStakedValue)}</FarmField>
          </div>
          <div className="hidden md:block">
            {userHasPreviousDeposit && (
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
                <Text display={{ base: "none", lg: "block" }}>Migrate!</Text>
              </Box>
            )}
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-end justify-end space-x-1">
              <Image src="/staking/hat-logo.svg" width={24} height={24} alt="logo" />
              <PersonalData color="primary.700" fontSize="sm">
                {renderNumber(+claimable)}
              </PersonalData>
            </div>
            <div className="mt-2">
              <PersonalData fontSize="xs" color="gray.500">
                {renderUsd(+claimableValue)}
              </PersonalData>
            </div>
          </div>
        </AccordionButton>

        <AccordionPanel className="grid md:grid-cols-10">
          <div className="hidden md:block" />

          <div className="flex flex-col pb-3 mt-4 space-y-4 md:hidden md:ml-auto md:mr-20 md:col-span-5">
            <ConnectOrStake />
          </div>

          <div className="space-y-5 text-white md:pl-4 md:col-span-4">
            <div className="flex flex-col md:hidden">
              <FarmField color="gray.500">TVL</FarmField>

              <div className="flex justify-between">
                <FarmField>{farmName}</FarmField>
                <FarmField fontWeight="semibold">{renderUsd(+totalStakedValue)}</FarmField>
              </div>
            </div>

            <Divider display={{ base: "block", md: "none" }} color="gray.500" />

            <div className="flex flex-col">
              <FarmField color="gray.500">Your stake</FarmField>

              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <FarmField>{farmName}</FarmField>
                  <PersonalData>{renderNumber(+userStaked)}</PersonalData>
                </div>

                <div className="flex justify-between mt-1">
                  <div />
                  <PersonalData color="gray.500">{renderUsd(+userStakedValue)}</PersonalData>
                </div>

                {tokenPair && +userStaked > 0 && (
                  <>
                    <div className="flex justify-between">
                      <FarmField color="gray.500">{tokenPair.token0.symbol}</FarmField>
                      <PersonalData color="gray.500">
                        {renderNumber(tokenPair.token0.staked)}
                      </PersonalData>
                    </div>

                    <div className="flex justify-between">
                      <FarmField color="gray.500">{tokenPair.token1.symbol}</FarmField>
                      <PersonalData color="gray.500">
                        {renderNumber(tokenPair.token1.staked)}
                      </PersonalData>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Divider color="gray.500" />

            <div className="mt-2 text-xs">
              <a href={buyUrl} target="_blank" rel="noreferrer">
                <Button size="xs" variant="link-primary" rightIcon={<ArrowUpRightIcon />}>
                  {isSingleStaking ? `Get ${farmName}` : "Add liquidity"}
                </Button>
              </a>
            </div>
          </div>

          <div className="flex-col hidden mt-4 space-y-4 md:flex md:ml-auto md:mr-20 md:col-span-5">
            <ConnectOrStake />
          </div>

          {userHasPreviousDeposit && (
            <div className="mt-4 md:mx-16 md:col-span-10">
              <StakingOldDepositsUnstakeBanner
                handleUnstakeOld={handleUnstakeOld}
                oldDeposit={oldDeposit}
                oldClaim={oldClaim}
                oldDepositState={oldDepositState}
                tokenName={farmName}
              />
            </div>
          )}

          {showStakeModal && address && (
            <StakeModal
              address={address}
              getSingleFarm={getSingleFarm}
              showStakeModal={showStakeModal}
              closeStakeModal={() => setShowStakeModal(false)}
              stakingInfo={props}
            />
          )}
          {showUnstakeModal && address && (
            <UnstakeModal
              getSingleFarm={getSingleFarm}
              showUnstakeModal={showUnstakeModal}
              closeUnstakeModal={() => setShowUnstakeModal(false)}
              stakingInfo={props}
            />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};

export default FarmPool;
