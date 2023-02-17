import { BoxProps } from "@chakra-ui/react";
import { FC } from "react";

import { Card } from "../Card";

const VaultOverviewCard: FC<BoxProps> = ({ children, ...rest }) => (
  <Card
    h={"430px"}
    display="flex"
    flexDirection="column"
    px={8}
    py={4}
    alignItems="center"
    overflow="hidden"
    data-test="vault-overview-card"
    {...rest}
  >
    {children}
  </Card>
);

export default VaultOverviewCard;
