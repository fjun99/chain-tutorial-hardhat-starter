//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract MyBank {

  constructor() payable {

  }

  function deposit () public payable {
    console.log("deposit value",msg.value);
  }

  receive()  external payable{
  } 

  // should have withdraw function!
  function withdraw() public {
    payable(msg.sender).transfer(address(this).balance);
  }

  function faucet() public{
        require (address(this).balance >= 1 ether,"insufficent");
        payable(msg.sender).transfer(1 ether);
  }
}
