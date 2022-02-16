//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClassOwnToken is ERC20,Ownable {
        
        event Mint(address mintTo, uint amount);

        constructor(uint256 initialSupply) 
          ERC20("ClassOwnToken", "COT") {
                _mint(msg.sender, initialSupply);
        }

        function mint(address mintTo,uint amount) 
          public onlyOwner {
                require(mintTo == address(mintTo),
                        "Invalid address");
                require(amount > 0,"Amount should > 0");
                _mint(mintTo, amount);
                emit Mint(mintTo,amount);
        }
}
