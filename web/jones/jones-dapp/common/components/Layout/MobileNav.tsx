import { FC, useState } from "react";

import {
  Button,
  ButtonProps,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";

import { ChevronLeftIcon, ChevronRightIcon, GradientCloseIcon } from "../../icons";
import { Image } from "../Image";
import { NavItem, NavLink } from "./";
import { JonesMenuButtons } from "./JonesMenuButtons";

interface MobileNavProps {
  isOpen: boolean;
  navLinks: NavItem[];
  footerLinks: NavLink[];
  onClose: () => void;
}

const MobileNav: FC<MobileNavProps> = (props) => {
  const { isOpen, navLinks, onClose, footerLinks } = props;

  const router = useRouter();
  const [page, setPage] = useState(0);

  const NavItem = ({ route, name, pages }: NavItem) => {
    const MobileNavItem = ({
      name,
      route,
      isActive,
      ...buttonProps
    }: {
      name: string;
      route?: string;
      isActive: boolean;
    } & ButtonProps) => (
      <Button
        variant="link-white"
        size="2xl"
        minW="fit-content"
        onClick={() => route && router.push(route)}
        color={isActive ? "white" : "gray.500"}
        {...buttonProps}
      >
        <Text>{name}</Text>
        {!route && <ChevronRightIcon boxSize={5} ml={2} />}
      </Button>
    );

    if (route) {
      const isActive = router.pathname.includes(route);
      return <MobileNavItem key={name} name={name} route={route} isActive={isActive} />;
    } else if (pages) {
      const isActive = pages.some(({ route }) => router.pathname.includes(route));
      return (
        <MobileNavItem key={name} name={name} isActive={isActive} onClick={() => setPage(1)} />
      );
    }
  };

  const FooterItem = ({ route, name, NavIcon }: NavLink) =>
    NavIcon && (
      <a href={route} target="_blank" rel="noreferrer" key={name}>
        <Center w={10} h={10}>
          <NavIcon color="gray.500" _hover={{ color: "primary.700" }} />
        </Center>
      </a>
    );

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay bg="card.600" backdropFilter="blur(10px)" />
      <DrawerContent bg="black">
        <DrawerHeader p={8}>
          <IconButton variant="unstyled" aria-label="jones-icon" onClick={() => router.push("/")}>
            <Image src="/logo/jones-hat.svg" width={56} height={40} alt="Jones-logo" />
          </IconButton>

          <IconButton
            variant="tertiary"
            icon={<GradientCloseIcon />}
            aria-label="close"
            position="absolute"
            top={8}
            right={8}
            boxSize={10}
            onClick={onClose}
          />
        </DrawerHeader>

        <DrawerBody overflow="hidden" p={0}>
          <Flex
            h="full"
            w="200%"
            px={8}
            pt={16}
            transform={!page ? "translateX(0px)" : "translateX(-50%)"}
            transitionTimingFunction="cubic-bezier(0.4, 0, 1, 1)"
            transitionDuration="300ms"
          >
            <Flex flexDir="column" justifyContent="space-between" w="50%">
              <Stack align="baseline" spacing={6}>
                {navLinks.map(NavItem)}
              </Stack>
              <JonesMenuButtons />
            </Flex>

            <Flex
              flexDir="column"
              pl={8}
              w="50%"
              transform={page ? "translateX(0)" : "translateX(50%)"}
              transitionTimingFunction="cubic-bezier(0.4, 0, 1, 1)"
              transitionDuration="300ms"
            >
              <Stack align="baseline" spacing={6}>
                <Button variant="link-white" size="xl" onClick={() => setPage(0)} color="gray.500">
                  <ChevronLeftIcon boxSize={4} mr={2} />
                  <Text>Back</Text>
                </Button>
                {navLinks.filter((n) => n.pages).map((nav) => nav.pages?.map(NavItem))}
              </Stack>
            </Flex>
          </Flex>
        </DrawerBody>

        <DrawerFooter justifyContent="start" px={8} pt={10} pb={6}>
          <HStack spacing={4}>{footerLinks.map(FooterItem)}</HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNav;
