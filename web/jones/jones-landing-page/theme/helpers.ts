import { getColor, StyleFunctionProps } from '@chakra-ui/theme-tools'
import { Dict } from '@chakra-ui/utils'

const getPrimaryGradientProperty = (from: string, to: string): string =>
  `linear-gradient(to top right, ${from} 25.75%, ${to} 83.39%)`

export const buttonHasIcon = ({
  rightIcon,
  leftIcon,
  icon,
}: StyleFunctionProps): boolean => rightIcon || leftIcon || icon

export const getJonesColor = (theme: Dict) => {
  const primaryMain = getColor(theme, 'primary.700')
  const purplePrimary = getColor(theme, 'purple.500')

  return {
    alertPending: getColor(theme, 'alert.300'),
    cardSecondary: getColor(theme, 'card.300'),
    errorLight: getColor(theme, 'error.300'),
    errorMain: getColor(theme, 'error.500'),
    errorDark: getColor(theme, 'error.700'),
    grayLight: getColor(theme, 'gray.200'),
    grayMid: getColor(theme, 'gray.500'),
    grayMain: getColor(theme, 'gray.700'),
    grayDark: getColor(theme, 'gray.800'),
    primaryLight: getColor(theme, 'primary.200'),
    primaryMain,
    purplePrimary,
    redMain: getColor(theme, 'red.500'),
    successLight: getColor(theme, 'success.300'),
    successMain: getColor(theme, 'success.500'),
    primaryGradient: getPrimaryGradientProperty(purplePrimary, primaryMain),
    primaryGradientReverse: getPrimaryGradientProperty(
      primaryMain,
      purplePrimary
    ),
  }
}
