import { useCallback, useEffect, useState } from "react";

import { Box } from "@chakra-ui/react";

import AirdropBalance from "../common/components/Airdrop/AirdropBalance";
import AirdropConnect from "../common/components/Airdrop/AirdropConnect";
import AirdropFooter from "../common/components/Airdrop/AirdropFooter";
import AirdropNotEligible from "../common/components/Airdrop/AirdropNotEligible";
import AirdropStatus from "../common/components/Airdrop/AirdropStatus";
import merkleData from "../common/components/Airdrop/jonesairdropmerklefinal.json";
import Disclaimer from "../common/components/Disclaimer";
import { Image } from "../common/components/Image";
import Layout from "../common/components/Layout";
import { PageTitle } from "../common/components/PageTitle";
import config from "../common/config";
import { useStore } from "../common/store";
import { fetchUrl } from "../common/utils/queries";

function Airdrop() {
  const [userIndex, setUserIndex] = useState(0);
  const [userAmount, setUserAmount] = useState("0");
  const [userProof, setUserProof] = useState(["0"]);
  const [loading, setLoading] = useState(true);
  const [userEligible, setUserEligible] = useState(false);

  const merkleClaims: {
    [key: string]: {
      index: number;
      amount: string;
      proof: string[];
    };
  } = merkleData.claims;
  for (let i = 0; i < Object.keys(merkleClaims).length; i++) {
    const keyName = Object.keys(merkleClaims)[i];
    merkleClaims[keyName.toLowerCase()] = merkleClaims[keyName];
  }

  const {
    state: { address },
  } = useStore((state) => state.web3Data);

  const userClaim = address && Object.keys(merkleClaims).includes(address.toLocaleLowerCase());

  const checkUserEligible = useCallback(async () => {
    setLoading(true);
    setUserEligible(false);
    if (userClaim) {
      const userIdx = merkleClaims[address].index;
      setUserIndex(userIdx);
      setUserProof(merkleClaims[address].proof);
      setUserAmount(merkleClaims[address].amount);

      const indexClaimObj = await fetchUrl<{ claimed: boolean }>(
        `${config.apiUrl}/v1/jones/airdrop/${userIdx}`,
      );
      const indexClaim = indexClaimObj.claimed;
      setUserEligible(!indexClaim);
    }
    setLoading(false);
  }, [address, merkleClaims, userClaim]);

  useEffect(() => {
    checkUserEligible();
  }, [checkUserEligible]);

  return (
    <Layout title="Airdrop">
      <PageTitle title="Airdrop" />
      <Box position="absolute" insetX={0} mx="auto" top={28} textAlign="center">
        <Image src="/airdrop/badge.svg" width={70} height={70} alt="badge" />
      </Box>

      <Box position="fixed" top={0}>
        <Image width={1440} height={814} src="/airdrop/cloud.svg" alt="cover" />
      </Box>

      <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-x-5 gap-y-5">
        {loading ? (
          ""
        ) : !address ? (
          <AirdropConnect />
        ) : userClaim ? (
          userEligible ? (
            <>
              <AirdropBalance
                claimableAmount={userAmount}
                index={userIndex}
                merkleProof={userProof}
                checkUserEligible={checkUserEligible}
              />
              <AirdropStatus />
            </>
          ) : (
            <AirdropNotEligible text={"Address already claimed"} />
          )
        ) : (
          <AirdropNotEligible text={"Address not eligible"} />
        )}
      </div>

      <AirdropFooter />

      <Disclaimer />
    </Layout>
  );
}

export default Airdrop;
