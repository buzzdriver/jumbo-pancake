const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");
const { ethers } = require("hardhat");

use(solidity);

const provider = waffle.provider;
const [devWallet, citizen1, citizen2, citizen3, citizen4, citizen5, treasury] = provider.getWallets();

describe("StakingRewards", function () {
  beforeEach(async function () {
    DSQ = await ethers.getContractFactory("DSQToken");
    dsq = await DSQ.deploy(treasury.address);

    LPToken = await ethers.getContractFactory("TestFixture_ERC20");
    lptoken = await LPToken.deploy("LP Token", "LP");

    Staker = await ethers.getContractFactory("StakingRewards");
    staker = await Staker.deploy(devWallet.address, treasury.address, dsq.address, lptoken.address);

    await lptoken.connect(devWallet).mintTo(citizen1.address, ethers.utils.parseEther("1"));
  });

  it("Should construct correctly", async function () {
    expect(await staker.owner()).to.eq(devWallet.address);
    expect(await staker.rewardsToken()).to.eq(dsq.address);
    expect(await staker.stakingToken()).to.eq(lptoken.address);
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

  it("Should stake, unstake, and accrue rewards", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    await lptoken.connect(citizen1).approve(staker.address, ethers.utils.parseEther("1"));
    expect(await staker.connect(citizen1).stake(ethers.utils.parseEther("1")))
      .to.emit(staker, "Staked")
      .withArgs(citizen1.address, ethers.utils.parseEther("1"));

    expect(await staker.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("1"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen1.address)).to.eq(ethers.utils.parseEther("10"));
    expect(await staker.connect(citizen1).exit())
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen1.address, ethers.utils.parseEther("10.1"));

    expect(await lptoken.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("1"));
    expect(await dsq.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("10.1"));
  });

  it("Should stake, unstake, and accrue rewards for multiple users", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    await lptoken.connect(devWallet).mintTo(citizen2.address, ethers.utils.parseEther("1"));
    await lptoken.connect(devWallet).mintTo(citizen3.address, ethers.utils.parseEther("2"));
    await lptoken.connect(citizen1).approve(staker.address, ethers.utils.parseEther("1"));
    await lptoken.connect(citizen2).approve(staker.address, ethers.utils.parseEther("1"));
    await lptoken.connect(citizen3).approve(staker.address, ethers.utils.parseEther("2"));

    // From t = 0 to t = 100 blocks, only Citizen 1
    expect(await staker.connect(citizen1).stake(ethers.utils.parseEther("1")))
      .to.emit(staker, "Staked")
      .withArgs(citizen1.address, ethers.utils.parseEther("1"));

    expect(await staker.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("1"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen1.address)).to.eq(ethers.utils.parseEther("10"));

    // From t = 101 to t = 200 blocks, citizen 1 and citizen 2
    expect(await staker.connect(citizen2).stake(ethers.utils.parseEther("1")))
      .to.emit(staker, "Staked")
      .withArgs(citizen2.address, ethers.utils.parseEther("1"));

    expect(await staker.balanceOf(citizen2.address)).to.eq(ethers.utils.parseEther("1"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen1.address)).to.eq(ethers.utils.parseEther("15.1"));
    expect(await staker.earned(citizen2.address)).to.eq(ethers.utils.parseEther("5"));

    // From t = 201 to t = 300 blocks, all 3 staking
    expect(await staker.connect(citizen3).stake(ethers.utils.parseEther("2")))
      .to.emit(staker, "Staked")
      .withArgs(citizen3.address, ethers.utils.parseEther("2"));

    expect(await staker.balanceOf(citizen3.address)).to.eq(ethers.utils.parseEther("2"));

    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");

    expect(await staker.earned(citizen1.address)).to.eq(ethers.utils.parseEther("17.65"));
    expect(await staker.earned(citizen2.address)).to.eq(ethers.utils.parseEther("7.55"));
    expect(await staker.earned(citizen3.address)).to.eq(ethers.utils.parseEther("5"));

    // Cash out all and check balances
    expect(await staker.connect(citizen1).exit())
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen1.address, ethers.utils.parseEther("17.675"));

    expect(await lptoken.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("1"));
    expect(await dsq.balanceOf(citizen1.address)).to.eq(ethers.utils.parseEther("17.675"));

    expect(await staker.connect(citizen2).exit())
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen2.address, ethers.utils.parseEther("7.608333333333333333"));

    expect(await lptoken.balanceOf(citizen2.address)).to.eq(ethers.utils.parseEther("1"));
    expect(await dsq.balanceOf(citizen2.address)).to.eq(ethers.utils.parseEther("7.608333333333333333"));

    expect(await staker.connect(citizen3).exit())
      .to.emit(staker, "RewardPaid")
      .withArgs(citizen3.address, ethers.utils.parseEther("5.216666666666666666"));

    expect(await lptoken.balanceOf(citizen3.address)).to.eq(ethers.utils.parseEther("2"));
    expect(await dsq.balanceOf(citizen3.address)).to.eq(ethers.utils.parseEther("5.216666666666666666"));
  });

  it("Should not give rewards or withdraw tokens if user has no balance", async function () {
    await dsq.connect(treasury).transfer(staker.address, ethers.utils.parseEther("60480"));
    await staker.connect(treasury).notifyRewardAmount(ethers.utils.parseEther("60480"));
    expect(await staker.rewardRate()).to.eq(ethers.utils.parseEther("0.1"));

    await expect(staker.connect(citizen1).withdraw(ethers.utils.parseEther("1"))).to.be.revertedWith(
      "reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)",
    );

    await expect(staker.connect(citizen1).exit()).to.be.revertedWith("Cannot withdraw 0");

    expect(await dsq.balanceOf(citizen1.address)).to.eq(0);
    await staker.connect(citizen1).getReward();
    expect(await dsq.balanceOf(citizen1.address)).to.eq(0);
  });
});
