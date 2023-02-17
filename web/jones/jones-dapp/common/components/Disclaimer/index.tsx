import { Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { navLinks } from "../Layout";
import { Card } from "../Card";

const Disclaimer = () => {
  const router = useRouter();

  const pageNames = navLinks.reduce((acc: string[], curr) => {
    const { name, pages } = curr;
    if (pages) {
      const names = pages.map(({ name }) => name);
      acc.push(...names);
    } else {
      acc.push(name);
    }

    return acc;
  }, []);

  const getPageName = () =>
    pageNames.find((pageName) => router.pathname.includes(pageName.toLowerCase()));

  const textByPage = (): JSX.Element => {
    const apyText = (
      <VStack spacing={4} align="flex-start">
        <Text>
          The indicative ROI/APY is not guaranteed and is subject to market risk. The strategies are
          not risk-free, and some epochs may result in a negative return. Details and management
          fees can be found in{" "}
          <a
            href="https://docs.jonesdao.io/jones-dao/features/protocol-fees"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            our docs
          </a>
          .
        </Text>

        <Text>
          While the information contained within the Website is periodically updated, no guarantee
          is given that the information provided in the website is correct, complete, and current.
        </Text>
      </VStack>
    );

    switch (getPageName()) {
      case "Sale":
        return (
          <>
            U.S. residents or citizens are not permitted to participant in the Token Generation
            Event (TGE). By taking part in the event you certify you are neither a U.S. citizen or
            resident.
          </>
        );
      case "Airdrop":
        return (
          <VStack spacing={4} align="flex-start">
            <Text>{apyText} </Text>
            <Text>
              A reminder that if you are in the US or other restricted countries you may not
              participate in this airdrop.
            </Text>
          </VStack>
        );

      default:
        return apyText;
    }
  };

  return (
    <Card p={{ base: 4, sm: 12 }} mt={{ base: 4, sm: 6 }} data-test="disclaimer">
      <Text fontWeight="medium">Disclaimers</Text>
      <Text textColor="gray.500" mt={4} fontSize="xs">
        {textByPage()}
      </Text>
    </Card>
  );
};

export default Disclaimer;
