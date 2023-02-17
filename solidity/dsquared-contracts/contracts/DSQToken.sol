// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @notice DSquared Governance Token
 * @author BowTiedPickle
 */
contract DSQToken is ERC20, ERC20Burnable {
    constructor(address _treasury) ERC20("DSquared Governance Token", "DSQ") {
        require(_treasury != address(0), "Param");
        _mint(_treasury, 500000 ether);
    }
}
