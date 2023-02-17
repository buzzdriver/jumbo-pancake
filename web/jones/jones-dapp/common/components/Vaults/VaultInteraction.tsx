import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Box, Button, Divider, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { addresses } from "@jones-dao/sdk";
import { capitalize } from "lodash";

import { VaultContext } from "../../context";
import { useStore } from "../../store";

import { formatToDecimals, renderNumber } from "../../utils/numbers";
import { getEthBalance, getTokenBalance } from "../../utils/web3";
import { claimTokens, depositTokens } from "../../web3/vaults";
import { Card } from "../Card";
import { InteractionButton } from "../InteractionButton";
import { TokenInput } from "../TokenInput";

enum Method {
  DEPOSIT = "deposit",
  CLAIM = "claim",
}

const VaultInteraction: FC = () => {
  const {
    managementWindowOpen,
    vaultName,
    isCapSet,
    vaultCap = 0,
    totalDeposited = 0,
    tokenAddress,
    vaultAddress = "",
    isNativeVault,
    jAssetPerToken,
    jAssetAddress,
    tokenPerJAsset,
    version,
  } = useContext(VaultContext);

  const {
    web3Data: {
      state: { address, signer },
    },
    vaults: {
      actions: { getSingleVault },
    },
  } = useStore((state) => ({ web3Data: state.web3Data, vaults: state.vaults }));

  const initialInputAmount = "0.00";
  const [inputAmount, setInputAmount] = useState(initialInputAmount);
  const [balance, setBalance] = useState("0");
  const [inputError, setInputError] = useState("");
  const [method, setMethod] = useState(Method.DEPOSIT);
  const isDeposit = method === Method.DEPOSIT;

  const methodVariables = useMemo(
    () => ({
      [Method.DEPOSIT]: {
        interactionToken: tokenAddress,
        tokenRatio: jAssetPerToken,
        onSubmit: async () => {
          if (signer && version && vaultAddress) {
            const txSuccess = await depositTokens[version](inputAmount, vaultAddress, signer);
            return txSuccess;
          }
        },
      },
      [Method.CLAIM]: {
        interactionToken: jAssetAddress,
        tokenRatio: tokenPerJAsset,
        onSubmit: async () => {
          if (signer && version && vaultAddress) {
            const txSuccess = await claimTokens[version](inputAmount, vaultAddress, signer);
            return txSuccess;
          }
        },
      },
    }),
    [
      inputAmount,
      jAssetAddress,
      jAssetPerToken,
      signer,
      tokenAddress,
      tokenPerJAsset,
      vaultAddress,
      version,
    ],
  );

  const checkAndSetBalance = useCallback(async () => {
    const token = methodVariables[method].interactionToken;
    if (address && token) {
      const balanceResult =
        isDeposit && isNativeVault
          ? await getEthBalance(address)
          : await getTokenBalance(token, address);

      setBalance(balanceResult);
    }
  }, [address, isDeposit, isNativeVault, method, methodVariables]);

  useEffect(() => {
    if (address) {
      const init = async () => {
        await checkAndSetBalance();
      };

      init();
    }
  }, [address, checkAndSetBalance]);

  useEffect(() => {
    if (!+inputAmount) setInputError("");
  }, [inputAmount]);

  const prefixTokenName = (prefix: boolean) =>
    vaultName ? (prefix ? `j${vaultName}` : vaultName) : "eth";
  const handleChangeMethod = (method: Method) => {
    setMethod(method);
    setInputAmount(initialInputAmount);
  };

  const handleSubmit = async () => {
    if (isNaN(+inputAmount)) return setInputError("Only numbers allowed.");
    if (+inputAmount === 0) return setInputError("Amount must be greater than 0.");
    if (+inputAmount > +balance) return setInputError("Insufficient balance.");
    if (isDeposit && isCapSet) {
      if (+inputAmount > vaultCap - totalDeposited) {
        return setInputError(
          `Vault cap reached, space available: ${formatToDecimals(
            vaultCap - totalDeposited,
            2,
          )} ${vaultName}`,
        );
      }
    }

    const txSuccess = await methodVariables[method].onSubmit();
    if (txSuccess) {
      vaultName && getSingleVault(vaultName);
      await checkAndSetBalance();
      setInputAmount("0");
    }
  };

  return (
    <Card p={{ base: 2, sm: 6, lg: 12 }} h="fit-content">
      <Stack spacing={6} data-test="vault-interaction">
        <HStack spacing={4} fontWeight="medium">
          <Button
            fontSize="md"
            variant="unstyled"
            onClick={() => handleChangeMethod(Method.DEPOSIT)}
            color={isDeposit ? "white" : "gray.500"}
          >
            <Box p={1}>Deposit</Box>
            <Divider
              rounded="base"
              borderColor={isDeposit ? "white" : "transparent"}
              borderBottomWidth="2px"
            />
          </Button>
          <Button
            fontSize="md"
            variant="unstyled"
            onClick={() => handleChangeMethod(Method.CLAIM)}
            color={!isDeposit ? "white" : "gray.500"}
          >
            <Box p={1}>Claim</Box>
            <Divider
              rounded="base"
              borderColor={!isDeposit ? "white" : "transparent"}
              borderBottomWidth="2px"
            />
          </Button>
        </HStack>

        <TokenInput
          maxInput={isNativeVault && isDeposit ? String(+balance * 0.98) : balance}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          inputError={inputError}
          placeholder={`Enter ${prefixTokenName(method === Method.CLAIM)} amount`}
          leftIconSrc={`/logo/${prefixTokenName(method === Method.CLAIM)?.toLowerCase()}.svg`}
        />

        <InteractionButton
          onSubmit={handleSubmit}
          tokenAddress={methodVariables[method].interactionToken}
          spenderAddress={isNativeVault ? addresses.WETH_VAULT_ADAPTER : vaultAddress}
          actionName={capitalize(method)}
          inputAmount={inputAmount}
          tokenName={prefixTokenName(method === Method.CLAIM) ?? ""}
          requireApprove={!isDeposit || !isNativeVault}
          disabled={managementWindowOpen}
          disabledText="Vault is closed"
        />

        <Flex align="center" justify="space-between" fontSize="sm">
          <Text>You will get</Text>
          <Text fontWeight="medium">
            {`${renderNumber(
              (methodVariables[method].tokenRatio ?? 1) * +inputAmount,
              6,
            )} ${prefixTokenName(method === Method.DEPOSIT)}`}
          </Text>
        </Flex>
      </Stack>
    </Card>
  );
};

export default VaultInteraction;
