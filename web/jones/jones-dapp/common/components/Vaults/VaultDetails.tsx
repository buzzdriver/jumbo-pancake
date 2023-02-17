import React, { FC, useContext } from "react";

import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { VaultContext } from "../../context";

import { renderNumber } from "../../utils/numbers";
import { StyledDivider } from "../Styled/StyledDivider";
import { StyledProgress } from "../Styled/StyledProgress";
import { StyledSkeleton } from "../Styled/StyledSkeleton";
import StyledTooltip from "../Styled/StyledTooltip";
import { VaultApyTooltip, PrevEpochApyTooltip, VaultProductInfo } from "./";
import { InfoIconCustom } from "../../icons";

const VaultDetails: FC = () => {
  const {
    vaultName,
    userClaimable,
    percentageFilled = 0,
    totalDeposited,
    isCapSet,
    apy,
    prevEpochApy,
    vaultCap,
    loading,
    userDataLoading,
  } = useContext(VaultContext);

  return (
    <Stack spacing={6} p={{ base: 2, sm: 6, lg: 12 }} position="relative" data-test="vault-details">
      <Text fontSize="2xl" fontWeight="semibold">
        About {vaultName} Vault
      </Text>
      <Stack spacing={4}>
        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="semibold">
            Avg. historical yield
          </Text>
          <StyledSkeleton isLoaded={!loading}>
            <VaultApyTooltip apy={apy} />
          </StyledSkeleton>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="semibold">
            Previous epoch yield
          </Text>
          <StyledSkeleton isLoaded={!loading}>
            <PrevEpochApyTooltip apy={prevEpochApy} />
          </StyledSkeleton>
        </Flex>
      </Stack>
      <Text color="gray.500" fontSize="xs">
        Generates {vaultName} yield with an actively managed and hedged options strategy. Vault and
        strategy parameters are under the supervision of the DAO strategy team.
      </Text>
      <StyledSkeleton isLoaded={!loading}>
        <Flex alignItems="end">
          <Flex basis="70%">
            <StyledProgress
              value={!isCapSet ? 30 : percentageFilled}
              title="Vault filled"
              valuePosition="top"
            />
          </Flex>
          <Flex
            ml={10}
            basis="30%"
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="semibold"
            justify="end"
          >
            {renderNumber(totalDeposited, 2)}
            <Text mx={1}>/</Text>
            {!isCapSet ? "∞" : renderNumber(vaultCap)}
            <Text as="span" ml={1}>
              {vaultName}
            </Text>
          </Flex>
        </Flex>
      </StyledSkeleton>

      {userClaimable && (
        <>
          <StyledDivider />
          <Box>
            <Heading size="xs">My Vault</Heading>
            <Flex justify="space-between" fontSize="xs" mt={4}>
              <StyledTooltip
                label={`Based on the amount of j${vaultName} currently in you wallet`}
                placement="bottom-end"
              >
                <Text>
                  Claimable balance
                  <InfoIconCustom ml="2" />
                </Text>
              </StyledTooltip>

              <Flex>
                <StyledSkeleton minW={3} isLoaded={!loading && !userDataLoading} textAlign="right">
                  <Text>{renderNumber(+userClaimable)}</Text>
                </StyledSkeleton>
                <Text as="span" ml={1}>
                  {vaultName}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </>
      )}
      <VaultProductInfo />
    </Stack>
  );
};

export default VaultDetails;
