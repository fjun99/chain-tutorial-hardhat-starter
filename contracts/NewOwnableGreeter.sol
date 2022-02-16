//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Owned {
    constructor() { owner = msg.sender; }
    address private owner;

    modifier onlyOwner {
        require(msg.sender == owner,"Only owner");
        _;
    }
}

contract NewOwnableGreeter is Owned {
    string private greeting;
    string public prefix = "OG: ";

    constructor(string memory _greeting) {
        greeting = _greeting;
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
