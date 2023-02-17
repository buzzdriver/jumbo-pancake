// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
*********************** Overview ***********************
English Auction: 
Typical highest bid auction lasting over preset period
of time

Ducth Auction: 
Price is initialized and declines over preset period 
of time -> buyer executes transaction at desired 
price point
********************************************************
*/

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

contract EnglishAuction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);
    IERC721 public nft;
    uint public nftId;
    address payable public seller;
    uint public endAt;
    bool public started;
    bool public ended;
    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    constructor(
        address _nft,
        uint _nftId,
        uint _startingBid
    ) {
        nft = IERC721(_nft);
        nftId = _nftId;
        seller = payable(msg.sender);
        highestBid = _startingBid;
    }

    function start() external {
        require(!started, "Event started");
        require(msg.sender == seller, "Not seller");
        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + 7 days;
        emit Start();
    }

    function bid() external payable {
        require(started, "Event not started");
        require(block.timestamp < endAt, "Event ended");
        require(msg.value > highestBid, "value less than highest");
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);
        emit Withdraw(msg.sender, bal);
    }

    function end() external {
        require(started, "Event not started");
        require(block.timestamp >= endAt, "Event not ended");
        require(!ended, "Event ended");
        ended = true;
        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }
        emit End(highestBidder, highestBid);
    }
}

contract DutchAuction {
    uint private constant DURATION = 7 days;
    IERC721 public immutable nft;
    uint public immutable nftId;
    address payable public immutable seller;
    uint public immutable startingPrice;
    uint public immutable startAt;
    uint public immutable expiresAt;
    uint public immutable discountRate;

    constructor(
        uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId
    ) {
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;
        discountRate = _discountRate;
        require(
            _startingPrice >= _discountRate * DURATION,
            "Starting price less than minimum"
        );
        nft = IERC721(_nft);
        nftId = _nftId;
    }

    function getPrice() public view returns (uint) {
        uint timeElapsed = block.timestamp - startAt;
        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function buy() external payable {
        require(block.timestamp < expiresAt, "Auction expired");
        uint price = getPrice();
        require(msg.value >= price, "ETH less than price");
        nft.transferFrom(seller, msg.sender, nftId);
        uint refund = msg.value - price;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        selfdestruct(seller);
    }
}
