import { FC } from "react";

import { Box, Center, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { Vault } from "@jones-dao/sdk";
import { useRouter } from "next/router";

import { renderNumber, renderPercentage, renderUsd } from "../../utils/numbers";
import { PnlBadge } from "../Badge/PnlBadge";
import { VaultStatusBadge } from "../Badge/VaultStatusBadge";
import { Image } from "../Image";
import { StyledProgress } from "../Styled/StyledProgress";
import VaultOverviewCard from "./VaultOverviewCard";

const VaultOverview: FC<Vault> = (props) => {
  const {
    vaultName,
    apy,
    vaultCap,
    isCapSet,
    percentageFilled = 0,
    managementWindowOpen = true,
    totalDeposited,
    tvl,
  } = props;

  const router = useRouter();
  const pathname = `/vaults/${vaultName}`;

  const goToVault = () => {
    router.push(pathname);
  };

  return (
    <VaultOverviewCard
      cursor="pointer"
      onClick={goToVault}
      _hover={{
        backgroundColor: "card.100",
      }}
    >
      <Center position="absolute" top={5} right={3} boxSize={14}>
        <Image src={`/logo/${vaultName.toLowerCase()}.svg`} width={40} height={40} alt="logo" />
      </Center>
      <Box h="160px" position="absolute" bottom={0}>
        <Image
          src={`/vaults/${vaultName.toLowerCase()}.svg`}
          alt="background-image"
          width={300}
          height={160}
        />
      </Box>

      <Center h="64px">
        <Heading size="xs" fontWeight="semibold">
          {vaultName}
        </Heading>
      </Center>

      <Flex h={{ base: "auto", md: "255px" }} w="full" direction="column" alignItems="center">
        <HStack alignItems="baseline" h={8}>
          <Text as="span" fontSize="2xl" fontWeight="semibold">
            {renderPercentage(apy, 2, "-%")}
          </Text>
          <Text as="span" fontWeight="semibold">
            APY
          </Text>
        </HStack>

        <Text fontSize="xs" fontWeight="medium" color="gray.200">
          Avg. Historical Yield
        </Text>

        <Stack w="full" spacing={2} mt={6}>
          <StyledProgress
            value={!isCapSet ? 30 : percentageFilled}
            title="Vault filled"
            valuePosition="top"
          />
          <Text fontSize="xs" textAlign="right">
            {renderNumber(totalDeposited, 2)} / {!isCapSet ? "∞" : renderNumber(vaultCap, 0)}{" "}
            {vaultName}
          </Text>
        </Stack>

        <Stack w="full" spacing="14px" mt={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="xs">Epoch Live Position</Text>
            <PnlBadge value={undefined} />
          </Flex>

          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="xs">TVL</Text>
            <Text fontSize="xs">{renderUsd(tvl, 2, "N/A")}</Text>
          </Flex>
        </Stack>
      </Flex>

      <VaultStatusBadge managementWindowOpen={managementWindowOpen} loading={false} />
    </VaultOverviewCard>
  );
};

export default VaultOverview;
