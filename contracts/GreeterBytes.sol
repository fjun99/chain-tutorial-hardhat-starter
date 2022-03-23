//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract GreeterBytes {
    bytes32 private greeting;

    constructor(bytes32 _greeting) 
    {
        greeting = _greeting;
    }

    function greet() 
        public view 
        returns (bytes32 ) 
    {
        // console.log(string(abi.encodePacked(greeting)));
        return greeting;
    }

    function setGreeting(bytes32 _greeting) 
        public 
    {
        greeting = _greeting;
    }
}
