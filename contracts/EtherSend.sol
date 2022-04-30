//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract EtherSend {

    function sendTestCall (address _receiver, uint256 _amount) public {
        // require(address(this).balance >= _amount,"balance not sufficient");
        (bool success,) = _receiver.call{value:_amount,gas:2300}("");
        require(success,"call failure");
    }

    function sendTestSend (address _receiver, uint256 _amount) public {
        // require(address(this).balance >= _amount,"balance not sufficient");
        if(! payable(_receiver).send(_amount)){
            revert("send failure");
        }
    }

    function sendTestTransfer (address _receiver, uint256 _amount) public {
        // require(address(this).balance >= _amount,"balance not sufficient");
        payable(_receiver).transfer(_amount);
    }

    receive()  external payable{} 
}


//     (bool success) = payable(_receiver).send(_amount);
//     require(success,"send failure");
// to avoid linter warning
// https://protofire.github.io/solhint/docs/rules/security/check-send-result.html

// Ref: https://docs.soliditylang.org/en/v0.8.13/units-and-global-variables.html#address-related
//         https://docs.soliditylang.org/en/v0.5.11/units-and-global-variables.html#members-of-address-types

// not correct？
// https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
// https://solidity-by-example.org/sending-ether/

