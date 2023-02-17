import { Box } from "@chakra-ui/react";

import lockedIcon from "../../../public/icons/locked.svg";
import unlockedIcon from "../../../public/icons/unlocked.svg";
import { Image } from "../Image";
import { StyledSkeleton } from "../Styled/StyledSkeleton";
import { Badge } from "./";

export const VaultStatusBadge = ({
  managementWindowOpen,
  loading,
}: {
  managementWindowOpen: boolean;
  loading: boolean;
}) => {
  const vaultStatusText = () => {
    switch (managementWindowOpen) {
      case false:
        return "Vault is open";
      default:
        return "Vault is closed";
    }
  };

  return (
    <StyledSkeleton isLoaded={!loading} rounded="xl" my={{ base: 16, md: 0 }}>
      <Badge
        h={12}
        px={5}
        bg="card.300"
        position="relative"
        display={"flex"}
        alignItems="center"
        title={vaultStatusText()}
        fontSize="md"
        textColor="gradient"
        backdropFilter="blur(40px)"
        zIndex={1}
        minW="max-content"
        rightIcon={
          <Box w={5} h={5}>
            <Image src={managementWindowOpen ? lockedIcon : unlockedIcon} alt="vault-status-icon" />
          </Box>
        }
        data-test="vault-status-badge"
      />
    </StyledSkeleton>
  );
};
