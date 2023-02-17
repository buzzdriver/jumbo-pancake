import { Center, HStack, Stack, Text } from "@chakra-ui/react";
import { InfoIconCustom } from "../../icons";

import { renderPercentage } from "../../utils/numbers";
import StyledTooltip from "../Styled/StyledTooltip";

export const VaultApyTooltip = ({ apy }: { apy: number | undefined }) => (
  <HStack spacing={2.5} align="baseline">
    <Text fontSize="sm" fontWeight="semibold">
      {renderPercentage(apy, 2, "-%")} APY
    </Text>
    <StyledTooltip
      label={
        <Stack spacing={2}>
          <Text>
            <strong>Historical Yield</strong> represents annual percentage yield. It is a
            calculation of the rate of return based on the current historical average of monthly
            epochs.
          </Text>

          <Text>
            The APY shown is based on projected data, assuming the options will expire out of the
            money and the collateral will be fully utilized.
          </Text>
          <Text>
            The indicative APY is not guaranteed and is subject to market risk. The strategies are
            not risk-free, and some epochs may result in a negative return.
          </Text>
        </Stack>
      }
    >
      <Center>
        <InfoIconCustom boxSize={3} />
      </Center>
    </StyledTooltip>
  </HStack>
);

export const PrevEpochApyTooltip = ({ apy }: { apy: number | undefined }) => (
  <HStack spacing={2.5} align="baseline">
    <Text fontSize="sm" fontWeight="semibold">
      {renderPercentage(apy, 2, "-%")} APY
    </Text>
    <StyledTooltip
      label={
        <Stack spacing={2}>
          <Text>
            <strong>Previous epoch APY</strong> represents an annualized version of the previous
            epoch’s percentage yield.
          </Text>
          <Text>
            The APY shown is indicative and based on the projected data, assuming the options will
            expire out of the money and the collateral will be fully utilized.
          </Text>
          <Text>
            The indicative APY is not guaranteed and is subject to market risk. The strategies are
            not risk-free, and some epochs may result in a negative return.
          </Text>
        </Stack>
      }
    >
      <Center>
        <InfoIconCustom boxSize={3} />
      </Center>
    </StyledTooltip>
  </HStack>
);
