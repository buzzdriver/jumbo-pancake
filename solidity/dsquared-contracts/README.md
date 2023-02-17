# DSquared

## Contracts

### DSQToken.sol

Simple fixed-supply ERC-20 token. 500,000 token maximum supply, 18 decimals.

### TokenSale.sol

ETH-denominated fair sale contract for the DSQ token. Has a Merkle whitelist phase and a public sale phase. The timestamps for the start and end times of these phases are set once and cannot be altered once set. The price for each phase is set once and cannot be altered once set. During the whitelist phase users can contribute up to a maximum amount each. During public phase there is no user cap. There is a total cap on the amount of funds to be raised between the two phases. The Merkle root may be updated at any time.

After conclusion of the public phase users can claim their owed tokens. After a period, the admin will be able to retrieve any leftover tokens from the contract. At this time, the admin can also push a user's owed tokens to their account.

### Vesting Contracts

The vesting contracts will be linear with cliff, launched via LlamaPay.

### StakingRewards.sol

Token staking rewards contract, based on the Synthetix model. This will be used to provide DSQ rewards to DSQ/X liquidity providers.

The contract takes a staking token (the LP token) and a reward token (DSQ). Users stake the staking token and receive the reward token. The rewards drip at a constant rate, and are divided proportionately among stakers based on their share of the staked token balance. Reward campaigns may be added or extended at any time.

### NFTStaking.sol

NFT staking rewards contract, based on the Synthetix model. This will be used to provide DSQ rewards to DopexNFT stakers.

The contract takes staking NFTs from one of two collections: the DopexNFT Genesis and DopexNFT regular collections. It also takes a reward token (DSQ). Users stake the NFTs and receive the reward token. The rewards drip at a constant rate, and are divided proportionately among stakers based on their weighted share of the NFTs staked. Weight depends on rarity of the NFTs, and which collection they are from. Reward campaigns may be added or extended at any time.

## Sample Hardhat Commands

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
npx hardhat coverage
```
