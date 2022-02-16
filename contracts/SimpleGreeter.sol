//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract SimpleGreeter {
    string public greet;

    constructor(string memory _greeting) 
    {
        greet = _greeting;
    }

    function setGreeting(string memory _greeting) 
        public 
    {
        greet = _greeting;
    }
}
