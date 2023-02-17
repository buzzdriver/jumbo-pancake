import { Box } from "@chakra-ui/react";

import { Image } from "../Image";
import InfoFooter from "../InfoFooter";

function StakingFooter() {
  const stakingInfoSections = [
    {
      img: (
        <span className="flex">
          <Box>
            <Image src="/logo/jdpx.png" width={32} height={32} alt="jgohm-logo" />
            <Image src="/logo/dpx.png" width={32} height={32} alt="gohm-logo" />
          </Box>
        </span>
      ),
      header: <span className="text-jones-gray">Step 1</span>,
      content: "Acquire 50% of each token in a pair in order to start providing liquidity.",
    },
    {
      img: (
        <span className="flex items-center">
          <Box>
            <Image src="/logo/jgohm.png" width={32} height={32} alt="logo" />
          </Box>
          <Box ml={2}>
            <Image src="/logo/gohm.png" width={32} height={32} alt="logo" />
          </Box>
          <Box ml={6}>
            <Image src="/icons/arrow-right.png" width={24} height={24} alt="logo" />
          </Box>
          <Box ml={6}>
            <Image src="/logo/sushi.svg" width={32} height={32} alt="logo" />
          </Box>
        </span>
      ),
      header: <span className="text-jones-gray">Step 2</span>,
      content: "Deposit tokens evenly into a sushi pool to get Sushi LP tokens.",
    },
    {
      img: (
        <span className="flex">
          <Box>
            <Image src="/logo/jgohm.png" width={32} height={32} alt="logo" />
          </Box>
          <Box ml={2}>
            <Image src="/logo/gohm.png" width={32} height={32} alt="logo" />
          </Box>
          <Box ml={2}>
            <Image src="/logo/jones-hat-black.svg" width={52} height={32} alt="logo" />
          </Box>
        </span>
      ),
      header: <span className="text-jones-gray">Step 3</span>,
      content: "Stake your Sushi LP tokens in Jones DAO staking to earn more $JONES.",
    },
  ];
  return <InfoFooter sections={stakingInfoSections} />;
}

export default StakingFooter;
