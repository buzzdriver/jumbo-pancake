import { useTheme } from "@chakra-ui/react";

import { getJonesColor } from "../theme/helpers";

export const useLineColors = (): string[] => {
  const { warningDark, purpleLight, successMain, alertPending } = getJonesColor(useTheme());
  return [warningDark, purpleLight, successMain, alertPending];
};
