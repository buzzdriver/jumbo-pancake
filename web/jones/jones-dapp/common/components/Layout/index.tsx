import React, { JSXElementConstructor, useEffect } from "react";

import { Box, BoxProps, IconProps, useDisclosure, useMediaQuery, useTheme } from "@chakra-ui/react";
import Head from "next/head";

import { DiscordIcon, ForumIcon, GitbookIcon, TwitterIcon } from "../../icons";
import DesktopNav from "./DesktopNav";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import TermsConditionsModal from "./TermsConditionsModal";

interface LayoutProps {
  title: string;
}

export interface NavLink {
  name: string;
  route: string;
  NavIcon?: JSXElementConstructor<IconProps>;
}

export interface NavItem {
  name: string;
  route?: string;
  pages?: NavLink[];
}

export const navLinks: NavItem[] = [
  { name: "Vaults", route: "/vaults" },
  { name: "Staking", route: "/staking" },
  {
    name: "Community",
    pages: [
      { name: "Sale", route: "/sale" },
      { name: "Airdrop", route: "/airdrop" },
    ],
  },
];

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const browserTitle = `Jones DAO - ${title}`;
  const [isBigScreen] = useMediaQuery(`(min-width:${useTheme().breakpoints.md})`);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isOpen && isBigScreen) onClose();
  }, [isBigScreen, isOpen, onClose]);

  const footerLinks: NavLink[] = [
    {
      name: "Gitbook",
      route: "https://docs.jonesdao.io/jones-dao/",
      NavIcon: GitbookIcon,
    },
    {
      name: "Discord",
      route: "https://discord.com/invite/jonesdao",
      NavIcon: DiscordIcon,
    },
    {
      name: "Twitter",
      route: "https://twitter.com/DAOJonesOptions",
      NavIcon: TwitterIcon,
    },
    {
      name: "Forum",
      route: "https://commonwealth.im/jones-dao/",
      NavIcon: ForumIcon,
    },
    {
      name: "Blog",
      route: "https://jonesdao.ghost.io/",
    },
  ];

  // Background orbs
  const Orb = (props: BoxProps) => (
    <Box pointerEvents="none" position="fixed" h="120vh" w="105vw" {...props} />
  );

  return (
    <Box minH="100vh" bg="#171717">
      <Head>
        <title>{browserTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta property="og:title" content={browserTitle} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://app.jonesdao.io/logo/jones-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:description"
          content="Yield, strategy and liquidity protocol for DeFi options."
        />
        <meta property="og:site_name" content={browserTitle} />
        <meta name="twitter:image:alt" content={browserTitle} />
        <meta name="twitter:site" content="@DAOJonesOptions" />
      </Head>

      {/** Ellipse 772 orange */}
      <Orb
        bg="radial-gradient(41.29% 41.29% at 50% 51.77%, #CA5E32 15.1%, rgba(255, 131, 32, 0) 94.73%)"
        left="-50%"
        top={0}
        opacity={0.25}
      />
      {/** Ellipse 775 purple */}
      <Orb
        bg="radial-gradient(46.13% 46.13% at 50% 51.77%, #935176 16.66%, rgba(98, 59, 81, 0) 97.39%)"
        left="-55%"
        top="-30%"
        opacity={0.3}
      />
      {/** Ellipse 774 blue */}
      <Orb
        bg="radial-gradient(46.13% 46.13% at 50% 51.77%, #2A2866 16.66%, #0A0B3C 45.31%, rgba(10, 11, 60, 0) 95.83%)"
        left="-60%"
        top="-60%"
        opacity={0.4}
      />

      <DesktopNav openMobileMenu={onOpen} navLinks={navLinks} />
      <MobileNav isOpen={isOpen} onClose={onClose} navLinks={navLinks} footerLinks={footerLinks} />

      <TermsConditionsModal />

      <Box px={{ base: 4, sm: 6, md: 12, xl: "208px" }} maxW="1440px" mx="auto">
        {children}

        <Footer footerLinks={footerLinks} />
      </Box>
    </Box>
  );
};

export default Layout;
