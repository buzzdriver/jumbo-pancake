import { ComponentStyleConfig } from "@chakra-ui/react";

export const Heading: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: "semibold",
    textColor: "white",
  },
  sizes: {
    xs: {
      fontSize: "24px",
      lineHeight: "32px",
    },
    "xs-26": {
      fontSize: "26px",
      lineHeight: "32px",
    },
    sm: {
      fontSize: "30px",
      lineHeight: "44px",
    },
    md: {
      fontSize: "36px",
      lineHeight: "38px",
    },
    lg: {
      fontSize: "48px",
      lineHeight: "60px",
    },
    xl: {
      fontSize: "60px",
      lineHeight: "72px",
    },
    "2xl": {
      fontSize: "72px",
      lineHeight: "90px",
    },
  },
  defaultProps: {
    size: "md",
  },
};
