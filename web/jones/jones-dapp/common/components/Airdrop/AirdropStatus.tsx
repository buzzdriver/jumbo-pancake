import { Box } from "@chakra-ui/react";
import { Card } from "../Card";
import { Image } from "../Image";

function AirdropStatus() {
  return (
    <Card className="w-full px-10 py-10 mt-10 transform h-80">
      <Box position="absolute" top={0} right={0}>
        <Image src="/airdrop/confetti.svg" alt="" width={290} height={200} />
      </Box>

      <p className="text-sm font-light">Airdrop status</p>
      <p className="mt-2 text-3xl font-bold">Open</p>
      <div className="mt-16">
        <Image src="/logo/arbitrum-dark.svg" width={40} height={40} alt="Arbitrum logo" />
      </div>
      <p className="mt-4 text-sm font-light">Exclusively available on</p>
      <p className="font-bold">Arbitrum Network</p>
    </Card>
  );
}

export default AirdropStatus;
