// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract MyPermitToken is ERC20, ERC20Permit {
    constructor() ERC20("MyPermitToken", "MPT") ERC20Permit("MyPermitToken") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
}