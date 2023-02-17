const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");
const { ethers } = require("hardhat");

use(solidity);

const provider = waffle.provider;
const [devWallet, citizen1, citizen2, citizen3, citizen4, citizen5, treasury] = provider.getWallets();

describe.only("NFTStaking", function () {
  beforeEach(async function () {
    DSQ = await ethers.getContractFactory("DSQToken");
    dsq = await DSQ.deploy(treasury.address);

    Test721 = await ethers.getContractFactory("TestFixture_ERC721");
    genesis = await Test721.deploy("Dopex Genesis", "DPG", "testURI");
    normal = await Test721.deploy("Dopex normal", "DPN", "testURI");

    Staker = await ethers.getContractFactory("NFTStaking");
    staker = await Staker.deploy(devWallet.address, treasury.address, dsq.address, genesis.address, normal.address);

    await genesis.connect(devWallet).mintTo(citizen1.address);
    await normal.connect(devWallet).mintTo(citizen1.address);
  });

  it("Should construct correctly", async function () {
    expect(await staker.owner()).to.eq(devWallet.address);
    expect(await staker.rewardsToken()).to.eq(dsq.address);
    expect(await staker.stakingToken1()).to.eq(genesis.address);
    expect(await staker.stakingToken2()).to.eq(normal.address);
    expect(await staker.rewardsDistribution()).to.eq(treasury.address);
  });

  it("Should notifyRewardAmount correctly", async function () {
    await expect(staker.connect(citizen1).notifyRewardAmount(6900)).to.be.revertedWith("Caller is not RewardsDistribution contract");
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    expect(await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480")))
      .to.emit(staker, "RewardAdded")
      .withArgs(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));
  });

  it("Genesis - Should stake, unstake, and accrue rewards", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    await genesis.connect(citizen1).approve(staker.address, 1);
    expect(await staker.connect(citizen1).stake(1, true))
      .to.emit(staker, "Staked")
      .withArgs(citizen1.address, 1, genesis.address, ethers.utils.parseEther("6"));

    expect(await staker.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("6"));
    expect(await staker.totalSupply()).to.eq(ethers.utils.parseEther("6"));
    expect(await staker.userRewardPerTokenPaid(citizen1.address)).to.eq(0);

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen1.address)).to.be.closeTo(ethers.utils.parseEther("10"), 10);
    expect(await staker.connect(citizen1).exit([1], [true]))
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen1.address, ethers.utils.parseEther("10.099999999999999998"));

    expect(await genesis.balanceOf(citizen1.address)).to.eq(1);
    expect(await dsq.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("10.099999999999999998"));
  });

  it("Normal - Should stake, unstake, and accrue rewards", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    await normal.connect(citizen1).approve(staker.address, 1);
    expect(await staker.connect(citizen1).stake(1, false))
      .to.emit(staker, "Staked")
      .withArgs(citizen1.address, 1, normal.address, ethers.utils.parseEther("3"));

    expect(await staker.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("3"));
    expect(await staker.totalSupply()).to.eq(ethers.utils.parseEther("3"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen1.address)).to.be.closeTo(ethers.utils.parseEther("10"), 10);
    expect(await staker.connect(citizen1).exit([1], [false]))
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen1.address, ethers.utils.parseEther("10.099999999999999998"));

    expect(await normal.balanceOf(citizen1.address)).to.eq(1);
    expect(await dsq.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("10.099999999999999998"));
  });

  it("Should NOT stake or unstake incorrectly", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    // Mint to make token 2 existent for this test
    await normal.connect(devWallet).mintTo(devWallet.address);
    await normal.connect(citizen1).approve(staker.address, 1);
    await expect(staker.connect(citizen1).stake(2, false)).to.be.revertedWith("ERC721: caller is not token owner nor approved");

    await staker.connect(citizen1).stake(1, false);

    await expect(staker.connect(citizen1).exit([1], [true])).to.be.revertedWith("Not depositor of that token");

    await expect(staker.connect(citizen1).exit([2], [false])).to.be.revertedWith("Not depositor of that token");

    await expect(staker.connect(citizen2).exit([1], [false])).to.be.revertedWith("Not depositor of that token");
  });

  it("Should stake, unstake, and accrue rewards for multiple users", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    await genesis.connect(devWallet).mintTo(citizen2.address);
    await genesis.connect(devWallet).mintTo(citizen3.address);
    await genesis.connect(citizen1).approve(staker.address, 1);
    await genesis.connect(citizen2).approve(staker.address, 2);
    await genesis.connect(citizen3).approve(staker.address, 3);

    await normal.connect(devWallet).mintTo(citizen2.address);
    await normal.connect(devWallet).mintTo(citizen3.address);
    await normal.connect(citizen1).approve(staker.address, 1);
    await normal.connect(citizen2).approve(staker.address, 2);
    await normal.connect(citizen3).approve(staker.address, 3);

    // From t = 0 to t = 100 blocks, only Citizen 1
    expect(await staker.connect(citizen3).stake(3, false))
      .to.emit(staker, "Staked")
      .withArgs(citizen3.address, 3, normal.address, ethers.utils.parseEther("3"));

    expect(await staker.balanceOf(citizen3.address)).to.eq(ethers.utils.parseEther("3"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen3.address)).to.be.closeTo(ethers.utils.parseEther("10"), 10);

    // From t = 101 to t = 200 blocks, citizen 1 and citizen 2
    expect(await staker.connect(citizen2).stake(2, false))
      .to.emit(staker, "Staked")
      .withArgs(citizen2.address, 2, normal.address, ethers.utils.parseEther("3"));

    expect(await staker.balanceOf(citizen2.address)).to.eq(ethers.utils.parseEther("3"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen3.address)).to.be.closeTo(ethers.utils.parseEther("15.1"), 10);
    expect(await staker.earned(citizen2.address)).to.be.closeTo(ethers.utils.parseEther("5"), 10);

    // From t = 201 to t = 300 blocks, all 3 staking
    expect(await staker.connect(citizen1).stake(1, true))
      .to.emit(staker, "Staked")
      .withArgs(citizen1.address, 1, genesis.address, ethers.utils.parseEther("6"));

    expect(await staker.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("6"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen3.address)).to.be.closeTo(ethers.utils.parseEther("17.65"), 10);
    expect(await staker.earned(citizen2.address)).to.be.closeTo(ethers.utils.parseEther("7.55"), 10);
    expect(await staker.earned(citizen1.address)).to.be.closeTo(ethers.utils.parseEther("5"), 10);

    // Cash out all and check balances
    expect(await staker.connect(citizen3).exit([3], [false]))
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen3.address, ethers.utils.parseEther("17.674999999999999995"));

    expect(await normal.balanceOf(citizen3.address)).to.eq(1);
    expect(await dsq.balanceOf(citizen3.address)).to.be.closeTo(ethers.utils.parseEther("17.675"), 10);

    expect(await staker.connect(citizen2).exit([2], [false]))
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen2.address, ethers.utils.parseEther("7.608333333333333330"));

    expect(await normal.balanceOf(citizen2.address)).to.eq(1);
    expect(await dsq.balanceOf(citizen2.address)).to.be.closeTo(ethers.utils.parseEther("7.608333333333333333"), 10);

    expect(await staker.connect(citizen1).exit([1], [true]))
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen1.address, ethers.utils.parseEther("5.216666666666666658"));

    expect(await genesis.balanceOf(citizen1.address)).to.eq(1);
    expect(await dsq.balanceOf(citizen1.address)).to.be.closeTo(ethers.utils.parseEther("5.216666666666666658"), 10);
  });

  it("Should not give rewards or withdraw tokens if user has no balance", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    await expect(staker.connect(citizen1).withdraw(1, false)).to.be.revertedWith("Not depositor of that token");

    await expect(staker.connect(citizen1).exit([1], [false])).to.be.revertedWith("Not depositor of that token");

    expect(await dsq.balanceOf(citizen1.address)).to.eq(0);
    await staker.connect(citizen1).getReward();
    expect(await dsq.balanceOf(citizen1.address)).to.eq(0);
  });

  it("Should set token weights", async function () {
    expect(await staker.GENESIS_LEGENDARY_WEIGHT()).to.eq(ethers.utils.parseEther("6"));
    expect(await staker.GENESIS_RARE_WEIGHT()).to.eq(ethers.utils.parseEther("5"));
    expect(await staker.GENESIS_UNCOMMON_WEIGHT()).to.eq(ethers.utils.parseEther("4"));
    expect(await staker.NORMAL_RARE_WEIGHT()).to.eq(ethers.utils.parseEther("3"));
    expect(await staker.NORMAL_UNCOMMON_WEIGHT()).to.eq(ethers.utils.parseEther("2"));
    expect(await staker.NORMAL_COMMON_WEIGHT()).to.eq(ethers.utils.parseEther("1"));

    weights = [
      ethers.utils.parseEther("6.9"),
      ethers.utils.parseEther("6.9"),
      ethers.utils.parseEther("6.9"),
      ethers.utils.parseEther("6.9"),
      ethers.utils.parseEther("6.9"),
      ethers.utils.parseEther("6.9"),
    ];

    await staker.connect(devWallet).setTokenWeights(weights);

    expect(await staker.GENESIS_LEGENDARY_WEIGHT()).to.eq(ethers.utils.parseEther("6.9"));
    expect(await staker.GENESIS_RARE_WEIGHT()).to.eq(ethers.utils.parseEther("6.9"));
    expect(await staker.GENESIS_UNCOMMON_WEIGHT()).to.eq(ethers.utils.parseEther("6.9"));
    expect(await staker.NORMAL_RARE_WEIGHT()).to.eq(ethers.utils.parseEther("6.9"));
    expect(await staker.NORMAL_UNCOMMON_WEIGHT()).to.eq(ethers.utils.parseEther("6.9"));
    expect(await staker.NORMAL_COMMON_WEIGHT()).to.eq(ethers.utils.parseEther("6.9"));

    await expect(staker.connect(citizen1).setTokenWeights([weights])).to.be.reverted;
    await expect(staker.connect(devWallet).setTokenWeights([1, 1, 1, 1, 1])).to.be.reverted;
  });
});
