import { Card } from "../Card";
import { Image } from "../Image";

function AirdropNotEligible({ text }: { text: string }) {
  return (
    <Card className="w-full px-10 py-10 mt-10 transform h-80">
      <p className="mt-2 text-2xl font-bold">{text}</p>
      <div className="mt-16">
        <Image src="/logo/arbitrum-dark.svg" width={40} height={40} alt="Arbitrum logo" />
      </div>
      <p className="mt-4 text-sm font-light">Exclusively available on</p>
      <p className="font-bold">Arbitrum Network</p>
    </Card>
  );
}

export default AirdropNotEligible;
