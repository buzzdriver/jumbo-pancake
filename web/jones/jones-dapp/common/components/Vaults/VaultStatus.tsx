import React, { useContext } from "react";

import { Box, BoxProps, HStack, Text, Wrap } from "@chakra-ui/react";

import { VaultContext } from "../../context";
import { useStore } from "../../store";

import config from "../../config";
import { renderNumber } from "../../utils/numbers";
import { VaultAutoRollingBadge } from "../Badge/VaultAutoRollingBadge";
import { VaultStatusBadge } from "../Badge/VaultStatusBadge";
import { Card } from "../Card";
import { StyledSkeleton } from "../Styled/StyledSkeleton";
import StyledTooltip from "../Styled/StyledTooltip";
import VaultCountdown from "./VaultCountdown";
import { InfoIconCustom } from "../../icons";

function VaultStatus() {
  const { managementWindowOpen = true, vaultName, tokenPerJAsset } = useContext(VaultContext);

  const {
    state: { loading },
  } = useStore((state) => state.vaults);

  const openText = (
    <Text fontSize="xs">
      <strong>Vaults are unlocked</strong> for deposits and claims, after a short period the vault
      is locked and will be turned over to our strategists for the month long epoch.
    </Text>
  );
  const closedText = (
    <Text fontSize="xs">
      <strong>Vaults will remain locked</strong> for claims and deposits until after the month long
      epoch has concurred.
    </Text>
  );

  const StatusIndicator = ({ active, ...boxProps }: { active: boolean } & BoxProps) => (
    <StyledTooltip label={managementWindowOpen ? closedText : openText} isDisabled={!active}>
      <Box
        h={1}
        position="relative"
        rounded="xl"
        bg={active ? "primary.700" : "gray.500"}
        cursor={active ? "pointer" : "default"}
        {...boxProps}
      />
    </StyledTooltip>
  );

  return (
    <Card
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={{ base: 2, sm: 6, lg: 8 }}
      data-test="vault-status"
    >
      <Box>
        <Text color="gray.200">Vault status</Text>
        <Wrap mt={1}>
          <Text fontSize="xl" fontWeight="semibold">
            {`Deposits and Claims are ${managementWindowOpen ? "closed" : "open"}`}
          </Text>
          <VaultAutoRollingBadge />
        </Wrap>
        <HStack mt={4} spacing={2}>
          <StyledSkeleton isLoaded={!loading}>
            <StatusIndicator w={4} active={!managementWindowOpen} />
          </StyledSkeleton>
          <StyledSkeleton isLoaded={!loading}>
            <StatusIndicator w={12} active={managementWindowOpen} />
          </StyledSkeleton>
        </HStack>
      </Box>

      <StyledSkeleton isLoaded={!!vaultName} fontSize={{ base: "sm", md: "md" }} minW="max-content">
        <Text color="gray.200">
          1 j{vaultName} ≈
          <StyledTooltip label="Current redemption rate - the ratio of 1 jAsset to a native asset equivalent when claimed from the vault.">
            <InfoIconCustom boxSize={3} ml={2} />
          </StyledTooltip>
        </Text>

        <Text fontWeight="semibold" mt={1}>
          {renderNumber(tokenPerJAsset)} {vaultName}
        </Text>
      </StyledSkeleton>

      <Box display={{ base: "none", md: "block" }} ml={2}>
        <VaultStatusBadge managementWindowOpen={managementWindowOpen} loading={loading} />
        {vaultName && (
          <VaultCountdown
            managementWindowOpen={managementWindowOpen}
            openDate={config.vaultData[vaultName].unlockDate}
            closeDate={config.vaultData[vaultName].lockDate}
          />
        )}
      </Box>
    </Card>
  );
}

export default VaultStatus;
