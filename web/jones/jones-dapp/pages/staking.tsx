import { useEffect } from "react";

import { Accordion, Box, Button, Center, Stack, Text } from "@chakra-ui/react";
import { farms as farmsStatic } from "@jones-dao/sdk";
import clsx from "clsx";

import Disclaimer from "../common/components/Disclaimer";
import Layout from "../common/components/Layout";
import { PageTitle } from "../common/components/PageTitle";
import { StakingFooter, StakingPool } from "../common/components/Staking";
import { StakingOldDepositsInfoBanner } from "../common/components/Staking/banners/v1-old-deposits";
import DeprecatedStakingPool from "../common/components/Staking/DeprecatedStakingPool";
import { StyledSkeleton } from "../common/components/Styled/StyledSkeleton";
import StyledTooltip from "../common/components/Styled/StyledTooltip";
import { Tvl } from "../common/components/Tvl";
import { useStore } from "../common/store";
import { harvest } from "../common/web3/staking";
import { InfoIconCustom } from "../common/icons";

function Staking() {
  const {
    web3Data: {
      state: { address, isSupportedChain },
    },
    staking: {
      state: {
        farms,
        farmsTvl,
        farmsLoading,
        farmsUserDataLoading,
        userHasOldDeposit,
        deprecatedFarms,
      },
      actions: { getFarmsGeneral, getFarmsPersonal, getSingleFarm },
    },
    marketPrices: {
      state: { timestampLast },
    },
  } = useStore(({ web3Data, staking, marketPrices }) => ({
    web3Data,
    staking,
    marketPrices,
  }));

  const userClaimablePools = farms.filter((farm) => farm.claimableValue);

  const harvestAll = async () => {
    for (const { poolId } of userClaimablePools) {
      const txSuccess = await harvest(poolId);
      if (txSuccess) {
        getSingleFarm(poolId);
      } else {
        break;
      }
    }
  };

  useEffect(() => {
    // data displayed depends on market prices. No point in fetching staking without these
    if (!farms.length && timestampLast) getFarmsGeneral();
  }, [farms.length, getFarmsGeneral, timestampLast]);

  useEffect(() => {
    if (address && farms.length && isSupportedChain) getFarmsPersonal();
  }, [address, farms.length, getFarmsPersonal, isSupportedChain]);

  const showClaimAll = userClaimablePools.length !== 0;

  return (
    <Layout title="Staking">
      {userHasOldDeposit && <StakingOldDepositsInfoBanner />}
      <PageTitle title="Staking" />
      <Tvl tvl={farmsTvl} />

      {showClaimAll && (
        <div className="flex justify-end px-4 mt-4 md:mt-8">
          <Button variant="secondary" size={"sm"} onClick={harvestAll}>
            <Text fontSize="xs">{`Claim All (${userClaimablePools.length})`}</Text>
          </Button>
        </div>
      )}

      <div
        className={clsx(
          "w-full grid-cols-8 md:grid-cols-10 px-3 md:px-6 font-semibold text-left transform text-jones-gray text-xs md:text-sm items-center rounded-xl grid text-[#646262] md:text-white",
          showClaimAll ? "mt-4 md:mt-10" : "mt-4 md:mt-16",
        )}
        data-test="staking-pool-header"
      >
        <div className="col-span-4" />
        <p className="md:hidden"></p>
        <div className="flex justify-end space-x-1">
          <p className="text-right">APR</p>
          <div data-test="staking-pool-tooltip">
            <StyledTooltip
              label={
                <div className="space-y-2">
                  <Text>
                    <strong>Staking APR</strong> is the annual yield, expressed in percentages.
                  </Text>
                  <Text>
                    The APR shown is based on the projected data, assuming the options will expire
                    out of the money and the collateral will be fully utilized.
                  </Text>
                  <Text>
                    The indicative APR is not guaranteed as is subject to market risk. The
                    strategies are not risk-free, and some epochs may result in a negative return.
                  </Text>
                </div>
              }
            >
              <Center>
                <InfoIconCustom />
              </Center>
            </StyledTooltip>
          </div>
        </div>

        <div className="hidden md:block" />
        <p className="hidden col-span-2 md:grid">TVL</p>
        <p className="col-span-2 text-right">CLAIMABLE</p>
      </div>

      <Stack mt={5} spacing={2}>
        {farmsLoading || !farms.length ? (
          Array.from({ length: farmsStatic.length }, (_, i) => i).map((sf) => (
            <StyledSkeleton key={sf} h={20} rounded="xl" />
          ))
        ) : (
          <>
            {farms.map((f) => (
              <Accordion key={f.farmName} allowToggle>
                <StakingPool {...f} userDataLoading={farmsUserDataLoading} />
              </Accordion>
            ))}
            {deprecatedFarms.length > 0 && (
              <Box mt={4} data-test="deprecated-pool">
                <Text position="relative" fontSize="lg" fontWeight="bold">
                  Deprecated
                </Text>
                {deprecatedFarms.map((f) => (
                  <Accordion key={f.farmName} allowToggle>
                    <DeprecatedStakingPool {...f} getFarmsPersonal={getFarmsPersonal} />
                  </Accordion>
                ))}
              </Box>
            )}
          </>
        )}
      </Stack>
      <StakingFooter />
      <Disclaimer />
    </Layout>
  );
}

export default Staking;
