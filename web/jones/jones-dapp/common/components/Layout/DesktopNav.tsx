import { FC, useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import clsx from "clsx";
import { useRouter } from "next/dist/client/router";

import { useStore } from "../../store";

import { useWeb3Modal } from "../../hooks/useWeb3Modal";
import { ArbitrumIcon } from "../../icons";
import { shorten } from "../../utils/helpers";
import { AnnouncementBanner } from "../Banner/AnnouncementBanner";
import { Image } from "../Image";
import { NavItem } from "./";
import { JonesMenu } from "./JonesMenu";
import NetworkModal from "./NetworkModal";

interface DesktopNavProps {
  openMobileMenu: () => void;
  navLinks: NavItem[];
}

const DesktopNav: FC<DesktopNavProps> = (props) => {
  const { openMobileMenu, navLinks } = props;
  const router = useRouter();
  const isMobileUI = useBreakpointValue({ base: true, md: false });

  const {
    web3Data: {
      state: { address, ens },
      actions: { setAddress },
    },
    feedbackComponents: {
      state: { networkModalOpen, announcements },
      actions: { showNetworkModal },
    },
  } = useStore((state) => ({
    web3Data: state.web3Data,
    feedbackComponents: state.feedbackComponents,
  }));

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).Cypress) {
      setAddress("0x8888888888888888888888888888888888888888");
      return;
    }
    address ? disconnect() : await connect();
  };

  const { connect, disconnect } = useWeb3Modal();

  const [connectedButtonText, setConnectedButtonText] = useState(ens || shorten(address));

  const NavItem = ({ route, name, pages }: NavItem, i: number) => {
    if (route) {
      const isActive = router.pathname.includes(route);
      return (
        <Button
          variant="link-white"
          size="sm"
          onClick={() => router.push(route)}
          className={clsx(!isActive && "opacity-50 hover:opacity-100")}
          key={i}
        >
          {name}
        </Button>
      );
    } else if (pages) {
      const isActive = pages.some((p) => router.pathname.includes(p.route));

      return (
        <Popover trigger="hover" openDelay={1} key={i}>
          {({ isOpen }) => (
            <>
              <PopoverTrigger>
                <Button
                  variant="link-white"
                  size="sm"
                  rightIcon={
                    <ChevronDownIcon
                      boxSize={5}
                      className={clsx("transition-all duration-100", isOpen && "rotate-180")}
                    />
                  }
                  className={clsx(!isActive && "opacity-50 hover:opacity-100")}
                  iconSpacing={0}
                >
                  {name}
                </Button>
              </PopoverTrigger>
              <PopoverContent border={0} bg="gray.800" w={36}>
                <PopoverBody p={2.5}>
                  {pages.map((p) => (
                    <Box
                      key={p.name}
                      px={4}
                      py={2}
                      onClick={() => router.push(p.route)}
                      rounded="md"
                      cursor="pointer"
                      h={9}
                      _hover={{
                        bg: "gray.700",
                      }}
                    >
                      <Text fontSize="sm">{p.name}</Text>
                    </Box>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
      );
    }
  };

  const onHover = () => setConnectedButtonText("Disconnect");
  const onLeave = () => setConnectedButtonText(ens || shorten(address));

  useEffect(() => {
    setConnectedButtonText(ens || shorten(address));
  }, [address, ens]);

  return (
    <div className="sticky top-0 z-10 md:z-[1500]">
      {announcements.length > 0 && announcements.map(AnnouncementBanner)}
      <Box
        bg="card.600"
        backdropFilter="auto"
        backdropBlur="xl"
        h={16}
        textColor="white"
        display="flex"
        alignItems="center"
        justifyContent={{ base: "space-between", md: "space-around" }}
      >
        <Center ml={2}>
          <Center
            onClick={openMobileMenu}
            display={{ base: "flex", md: "none" }}
            data-test="mobile-hamburger-menu"
          >
            <Image src="/icons/hamburger-menu.svg" height={40} width={40} alt="menu" />
          </Center>
          <Center onClick={() => router.push("/")} cursor="pointer" data-test="nav-jones-hat">
            <Image src="/logo/jones-hat.svg" alt="jones-logo" width={42} height={24} />
          </Center>
        </Center>
        <div className="items-center hidden space-x-6 md:flex" data-test="nav-navigation-items">
          {navLinks.map(NavItem)}
        </div>

        <Box
          px={{ base: 2, md: 4 }}
          display="flex"
          alignItems="center"
          experimental_spaceX={{ base: 2, md: 4 }}
          justifyContent="end"
        >
          <Box display={{ base: "none", md: "inline-block" }} data-test="nav-jones-menu">
            <JonesMenu />
          </Box>

          {isMobileUI ? (
            <IconButton
              variant="tertiary"
              onClick={() => showNetworkModal(true)}
              aria-label="Arbitrum logo"
              icon={<ArbitrumIcon />}
              data-test="mobile-arbitrum-icon"
            />
          ) : (
            <Button
              variant="tertiary"
              onClick={() => showNetworkModal(true)}
              leftIcon={<ArbitrumIcon />}
              data-test="arbitrum-icon"
            >
              <Text>Arbitrum</Text>
            </Button>
          )}

          <Button
            h={10}
            minW="130px"
            variant="secondary"
            onClick={connectWallet}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            data-test="connect-wallet"
          >
            <Text>{address ? connectedButtonText : "Connect"}</Text>
          </Button>
        </Box>
        {networkModalOpen && <NetworkModal />}
      </Box>
    </div>
  );
};

export default DesktopNav;
