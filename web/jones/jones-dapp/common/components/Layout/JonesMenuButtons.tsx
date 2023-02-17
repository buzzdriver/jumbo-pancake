import { Button, Stack, Text } from "@chakra-ui/react";
import { addresses, TokenName } from "@jones-dao/sdk";

import metamaskIcon from "../../../public/logo/metamask.svg";
import sushiIcon from "../../../public/logo/sushi.svg";
import { addJonesToken } from "../../utils/network";
import { Image } from "../Image";

export const JonesMenuButtons = () => (
  <Stack spacing={4}>
    <Button
      w="fit-content"
      size="md"
      variant="secondary"
      onClick={addJonesToken}
      leftIcon={<Image src={metamaskIcon} alt="sushi" width={24} height={24} />}
    >
      <Text>Add $JONES to Metamask</Text>
    </Button>

    <a
      href={`https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${
        addresses.tokens[TokenName.JONES]
      }`}
      target="_blank"
      rel="noreferrer"
    >
      <Button
        size="md"
        variant="secondary"
        leftIcon={<Image src={sushiIcon} alt="sushi" width={24} height={24} />}
      >
        <Text>Get $JONES on Sushiswap</Text>
      </Button>
    </a>
  </Stack>
);
