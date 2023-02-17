import { Button } from "@chakra-ui/react";

import { ArrowUpRightIcon } from "../../icons";
import { Image } from "../Image";

export const saleInfoSections = [
  {
    img: <Image src="/logo/eth.svg" alt="jones-logo" width={30} height={30} />,
    header: "Deposit ETH on Arbitrum",
    content: (
      <>
        <p>
          The public sale takes place during a 24hr window. In order to participate, you must bridge
          your ETH over to Arbitrum.
        </p>
        <div className="mt-4">
          <a href="https://bridge.arbitrum.io" target="_blank" rel="noreferrer">
            <Button variant="link-white" rightIcon={<ArrowUpRightIcon />}>
              Bridge to Arbitrum
            </Button>
          </a>
        </div>
      </>
    ),
  },
  {
    img: (
      <Image className="relative" src="/icons/clock.svg" alt="jones-logo" width={30} height={30} />
    ),
    header: "Token sale period",
    content:
      "You can deposit ETH in exchange for JONES tokens, which can be claimed once the sale ends. There are two steps to the sale; a whitelist and public sale.",
  },
  {
    img: <Image src="/logo/jones-hat-black.svg" alt="jones-logo" width={48} height={30} />,
    header: "Claim",
    content:
      "Once the sale ends and the final sale price is determined, JONES tokens can be claimed.",
  },
];
