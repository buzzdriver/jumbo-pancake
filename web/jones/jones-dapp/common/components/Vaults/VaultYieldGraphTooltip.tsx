import { Box, HStack, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { CircleIcon } from "../../icons";
import { separateCamelCase } from "../../utils/helpers";
import { renderPercentage } from "../../utils/numbers";
import { Card } from "../Card";

export const VaultYieldGraphTooltip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload, label } = props;

  return (
    active &&
    payload?.length && (
      <Card py={5} px={4}>
        <Text fontSize="xs">{capitalize(separateCamelCase(label))}</Text>
        <Box mt={2.5}>
          {payload.map((p) => (
            <HStack key={p.color}>
              <CircleIcon color={p.color} />
              <Text fontWeight="bold">{p.name}</Text>
              <Text>{renderPercentage(Number(p.value))} APY</Text>
            </HStack>
          ))}
        </Box>
      </Card>
    )
  );
};
