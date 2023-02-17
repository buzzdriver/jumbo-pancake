import { Button, ButtonProps, HStack, Wrap } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { NavLink } from "./";

const Footer = ({ footerLinks }: { footerLinks: NavLink[] }) => {
  const router = useRouter();
  const FooterButton = ({ title, ...props }: { title: string } & ButtonProps) => (
    <Button
      size="sm"
      variant="link-white"
      color="gray.500"
      fontWeight="medium"
      fontSize={{ base: "xs", sm: "sm" }}
      {...props}
    >
      {title}
    </Button>
  );
  return (
    <Wrap justify="space-between" py={12} data-test="footer" fontSize="xs">
      <HStack spacing={4}>
        {footerLinks.map((link) => (
          <a href={link.route} target="_blank" rel="noreferrer" key={link.name}>
            <FooterButton title={link.name} />
          </a>
        ))}
      </HStack>
      <FooterButton title="Terms" onClick={() => router.push("/terms")} data-test="footer-terms" />
    </Wrap>
  );
};

export default Footer;
