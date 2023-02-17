const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");
const { ethers } = require("hardhat");

use(solidity);

const provider = waffle.provider;
const [devWallet, citizen1, citizen2, citizen3, citizen4, citizen5, treasury] = provider.getWallets();

describe("DSQ Token", function () {
  beforeEach(async function () {
    DSQ = await ethers.getContractFactory("DSQToken");
    dsq = await DSQ.deploy(treasury.address);
  });

  it("Should mint the desired supply on construction", async function () {
    expect(await dsq.balanceOf(treasury.address)).to.eq(ethers.utils.parseEther("500000"));
  });
});
