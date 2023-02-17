import { FC } from "react";

import { BoxProps, HStack, Text, TextProps, useTheme } from "@chakra-ui/react";

import { getJonesColor } from "../../theme/helpers";

interface BadgeProps {
  title: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  textColor?: "green" | "red" | "gradient" | "gray" | "default";
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

export const Badge: FC<BadgeProps & BoxProps> = ({
  title,
  size = "sm",
  onClick,
  textColor = "default",
  leftIcon,
  rightIcon,
  ...boxProps
}) => {
  const theme = useTheme();
  const { grayMain, grayMid, primaryGradientReverse, successLight, errorLight } =
    getJonesColor(theme);
  const sizeStyle = {
    sm: {
      h: "22px",
      py: "2px",
      px: "8px",
      fontSize: "xs",
    },
    md: {
      h: "24px",
      py: "2px",
      px: "10px",
      fontSize: "sm",
    },
    lg: {
      h: "28px",
      py: "4px",
      px: "12px",
      fontSize: "sm",
    },
  };

  const titleStyle: Record<string, TextProps> = {
    gray: { textColor: grayMid },
    green: { textColor: successLight },
    red: { textColor: errorLight },
    gradient: { bgGradient: primaryGradientReverse, bgClip: "text" },
    default: { textColor: "white" },
  };

  return (
    <HStack
      {...sizeStyle[size]}
      alignItems="center"
      spacing={2}
      rounded="2xl"
      fontWeight="medium"
      bg={grayMain}
      w="fit-content"
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      {...boxProps}
    >
      {leftIcon}
      <Text {...titleStyle[textColor]}>{title}</Text>
      {rightIcon}
    </HStack>
  );
};
