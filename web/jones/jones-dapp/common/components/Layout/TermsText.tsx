import { BoxProps, Stack, Text, TextProps } from "@chakra-ui/react";

const TermsText = ({ withAccept, ...boxProps }: { withAccept?: boolean } & BoxProps) => {
  const Paragraph = ({ text, ...rest }: { text: string } & TextProps) => (
    <Text fontSize="sm" {...rest}>
      {text}
    </Text>
  );

  return (
    <Stack spacing={4} textColor="gray.200" {...boxProps}>
      {withAccept && <Paragraph text="Please accept these terms before using our services." />}
      <Paragraph text="APYs being indicative" fontWeight="bold" />
      <Paragraph text="All APYs listed on this site are for guidance purposes only. JonesDAO employs strategies across a broad range of markets. The available liquidity in said markets changes constantly. As a result, JonesDAO cannot calculate APYs in real time. Users acknowledge this and also acknowledge the risk of negative returns on their deposited funds during certain time periods. By depositing funds in JonesDAO's vaults, the user assumes any associated risk of loss." />
      <Paragraph text="Risk of loss of funds when using our products" fontWeight="bold" />
      <Paragraph text="Our products are a smart contracts based suite of technologies that relies on blockchain technology. By depositing your funds into our vaults you recognize and assume all risks inherent in such technologies, including but not limited to the risk that the smart contracts underlying our vaults could fail, resulting in a total loss of user funds. JonesDAO is not responsible for any such losses." />
      <Paragraph text="UI usage and legal jurisdictions" fontWeight="bold" />
      <Paragraph text="JonesDAO is a decentralized finance project and does not hold any securities licenses in the U.S. or any other jurisdiction. Any investment made through our protocol shall be made with this in mind." />
      <Paragraph text="Furthermore, by accepting these terms you acknowledge and warrant that you are not a citizen of or otherwise accessing the website from the following nations or geographical locations: the Balkans, Belarus, Burma, China, Cote D'Ivoire (Ivory Coast), Cuba, Democratic Republic of Congo, Hong Kong, Iran, Iraq, Liberia, North Korea, Sudan, Syria, Zimbabwe, and/or any other jurisdiction prohibited by the United States Office of Foreign Asset Control (OFAC)." />
      <Paragraph text="Last updated 1st June 2022" />
    </Stack>
  );
};

export default TermsText;
