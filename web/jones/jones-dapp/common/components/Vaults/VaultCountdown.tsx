import React from "react";

import { Text, useTheme } from "@chakra-ui/react";

import { getJonesColor } from "../../theme/helpers";

function VaultCountdown({
  openDate,
  closeDate,
  managementWindowOpen,
}: {
  openDate: string;
  closeDate: string;
  managementWindowOpen: boolean;
}) {
  const { primaryGradientReverse } = getJonesColor(useTheme());
  const msNumerator = 1000 * 60 * 60 * 24;
  const now = Date.now();

  const daysToOpen = Math.ceil((new Date(openDate).getTime() - now) / msNumerator);
  const daysToClose = Math.ceil((new Date(closeDate).getTime() - now) / msNumerator);

  const title = () => {
    const getText = (daysLeft: number, prefix: string) => {
      switch (daysLeft) {
        case 0:
          return `${prefix} today`;
        case 1:
          return `${prefix} tomorrow`;
        default:
          return `${prefix} in ${daysLeft} days`;
      }
    };

    return daysToOpen >= 0 || managementWindowOpen
      ? getText(daysToOpen, "Opens")
      : getText(daysToClose, "Closes");
  };

  return (
    <Text bgGradient={primaryGradientReverse} bgClip="text" textAlign="center" mt={4} fontSize="sm">
      {title()}
    </Text>
  );
}

export default VaultCountdown;
