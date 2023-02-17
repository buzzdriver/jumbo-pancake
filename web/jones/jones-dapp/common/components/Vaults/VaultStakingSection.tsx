import React, { useContext, useEffect } from "react";

import { Button, Center, Flex, Heading, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { VaultContext } from "../../context";
import { useStore } from "../../store";

import config from "../../config";
import { addTokenToWallet } from "../../utils/network";
import { renderPercentage } from "../../utils/numbers";
import { Card } from "../Card";
import { Image } from "../Image";
import StyledTooltip from "../Styled/StyledTooltip";
import { InfoIconCustom } from "../../icons";

const VaultStakingSection = () => {
  const { vaultName, jAssetAddress, jAssetPictureUrl, apy } = useContext(VaultContext);
  const {
    staking: { state, actions },
    marketPrices: {
      state: { timestampLast },
    },
  } = useStore();

  const router = useRouter();

  useEffect(() => {
    // data displayed depends on market prices. No point in fetching staking without these
    if (timestampLast) {
      actions.getFarmsGeneral();
    }
  }, [actions, timestampLast]);

  const farm = state.farms.find((farm) =>
    farm.farmName.toLowerCase().includes(`j${vaultName?.toLowerCase()}`),
  );

  const addToken = () => {
    jAssetAddress && addTokenToWallet(jAssetAddress, `j${vaultName}`, jAssetPictureUrl);
  };

  const goToStaking = () => {
    router.push("/staking");
  };

  const roiList = vaultName ? Object.values(config.vaultData[vaultName].roi) : [0];
  const avgVaultRoi = roiList.reduce((a, b) => a + b) / roiList.length / 100;
  const farmAprMonthly = Number(farm?.apr) / 12 / 100;
  const combinedRoi = avgVaultRoi / 2 + farmAprMonthly;
  const combinedYield = ((1 + combinedRoi) ** 12 - 1) * 100;

  return (
    <Card
      pt={{ base: 2, sm: 6, lg: 8 }}
      px={{ base: 4, sm: 8, lg: 12 }}
      pb={2}
      data-test="vault-staking-section"
    >
      <Stack spacing={6}>
        <Heading fontWeight="semibold" size="xs">
          {"What's next?"}
        </Heading>

        <Text color="gray.500" fontSize="xs">
          Stake your j{vaultName} in one of the LP staking pools to earn additional yield in $JONES
          tokens.
        </Text>

        <Button
          variant="secondary"
          size="lg"
          onClick={addToken}
          leftIcon={<Image src="/logo/metamask.svg" width={24} height={24} alt="metamask-logo" />}
          disabled={!jAssetAddress}
          w="max-content"
        >
          <Text>{`Add $j${vaultName} to Metamask`}</Text>
        </Button>

        <Heading fontWeight="semibold" size="xs">
          Introducing Combined Yield
        </Heading>

        <Text color="gray.500" fontSize="xs">
          Our Combined Yield strategy (or the jOnion as we have dubbed it - yield with many layers)
          exists to offset risk for Jones Vault users. By depositing 50% of your tokens into the
          vault and making an LP pair with the other 50%, you can maximize yield rewards and earn
          that sweet $JONES token.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Card pt={6} pb={12} px={8} bg="card.300" data-test="vault-apy-card">
            <Stack spacing={4} align="center">
              <HStack align="baseline">
                <Text color="gray.500" fontSize="sm" fontWeight="medium">
                  Avg. Historical yield APY
                </Text>
                <StyledTooltip
                  label={
                    <Stack spacing={2}>
                      <Text>
                        <strong>Historical Yield</strong> represents annual percentage yield. It is
                        a calculation of the rate of return based on the current historical average
                        of monthly epochs.
                      </Text>

                      <Text>
                        The APY shown is based on projected data, assuming the options will expire
                        out of the money and the collateral will be fully utilized.
                      </Text>
                      <Text>
                        The indicative APY is not guaranteed and is subject to market risk. The
                        strategies are not risk-free, and some epochs may result in a negative
                        return.
                      </Text>
                    </Stack>
                  }
                >
                  <InfoIconCustom boxSize={3} color="gray.500" />
                </StyledTooltip>
              </HStack>

              <Heading fontWeight="semibold" size="xs">
                {renderPercentage(apy)}
              </Heading>
              <Flex w="full" justify="center" align="center">
                <Image
                  src={`/logo/${vaultName?.toLowerCase()}.svg`}
                  width={40}
                  height={40}
                  alt="token-logo"
                />
                <Text ml={4} fontWeight="semibold">
                  {vaultName}
                </Text>
              </Flex>
            </Stack>
          </Card>
          <Card
            py={6}
            px={8}
            bg="card.300"
            cursor="pointer"
            onClick={goToStaking}
            data-test="vault-apy-card"
          >
            <Stack spacing={4} align="center">
              <HStack align="baseline">
                <Text color="gray.500" fontSize="sm" fontWeight="medium">
                  Combined yield APY
                </Text>
                <StyledTooltip
                  label={`An estimate of the percentage yield given a strategy where the user offsets risk by depositing 50% of their tokens into the jAsset vault and the other 50% into our staking farms.`}
                >
                  <InfoIconCustom boxSize={3} color="gray.500" />
                </StyledTooltip>
              </HStack>

              <Heading fontWeight="semibold" size="xs">
                {renderPercentage(combinedYield)}
              </Heading>
              <Flex w="full" justify="space-between">
                <Center>
                  <Image
                    src={`/staking/${farm?.farmName.toLowerCase()}.png`}
                    width={70}
                    height={40}
                    alt="farm-logo"
                  />
                  <Text ml={4} fontWeight="semibold">
                    {farm?.farmName}
                  </Text>
                </Center>
                <Stack align="end" spacing={0}>
                  <Text fontSize="xl" fontWeight="semibold">
                    {renderPercentage(farm?.apr)}
                  </Text>
                  <Text fontSize="xs" fontWeight="medium">
                    APR
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Card>
  );
};
export default VaultStakingSection;
