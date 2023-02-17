import { Button } from "@chakra-ui/react";

import { useWeb3Modal } from "../../hooks/useWeb3Modal";
import { Card } from "../Card";

function AirdropConnect() {
  const { connect } = useWeb3Modal();
  return (
    <Card className="w-full px-10 mt-10 transform h-80">
      <p className="mt-16 text-3xl font-bold">Connect to claim</p>
      <div className="mt-20">
        <Button size="xl" variant="primary" onClick={async () => await connect()}>
          Connect wallet
        </Button>
      </div>
    </Card>
  );
}

export default AirdropConnect;
