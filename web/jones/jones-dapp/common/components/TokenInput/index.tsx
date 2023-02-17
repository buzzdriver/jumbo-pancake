import { ChangeEventHandler, FC } from "react";

import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Text,
  useTheme,
} from "@chakra-ui/react";

import { getJonesColor } from "../../theme/helpers";
import { renderNumber } from "../../utils/numbers";
import { Badge } from "../Badge";
import { Image } from "../Image";

interface TokenInputProps {
  maxInput: string;
  inputAmount: string;
  setInputAmount: (value: string) => void;
  inputError: string;
  leftIconSrc?: string;
}

export const TokenInput: FC<TokenInputProps & InputProps> = ({
  maxInput,
  inputAmount,
  setInputAmount,
  inputError,
  leftIconSrc,
  ...inputProps
}) => {
  const theme = useTheme();
  const { grayLight, grayMid, grayMain, redMain } = getJonesColor(theme);

  const setMaxInput = () => setInputAmount(maxInput);
  const clearInput = () => setInputAmount("0");
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setInputAmount(e.target.value);

  const showMaxButton = +inputAmount === 0 || +inputAmount < +maxInput;
  return (
    <Box>
      <InputGroup display="flex" alignItems="center">
        {leftIconSrc && (
          <InputLeftElement pointerEvents="none" h="full" pl={4}>
            <Image src={leftIconSrc} height={24} width={24} alt="logo" />
          </InputLeftElement>
        )}
        <Input
          {...inputProps}
          pl={leftIconSrc ? "52px" : 4}
          fontSize="md"
          rounded="xl"
          h="60px"
          isInvalid={!!inputError}
          value={inputAmount}
          onChange={handleInputChange}
          sx={{
            borderColor: grayLight,
            _hover: {
              borderColor: grayLight,
            },
            _focus: {
              boxShadow: "none",
              backgroundColor: grayMain,
            },
            _invalid: {
              boxShadow: "none",
              borderColor: redMain,
            },
          }}
        />
        <InputRightElement h="full" pr={4} w="auto">
          <Text fontSize="xs" textColor={grayMid}>
            {(+inputAmount === 0 || +inputAmount !== +maxInput) &&
              `${renderNumber(+maxInput)} Balance`}
          </Text>
          <Badge
            size="sm"
            onClick={showMaxButton ? setMaxInput : clearInput}
            textColor="gradient"
            ml={2}
            title={showMaxButton ? "Max" : "Clear"}
          />
        </InputRightElement>
      </InputGroup>
      {inputError && (
        <Text fontSize="xs" textColor={redMain}>
          {inputError}
        </Text>
      )}
    </Box>
  );
};
