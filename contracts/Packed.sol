//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Packed {

    function fbytes() 
        public view 
        returns (bytes memory) 
    {
        string memory ab = "ab";
        string memory c = "c";
        console.log(string(abi.encodePacked(ab,c)));
        return abi.encodePacked(ab,c);
    }

    function fbytes32() 
        public view 
        returns (bytes32) 
    {
        string memory ab = "abcdedfghijklmnopqrstuvwxyz123456";

        string memory c = "c";
        bytes memory r = abi.encodePacked(ab,c);

        console.log(string(r));
        console.log(r.length);
        // bytes32 r = string(abi.encodePacked(ab,c));
        return bytes32(bytes31(r));
    }


    function fstring() 
        public view 
        returns (string memory) 
    {
        string memory ab = "abcdedfghijklmnopqrstuvwxyz123456";

        string memory c = "c";
        bytes memory r = abi.encodePacked(ab,c);

        console.log(string(r));
        // console.log(r.length);
        // // bytes32 r = string(abi.encodePacked(ab,c));
        return string(r);
    }    

    function dcd(bytes calldata _payload) public view{
        bytes4 sig = bytes4(_payload[:4]);
        bytes memory r = abi.encodePacked(sig);
        console.log(string(r));
    }

    function comparestr() public view{
        string memory s1 = "abc";
        string memory s2 = "abc";

        if (keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked("a","bc"))){
            console.log("compare true");
        }


        // bytes32 s3 = "abc";
        // bytes32 s4 = "abc";
        string memory concatString = string.concat(s1,s2);
        console.log(concatString);

    }

}
