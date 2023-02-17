import { FC } from "react";

import { Box, Flex, Progress, ProgressProps, Text, useTheme } from "@chakra-ui/react";

import { getJonesColor } from "../../theme/helpers";
import { renderPercentage } from "../../utils/numbers";

interface StyledProgressProps extends ProgressProps {
  value: number;
  valuePosition?: "top" | "end";
  title?: string;
}

export const StyledProgress: FC<StyledProgressProps> = ({
  value,
  valuePosition,
  title,
  ...rest
}) => {
  const { primaryGradient } = getJonesColor(useTheme());
  return (
    <Box w="full" data-test="progress-bar">
      {title && (
        <Flex justifyContent="space-between" fontWeight="medium" alignItems="baseline">
          <Text fontSize="sm">{title}</Text>
          {valuePosition === "top" && <Text fontSize="xs">{renderPercentage(value)}</Text>}
        </Flex>
      )}
      <Flex mt={2} alignItems="center" w="full">
        <Progress
          borderRadius="xl"
          w="inherit"
          h={1.5}
          bg="black"
          value={Math.min(100, value)}
          sx={{
            "& > div": {
              background: primaryGradient,
            },
          }}
          {...rest}
        />
        {valuePosition === "end" && (
          <Text as="span" fontSize="sm" ml={3}>
            {renderPercentage(value)}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
