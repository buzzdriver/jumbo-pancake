import { Image } from "../Image";
import InfoFooter from "../InfoFooter";

const airdropInfoSections = [
  {
    img: <Image src="/icons/clock.svg" alt="clock-icon" width={30} height={30} />,
    header: "Airdrop Info",
    content: `1% of the JONES total supply will be airdropped back to the community. The Airdrop is
      split between Dopex SSOV users during the January epoch up until snapshot and Guarded
      Launch participants.`,
  },
  {
    img: <Image src="/logo/jones-hat-black.svg" alt="jones-logo" width={48} height={30} />,
    header: "Claim & Stake",
    content: "Claim and stake your airdropped JONES to enjoy the growth of the protocol.",
  },
];

function AirdropFooter() {
  return (
    <div className="mt-10">
      <InfoFooter sections={airdropInfoSections} />
    </div>
  );
}

export default AirdropFooter;
