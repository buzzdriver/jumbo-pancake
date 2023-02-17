import { Button, Box, Divider, Flex } from "@chakra-ui/react";
import React from "react";
import { Tab } from "../../../pages/vaults/[token]";

export function VaultTabs({
  bg,
  tab,
  setTab,
}: {
  bg?: string;
  tab: string;
  setTab: (tab: Tab) => void;
}) {
  const isVault = tab === Tab.VAULT;

  return (
    <Flex
      p={{ base: 2, sm: 4 }}
      h="fit-content"
      bg={bg}
      data-test="vault-analytics-tab"
      justify="center"
      gap={4}
    >
      <Button
        fontSize="md"
        variant="unstyled"
        onClick={() => setTab(Tab.VAULT)}
        color={isVault ? "white" : "gray.500"}
      >
        <Box p={1}>Vault</Box>
        <Divider
          rounded="base"
          borderColor={isVault ? "white" : "transparent"}
          borderBottomWidth="2px"
        />
      </Button>
      <Button
        fontSize="md"
        variant="unstyled"
        onClick={() => setTab(Tab.ANALYTICS)}
        color={!isVault ? "white" : "gray.500"}
        data-test="analytics-btn"
      >
        <Box p={1}>Analytics</Box>
        <Divider
          rounded="base"
          borderColor={!isVault ? "white" : "transparent"}
          borderBottomWidth="2px"
        />
      </Button>
    </Flex>
  );
}

export default VaultTabs;
