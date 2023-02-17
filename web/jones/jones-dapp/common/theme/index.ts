import { extendTheme, theme as baseTheme } from "@chakra-ui/react";

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { Accordion } from "./components/accordion";
import { Alert } from "./components/alert";
import { Button } from "./components/button";
import { CloseButton } from "./components/closeButton";
import { Heading } from "./components/heading";
import { Popover } from "./components/popover";

const tailwind = resolveConfig(tailwindConfig);
const breakpoints = tailwind.theme.screens;

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  fonts: {
    heading: `${tailwind.theme.fontFamily?.body}, ${baseTheme.fonts?.heading}`,
    body: `${tailwind.theme.fontFamily?.body}, ${baseTheme.fonts?.body}`,
  },
  colors: tailwind.theme.colors,
  components: {
    Accordion,
    Alert,
    Button,
    CloseButton,
    Heading,
    Popover,
  },
  breakpoints,
});
