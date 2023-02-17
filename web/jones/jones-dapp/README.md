# Jones DAO

## Update constants

To update vault max drawdown: change value in `config/index:vaultData`, set percentage as aboslute number. Type is number, no strings.
To update vault apy: add monthly ROI value in `config/index:vaultData`. Key is first three letters of month + two digit year. ROI is in absolute percentages. E.g. if apy for a vault in June 2022 is 1.23%, it should be added as jun22: 1.23. Type is number, no strings.

## Web3

Fetching web3 data happens in the store. Interacting with contracts happens from the component, these functions are declared in `/common/web3`.

**Run local blockchain**

1. Add test account to metamask, generate private key from mnemonic (first account) in hardhat.config or ask for private key
2. Fork Arbitrum chain from `contracts/` by running `yarn localNodeArb`
3. Send tokens to test account on local blockchain by running `yarn localInit` on `contracts/`
4. Connect metamask to network `Localhost 8545`

## Handling Bignumbers

Generally, integers returned from smart contracts are denominated in wei (multiplied by a factor of 1e18). To keep values predictable while working with them, we handle these numbers in a certain way. The standard procedure of fetching web3 data is: fetch data in zustand store, convert from wei to ether values and convert to number -> import in component as number -> show in component as string with util function.

User values, such as personal token balance, personal staked tokens, are not converted to number to prevent rounding issues.

## Types

Each component, function (params + return value) and variable should be typed. For components, a custom interface can be declared within the component. A component will be then of type `FC<PropsInterface>`. This way, types will be ensure while passing props down.

## Images

When adding an icon to the codebase, try to always get the svg image. For rendering images, we use common/component/Image/index.tsx which is the next/Image component wrapped in chakra's Image component.

## Styling

We use Tailwind for styling, for documentation, see https://tailwindcss.com/.
Best practices https://www.notion.so/Tailwind-CSS-best-practices-f3344823a2174c71a5730b3e22c7255c

We use PascalCase for component name and camelCase for variables.
