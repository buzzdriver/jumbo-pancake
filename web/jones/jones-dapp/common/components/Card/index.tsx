import { FC } from "react";

import { Box, BoxProps } from "@chakra-ui/react";

export const Card: FC<BoxProps> = (props) => (
  <Box
    backdropFilter="blur(60px)"
    bg="card.600"
    rounded="xl"
    textColor="white"
    position="relative"
    {...props}
  >
    {props.children}
  </Box>
);
