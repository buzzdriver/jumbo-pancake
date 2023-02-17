import { FC, useContext, useState } from "react";
import { Box, Button, Heading, Link, Stack, HStack, VStack, Text } from "@chakra-ui/react";
import { VaultContext } from "../../context";
import { ArrowUpRightIcon } from "../../icons";

const productArray = [
  {
    key: "Auto-Rolling Deposits",
    text: [
      {
        header: "Deposits are open at the end of each epoch",
        paragraph:
          "Deposit tokens into a Jones Vault to get jAsset yield-bearing tokens in return. Vaults open once per month and any tokens deposited during this period are then locked until the end of the next epoch. When vaults are open, you may claim positions or deposit new tokens.",
      },

      {
        header: "Auto-Rolling",
        paragraph:
          "The vaults have auto-rolling functionality, meaning you may leave your deposit in the vault epoch-to-epoch and your tokens will continue to accrue yield.",
      },
    ],
  },

  {
    key: "Claims",
    text: [
      {
        header: "Claims are available at the end of each epoch",
        paragraph:
          "At the conclusion of an epoch, once the vaults open, you may exchange your jAsset tokens for native tokens. At that time, all the real native yield your position earned accrues to you.",
      },
    ],
  },

  {
    key: "Fees",
    text: [
      {
        header: null,
        paragraph:
          "The fees from this vault structure are comprised of: 2% annual fee on total TVL applied at each epoch and 20% performance fee on generated yield.",
      },

      {
        header: "What that means",
        paragraph:
          "If a user deposits 100 ETH for 1 monthly epoch, the protocol would earn 100 * (2%/12) = 0.1667 ETH in TVL fees. If the protocol were to then generate 6% yield on that 100 ETH in that same month, it would earn (100 * 6%) * 20% = 1.2 ETH in performance fees. Together this equals 1.3667 ETH in total fees.",
      },

      {
        header: null,
        paragraph: "*Subject to change, currently inactive pending veJONES release.",
      },
    ],
  },
];

const VaultProductInfo: FC = () => {
  const { vaultName, vaultAddress, tokenAddress } = useContext(VaultContext);
  const [info, setInfo] = useState(productArray[0]);
  const additionalStyle = (selected: boolean) =>
    selected ? {} : { bg: "transparent", color: "gray.500" };

  return (
    <Box pt={4} position="relative" data-test="vault-product-info">
      <Heading size="xs" fontWeight="semibold">
        Product Info
      </Heading>

      <Stack fontSize="sm" fontWeight="medium" align="flex-start" mt={4} spacing={8}>
        <HStack justify="center">
          {productArray.map((element) => (
            <Button
              variant="tertiary"
              size="sm"
              key={element.key}
              onClick={() => {
                setInfo(element);
              }}
              {...additionalStyle(element.key === info.key)}
              data-test="product-info-btn"
            >
              {element.key}
            </Button>
          ))}
        </HStack>

        <VStack align="flex-start" spacing={4}>
          {info.text.map((element, index) => {
            return (
              <VStack align="flex-start" key={index} spacing={2}>
                {element.header && <Text>{element.header}</Text>}
                <Text textColor={"gray.500"} fontSize="xs">
                  {element.paragraph}
                </Text>
              </VStack>
            );
          })}
        </VStack>

        <VStack align="flex-start" spacing={4}>
          <Button variant="link-white" rightIcon={<ArrowUpRightIcon boxSize={2.5} />}>
            <Link
              href={`https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${tokenAddress}`}
              isExternal
            >
              Get {vaultName}
            </Link>
          </Button>

          <Button variant="link-white" rightIcon={<ArrowUpRightIcon boxSize={2.5} />}>
            <Link isExternal href={`https://arbiscan.io/address/${vaultAddress}`}>
              View Contract
            </Link>
          </Button>
        </VStack>
      </Stack>
    </Box>
  );
};

export default VaultProductInfo;
