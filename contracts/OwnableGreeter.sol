//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract OwnableGreeter {
    address private owner;
    string private greeting;
    string public prefix = "OG: ";

    modifier onlyOwner {
        require(msg.sender == owner,"Only owner");
        _;
    }

    constructor(string memory _greeting) {
        greeting = _greeting;
        owner = msg.sender;
    }

    function setPrefix(string memory _prefix) 
        public onlyOwner {
        prefix = _prefix;
    }

    function greet() public view returns (string memory) {
        return string(abi.encodePacked(prefix, greeting));
    }

    function setGreeting(string memory _greeting) 
        public {
        greeting = _greeting;
    }
}
