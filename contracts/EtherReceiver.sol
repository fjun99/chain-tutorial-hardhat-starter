//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EtherReceiver {
  function contribute (uint256 number) public payable {
    console.log("contribute",number);
    console.log("value",msg.value);
  }

  receive()  external payable{
      // console.log("receive");
  }    

  fallback()  external payable{
      // console.log("fallback");
  }    

  // should have withdraw function!
  function withdraw() public {
    payable(msg.sender).transfer(address(this).balance);
  }
}
