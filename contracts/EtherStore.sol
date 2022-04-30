//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract EtherStore {
    uint256 public withdrawalLimit = 1 ether;
    mapping(address => uint256) public lastWithdrawTime;
    mapping(address => uint256) public balances;

    function depositFunds() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawFunds (uint256 _weiToWithdraw) public {
        require(balances[msg.sender] >= _weiToWithdraw,"balance");
        // limit the withdrawal
        require(_weiToWithdraw <= withdrawalLimit,"limit");
        // limit the time allowed to withdraw
        require(block.timestamp >= lastWithdrawTime[msg.sender] + 1 weeks, "time");

        (bool success,) = msg.sender.call{value:_weiToWithdraw}("");//,gas:2300
        require(success,"transfer failure");

        balances[msg.sender] -= _weiToWithdraw;
        lastWithdrawTime[msg.sender] = block.timestamp;
    }
}
