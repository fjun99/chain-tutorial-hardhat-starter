//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract StructTom{
    struct Student{
        uint256 id;
        string name;
    }
    Student public tom;

    constructor() {
        tom = Student({id:2, name:"tom"});
//        tom = Student(2,"tom");
    }

    function getTomId() public view returns(uint256){
        return tom.id;
    }
    
    function getTom() public view returns(uint256 id, string memory name){
        return (tom.id, tom.name);
    }

    function getTomStruct() public view returns(Student memory tomstruct){
        return tom;
    }

    function internalTom() internal view returns(Student memory tomstruct){
        return tom;
    }

    function getOther() public view returns(uint256){
        Student memory other = internalTom();
        return other.id;
    }
}