import { Center, HStack } from "@chakra-ui/react";

import { Image } from "../Image";
import InfoFooter from "../InfoFooter";

const VaultsInfo = ({ vaultName }: { vaultName?: string }) => {
  const vaultsInfoSections = [
    {
      img: vaultName ? (
        <Center w={10}>
          <Image
            src={`/logo/${vaultName.toLowerCase()}.svg`}
            alt="token-logo"
            width={40}
            height={40}
          />
        </Center>
      ) : (
        <HStack spacing={2}>
          <Center w={12}>
            <Image src="/logo/eth.svg" alt="eth-logo" width={32} height={32} />
          </Center>
          <Center>
            <Image src="/logo/gohm.svg" alt="gohm-logo" width={32} height={32} />
          </Center>
        </HStack>
      ),
      header: "Deposit native tokens",
      content:
        "Deposit native tokens into a Jones DAO Vault to get back jAsset yield bearing tokens.",
    },
    {
      img: (
        <Center w={10}>
          <Image src="/icons/clock.svg" alt="jones-logo" width={30} height={30} />
        </Center>
      ),
      header: "Vault duration",
      content:
        "Vaults open each month and any deposited funds are locked until the vault period ends. You may then claim back your deposit and yield using jAssets.",
    },
    {
      img: vaultName ? (
        <Center w={10}>
          <Image
            src={`/logo/j${vaultName.toLowerCase()}.svg`}
            alt="token-logo"
            width={40}
            height={40}
          />
        </Center>
      ) : (
        <Image src="/logo/jones-hat-black.svg" alt="eth-jones-hat" width={52} height={30} />
      ),
      header: "Withdrawing",
      content:
        "Once the vault ends, you can use your jAssets such as jgOHM or jETH to claim your deposits and yield. If a vault options strategy is not profitable the maximum drawdown is limited. Good luck Jonesy!",
    },
  ];

  return <InfoFooter sections={vaultsInfoSections} />;
};

export default VaultsInfo;
