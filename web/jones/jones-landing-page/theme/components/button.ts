import { buttonHasIcon, getJonesColor } from "../helpers";

import type { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "medium",
    borderRadius: "2xl",
    _focus: {
      boxShadow: 0,
    },
    _disabled: {
      opacity: 0.5,
    },
  },
  sizes: {
    sm: (props) => {
      const hasIcon = buttonHasIcon(props);
      const h = hasIcon ? "36px" : "34px";

      return {
        fontSize: "sm",
        h,
        minW: h,
        px: "14px",
        py: 2,
      };
    },
    md: (props) => {
      const hasIcon = buttonHasIcon(props);
      const h = hasIcon ? 10 : "38px";

      return {
        fontSize: "sm",
        h,
        minW: h,
        px: 4,
        py: "10px",
      };
    },
    lg: {
      h: "44px",
      minW: "44px",
      px: 6,
      py: "10px",
    },
    xl: {
      h: 12,
      minW: 12,
      px: 6,
      py: 3,
      fontSize: "md",
      lineHeight: "24px",
    },
    "2xl": {
      lineHeight: "28px",
      fontSize: "lg",
      h: "60px",
      minW: "60px",
      px: 6,
      py: 4,
    },
  },
  variants: {
    primary: ({ theme }) => {
      const { primaryMain, primaryGradient, primaryGradientReverse } = getJonesColor(theme);
      return {
        bg: primaryGradient,
        color: "black",
        _focus: {
          bg: primaryMain,
          boxShadow: "0px 0px 0px 4px rgba(255, 131, 32, 0.3)",
          _hover: {
            bg: primaryMain,
          },
        },
        _hover: {
          bg: primaryGradientReverse,
          _disabled: {
            bg: primaryGradient,
          },
        },
      };
    },
    secondary: (props) => {
      const { theme, rightIcon } = props;
      const isIconButton = props["aria-label"];
      const {
        grayDark,
        grayMain,
        primaryMain,
        purplePrimary,
        primaryGradient,
        primaryGradientReverse,
      } = getJonesColor(theme);

      return {
        border: "1px solid",
        borderColor: "transparent",
        bg: `linear-gradient(${grayDark}, ${grayDark}) padding-box, ${primaryGradientReverse} border-box`,
        svg: { color: rightIcon ? purplePrimary : primaryMain },
        "svg > g": { fill: rightIcon ? purplePrimary : primaryMain },
        "> *": {
          bg: primaryGradientReverse,
          bgClip: "text",
          WebkitBackgroundClip: "text",
        },
        _hover: {
          bg: `linear-gradient(${grayMain}, ${grayMain}) padding-box, ${primaryGradient} border-box`,
          svg: { color: rightIcon || isIconButton ? primaryMain : purplePrimary },
          "svg > g": { fill: rightIcon || isIconButton ? primaryMain : purplePrimary },
          "> *": {
            bg: primaryGradient,
            bgClip: "text",
          },
          _disabled: {
            bg: `linear-gradient(${grayDark}, ${grayDark}) padding-box, ${primaryGradientReverse} border-box`,
            "> *": {
              bg: primaryGradientReverse,
              bgClip: "text",
              WebkitBackgroundClip: "text",
            },
          },
        },
      };
    },
    "secondary-banner": (props) => {
      const { theme, rightIcon } = props;
      const isIconButton = props["aria-label"];
      const {
        grayDark,
        grayMain,
        primaryMain,
        purplePrimary,
        primaryGradient,
        primaryGradientReverse,
      } = getJonesColor(theme);

      return {
        border: "1px solid",
        borderColor: "transparent",
        bg: `linear-gradient(${grayMain}, ${grayMain}) padding-box, ${primaryGradientReverse} border-box`,
        "svg > g": { fill: rightIcon ? purplePrimary : primaryMain },
        "> *": {
          bg: primaryGradientReverse,
          bgClip: "text",
          WebkitBackgroundClip: "text",
        },
        _hover: {
          bg: `linear-gradient(${grayMain}, ${grayMain}) padding-box, ${primaryGradient} border-box`,
          "svg > g": { fill: rightIcon || isIconButton ? primaryMain : purplePrimary },
          "> *": {
            bg: primaryGradient,
            bgClip: "text",
          },
          _disabled: {
            bg: `linear-gradient(${grayDark}, ${grayDark}) padding-box, ${primaryGradientReverse} border-box`,
            "> *": {
              bg: primaryGradientReverse,
              bgClip: "text",
              WebkitBackgroundClip: "text",
            },
          },
        },
      };
    },
    tertiary: ({ theme }) => {
      const { grayDark, grayMain, primaryMain, primaryLight } = getJonesColor(theme);

      return {
        color: primaryMain,
        bg: grayDark,
        _hover: {
          color: primaryLight,
          bg: grayMain,
          _disabled: {
            bg: grayDark,
          },
        },
      };
    },
    "link-primary": ({ theme }) => {
      const { primaryMain, primaryLight } = getJonesColor(theme);

      return {
        h: "auto",
        p: 0,
        color: primaryMain,
        verticalAlign: "baseline",
        _hover: {
          color: primaryLight,
        },
        _focus: {
          color: primaryLight,
        },
      };
    },
    "link-secondary": (props) => {
      const { theme, rightIcon } = props;
      const isIconButton = props["aria-label"];
      const { primaryMain, purplePrimary, primaryGradient, primaryGradientReverse } =
        getJonesColor(theme);

      return {
        h: "auto",
        p: 0,
        verticalAlign: "baseline",
        bg: primaryGradientReverse,
        textFillColor: "transparent",
        bgClip: "text",
        "svg > g": { fill: rightIcon || isIconButton ? purplePrimary : primaryMain },
        _hover: {
          bg: primaryGradient,
          textFillColor: "transparent",
          bgClip: "text",
          "svg > g": { fill: rightIcon || isIconButton ? primaryMain : purplePrimary },
          _disabled: {
            "svg > g": { fill: primaryMain },
            bg: primaryGradientReverse,
            textFillColor: "transparent",
            bgClip: "text",
          },
        },
        _focus: {
          textFillColor: primaryMain,
          "svg > g": { fill: primaryMain },
          _hover: {
            "svg > g": { fill: primaryMain },
            textFillColor: primaryMain,
          },
        },
      };
    },
    "link-white": ({ theme }) => {
      const { primaryMain, primaryLight } = getJonesColor(theme);

      return {
        h: "auto",
        p: 0,
        color: "white",
        verticalAlign: "baseline",
        _hover: {
          color: primaryMain,
          _disabled: {
            color: "white",
          },
        },
        _disabled: {
          "> *": {
            opacity: 0.5,
          },
        },
        _focus: {
          color: primaryLight,
        },
      };
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "primary",
  },
};
