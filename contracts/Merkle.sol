// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

contract Merkle{

    bytes32 public merkleRoot = 0xb38540218109b86482322426ad7fb1c83ed332400113b41517b41acdccb470b4;

    mapping(address => bool) public whitelistClaimed;

    function whitelistMint(bytes32[] calldata _merkleProof) public{

        require(!whitelistClaimed[msg.sender],"Address has already claimed");

        bytes32 leaf = keccak256(abi.encodePacked((msg.sender)));
        require(MerkleProof.verify(_merkleProof,merkleRoot, leaf),"Invalid proof");


        whitelistClaimed[msg.sender] = true;
        console.log("msg.sender minted,", msg.sender);
        //mint nft
    }
}