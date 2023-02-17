import { FC } from "react";

import { Tooltip, TooltipProps } from "@chakra-ui/react";

const StyledTooltip: FC<TooltipProps> = (props) => {
  return (
    <Tooltip rounded="xl" p="4" bg="gray.800" textColor="white" {...props} data-test="tooltip">
      {props.children}
    </Tooltip>
  );
};

export default StyledTooltip;
