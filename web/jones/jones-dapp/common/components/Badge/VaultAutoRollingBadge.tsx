import { FC } from "react";

import autoRollIcon from "../../../public/icons/autoroll.svg";
import { Image } from "../Image";
import { Badge } from "./";

export const VaultAutoRollingBadge: FC = () => (
  <Badge
    display={{ base: "none", md: "flex" }}
    title="Auto-rolling"
    textColor="gray"
    leftIcon={<Image src={autoRollIcon} alt="Autoroll" />}
    bg="card.300"
    h="34px"
    fontWeight={400}
    minW="fit-content"
    p={2}
  />
);
