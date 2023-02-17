import { Box, Button, SimpleGrid, Text, Flex } from "@chakra-ui/react";

import { ArrowUpRightIcon } from "../../icons";
import { Card } from "../Card";

interface FooterSection {
  img: JSX.Element;
  header: string | JSX.Element;
  content: string | JSX.Element;
  imgCenter?: boolean;
}
interface InfoFooterProps {
  sections: FooterSection[];
}

const InfoFooter = (props: InfoFooterProps) => {
  const InfoSection = ({ img, header, content }: FooterSection, i: number) => (
    <Box key={i} fontSize="xs" data-test="info-section">
      <Flex>
        <Box>{img}</Box>
      </Flex>

      <Text mt={4} fontWeight={"semibold"} textColor="white">
        {header}
      </Text>
      <Box mt={3} textColor={"gray.500"}>
        {content}
      </Box>
    </Box>
  );

  return (
    <Card
      px={{ base: 4, sm: 14 }}
      py={{ base: 8, sm: 16 }}
      mt={{ base: 4, sm: 6 }}
      data-test="info-footer"
    >
      <SimpleGrid columns={{ base: 1, md: Math.min(3, props.sections.length) }} spacing={6}>
        {props.sections.map(InfoSection)}
      </SimpleGrid>
      <div className="mt-10 text-center">
        <a href="https://docs.jonesdao.io/jones-dao/" target="_blank" rel="noreferrer">
          <Button variant="link-white" size="md" rightIcon={<ArrowUpRightIcon boxSize={2.5} />}>
            Learn
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default InfoFooter;
