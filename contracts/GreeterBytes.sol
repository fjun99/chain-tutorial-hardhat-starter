//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GreeterBytes {
    using Strings for uint256;
    bytes32 private greeting;

    constructor(bytes32 _greeting) 
    {
        greeting = _greeting;
    }

    function greet() 
        public view 
        returns (bytes32) 
    {
        // console.log(string(abi.encodePacked(greeting)));
        return greeting;
    }

    function setGreeting(bytes32 _greeting) 
        public 
    {
        greeting = _greeting;
    }

    function greetWithPrefix() 
        public view 
        returns (bytes32) 
    {
        bytes memory prefixed = abi.encodePacked("GR:",greeting);
        return bytes32(bytes31(prefixed));
    }

    function greetWithPrefixBytes() 
        public view 
        returns (bytes memory) 
    {
        bytes memory prefixed = abi.encodePacked("GR:",greeting);
        // bytes memory prefixed = abi.encodePacked(greeting);
        console.log("Solidity greetWithPrefixBytes:",  prefixed.length);
        return prefixed;
    }

    function greetWithPrefixStr() 
        public view 
        returns (string memory) 
    {
        // console.log(string(abi.encodePacked(greeting)));
        // uint256 i = 100;
        // string memory converted = string(abi.encodePacked((greeting)));
        string memory converted = bytes32ToString((greeting));
        // string memory converted = string(bytes32ToBytes(greeting));
        bytes memory prefixed = abi.encodePacked("GR:",converted);
        // return bytes32(prefixed);
        console.log("Solidity:",  prefixed.length);

        return string(prefixed);
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {   //_bytes32[i] != 0
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {  //_bytes32[i] != 0
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
/*
// https://gist.github.com/ageyev/779797061490f5be64fb02e978feb6ac
    function bytes32ToBytes(bytes32 _bytes32) public pure returns (bytes memory){
        // string memory str = string(_bytes32);
        // TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return bytesArray;
    }
*/
}
