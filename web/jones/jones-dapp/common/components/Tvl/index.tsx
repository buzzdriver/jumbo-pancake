import { Box, Flex, Text } from "@chakra-ui/react";

import { renderUsd } from "../../utils/numbers";
import { Card } from "../Card";

export const Tvl = ({ tvl, rightIcon }: { tvl: number; rightIcon?: JSX.Element }) => (
  <Card py={6} px={{ base: 4, sm: 12 }} mt={{ base: 4, sm: 6 }} data-test="tvl">
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="semibold">
          {renderUsd(tvl, 0)}
        </Text>
        <Text mt={1} fontWeight={400} fontSize="sm" color="gray.500">
          Total Value Locked
        </Text>
      </Box>
      {rightIcon && <Box>{rightIcon}</Box>}
    </Flex>
  </Card>
);
