const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");
const { ethers, network } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = ethers.utils;

use(solidity);

const provider = waffle.provider;
const [devWallet, citizen1, citizen2, citizen3, citizen4, citizen5, citizen6] = provider.getWallets();

const whitelisted = [citizen1, citizen2, citizen3];
const notWhitelisted = [citizen4, citizen5, citizen6];

const leaves = whitelisted.map(account => keccak256(account.address));
const tree = new MerkleTree(leaves, keccak256, { sort: true });
const merkleRoot = tree.getHexRoot();

const merkleProof = tree.getHexProof(keccak256(whitelisted[0].address));
const invalidMerkleProof = tree.getHexProof(keccak256(notWhitelisted[0].address));

const tokensPerWei = 1000; // 1000 DQS per Ether
const initialSupply = ethers.utils.parseEther("250000");

const now = new Date();

describe("TokenSale", function () {
  beforeEach(async function () {
    Seller = await ethers.getContractFactory("TokenSale");
    DQS = await ethers.getContractFactory("TestFixture_ERC20");
    dqs = await DQS.deploy("TestDQS", "DQS");

    seller = await Seller.deploy(dqs.address);

    await dqs.connect(devWallet).mintTo(seller.address, initialSupply);

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    startTime = timestampBefore + 10;
    whitelistTime = startTime + 7 * 24 * 3600;
    publicTime = whitelistTime + 7 * 24 * 3600;

    await network.provider.send("evm_setNextBlockTimestamp", [startTime - 1]);
  });

  it("Should start a sale", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );
  });

  it("Should NOT double start a sale", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );
    await expect(
      seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime),
    ).to.be.revertedWith("Started");
  });

  it("Should whitelist purchase with correct parameters", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );

    await network.provider.send("evm_increaseTime", [10]);

    expect(await seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") }))
      .to.emit(seller, "WhitelistPurchase")
      .withArgs(citizen1.address, ethers.utils.parseEther("1000"), ethers.utils.parseEther("1"));

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq(ethers.utils.parseEther("1"));
    expect(await dqs.balanceOf(citizen1.address)).to.eq(0);
  });

  it("Should NOT whitelist purchase with incorrect parameters", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );

    await expect(seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") })).to.be.revertedWith(
      "NotStarted",
    );

    await network.provider.send("evm_increaseTime", [10]);

    await expect(
      seller.connect(citizen1).purchaseWhitelist(invalidMerkleProof, { value: ethers.utils.parseEther("1") }),
    ).to.be.revertedWith("Proof");

    await expect(seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: 0 })).to.be.revertedWith("Amount");

    await expect(seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1.1") })).to.be.revertedWith(
      "WalletMax",
    );

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);
    await network.provider.send("evm_mine");

    await expect(seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") })).to.be.revertedWith(
      "WL Over",
    );

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq("0x0");
    expect(await dqs.balanceOf(citizen1.address)).to.eq(0);
  });

  it("Should public purchase with correct parameters", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );

    await network.provider.send("evm_increaseTime", [10]);

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);
    await network.provider.send("evm_mine");

    expect(await seller.connect(citizen1).purchasePublic({ value: ethers.utils.parseEther("1") }))
      .to.emit(seller, "PublicPurchase")
      .withArgs(citizen1.address, ethers.utils.parseEther("1000"), ethers.utils.parseEther("1"));

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq(ethers.utils.parseEther("1"));
    expect(await dqs.balanceOf(citizen1.address)).to.eq(0);
  });

  it("Should respect the maximum raise", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );

    await network.provider.send("evm_increaseTime", [10]);

    expect(await seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") }))
      .to.emit(seller, "WhitelistPurchase")
      .withArgs(citizen1.address, ethers.utils.parseEther("1000"), ethers.utils.parseEther("1"));

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);
    await network.provider.send("evm_mine");

    expect(await seller.connect(citizen1).purchasePublic({ value: ethers.utils.parseEther("999") }))
      .to.emit(seller, "PublicPurchase")
      .withArgs(citizen1.address, ethers.utils.parseEther("999000"), ethers.utils.parseEther("999"));

    await expect(seller.connect(citizen1).purchasePublic({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("SaleMax");

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq(ethers.utils.parseEther("1000"));
    expect(await dqs.balanceOf(citizen1.address)).to.eq(0);
  });

  it("Should refund", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );

    await network.provider.send("evm_increaseTime", [10]);

    expect(await seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") }))
      .to.emit(seller, "WhitelistPurchase")
      .withArgs(citizen1.address, ethers.utils.parseEther("1000"), ethers.utils.parseEther("1"));

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);
    await network.provider.send("evm_mine");

    expect(await seller.connect(citizen1).purchasePublic({ value: ethers.utils.parseEther("998.5") }))
      .to.emit(seller, "PublicPurchase")
      .withArgs(citizen1.address, ethers.utils.parseEther("998500"), ethers.utils.parseEther("998.5"));

    expect(await seller.connect(citizen1).purchasePublic({ value: ethers.utils.parseEther("1") }))
      .to.emit(seller, "PublicPurchase")
      .withArgs(citizen1.address, ethers.utils.parseEther("500"), ethers.utils.parseEther("0.5"));

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq(ethers.utils.parseEther("1000"));
    expect(await dqs.balanceOf(citizen1.address)).to.eq(0);
  });

  it("Should NOT public purchase with incorrect parameters", async function () {
    expect(await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime)).to.emit(
      seller,
      "SaleStarted",
    );

    await network.provider.send("evm_increaseTime", [10]);

    await expect(seller.connect(citizen1).purchasePublic({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("Phase");

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);
    await network.provider.send("evm_mine");

    await expect(seller.connect(citizen1).purchasePublic({ value: 0 })).to.be.revertedWith("Amount");

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);
    await network.provider.send("evm_mine");

    await expect(seller.connect(citizen1).purchasePublic({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("Phase");

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq("0x0");
    expect(await dqs.balanceOf(citizen1.address)).to.eq(0);
  });

  it("Should claim tokens after the sales", async function () {
    await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime);

    await network.provider.send("evm_increaseTime", [10]);

    await seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") });

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);

    await seller.connect(citizen2).purchasePublic({ value: ethers.utils.parseEther("1") });

    expect(await dqs.balanceOf(citizen1.address)).to.eq(0);
    expect(await dqs.balanceOf(citizen2.address)).to.eq(0);
    expect(await seller.pending(citizen1.address)).to.eq(ethers.utils.parseEther("1000"));
    expect(await seller.pending(citizen2.address)).to.eq(ethers.utils.parseEther("1000"));

    await expect(seller.connect(citizen1).claim()).to.be.revertedWith("Phase");
    await expect(seller.connect(citizen2).claim()).to.be.revertedWith("Phase");

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);

    expect(await seller.connect(citizen1).claim())
      .to.emit(seller, "Claim")
      .withArgs(citizen1.address, ethers.utils.parseEther("1000"));
    expect(await seller.connect(citizen2).claim())
      .to.emit(seller, "Claim")
      .withArgs(citizen2.address, ethers.utils.parseEther("1000"));

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq(ethers.utils.parseEther("2"));
    expect(await dqs.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("1000"));
    expect(await dqs.balanceOf(citizen2.address)).to.eq(ethers.utils.parseEther("1000"));
  });

  it("Should withdraw profits", async function () {
    await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime);

    await network.provider.send("evm_increaseTime", [10]);

    await seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") });

    expect(await network.provider.send("eth_getBalance", [seller.address])).to.eq(ethers.utils.parseEther("1"));

    expect(await seller.connect(devWallet).withdraw()).to.changeEtherBalance(devWallet, ethers.utils.parseEther("1"));
  });

  it("Should NOT retrieve tokens during sale", async function () {
    await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime);
    await expect(seller.connect(devWallet).retrieve()).to.be.revertedWith("Ongoing");
  });

  it("Should retrieve tokens", async function () {
    expect(await seller.connect(devWallet).retrieve()).to.changeTokenBalance(dqs, devWallet, ethers.utils.parseEther("250000"));
  });

  it("Should not retrieve tokens during inappropriate times", async function () {
    await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime);

    await expect(seller.connect(devWallet).retrieve()).to.be.revertedWith("Ongoing");

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);

    await expect(seller.connect(devWallet).retrieve()).to.be.revertedWith("Ongoing");

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);

    await expect(seller.connect(devWallet).retrieve()).to.be.revertedWith("Ongoing");

    await network.provider.send("evm_increaseTime", [31 * 24 * 3600]);

    expect(await seller.connect(devWallet).retrieve()).to.changeTokenBalance(dqs, devWallet, ethers.utils.parseEther("250000"));
  });

  it("Should set a root with correct permissions", async function () {
    expect(await seller.connect(devWallet).setMerkleRoot(merkleRoot))
      .to.emit(seller, "NewMerkleRoot")
      .withArgs(merkleRoot);

    await expect(seller.connect(citizen1).setMerkleRoot(merkleRoot)).to.be.reverted;
  });

  it("Should claimFor with correct permission", async function () {
    await seller.connect(devWallet).startSale(merkleRoot, tokensPerWei, tokensPerWei, startTime, whitelistTime, publicTime);

    await network.provider.send("evm_increaseTime", [10]);

    await seller.connect(citizen1).purchaseWhitelist(merkleProof, { value: ethers.utils.parseEther("1") });

    await expect(seller.connect(devWallet).claimFor([citizen1.address])).to.be.revertedWith("Ongoing");

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);

    await expect(seller.connect(devWallet).claimFor([citizen1.address])).to.be.revertedWith("Ongoing");

    await network.provider.send("evm_increaseTime", [7 * 24 * 3600]);

    await expect(seller.connect(devWallet).claimFor([citizen1.address])).to.be.revertedWith("Ongoing");

    await network.provider.send("evm_increaseTime", [31 * 24 * 3600]);

    await expect(seller.connect(citizen1).claimFor([citizen1.address])).to.be.reverted;

    expect(await seller.connect(devWallet).claimFor([citizen1.address])).to.changeTokenBalance(
      dqs,
      citizen1,
      ethers.utils.parseEther("1000"),
    );
  });
});
