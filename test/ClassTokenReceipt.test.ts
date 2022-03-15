import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer, ContractInterface } from "ethers"
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider"
import { LogDescription } from "@ethersproject/abi"
import { ClassToken } from "../typechain/ClassToken"

describe("ClassToken", function () {
  const initialSupply = ethers.utils.parseEther('10000.0')
  let token:ClassToken
  let owner:Signer, account1:Signer

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()
    
    const ClassTokenFactory = await ethers.getContractFactory("ClassToken")
    token = await ClassTokenFactory.deploy(initialSupply)
    await token.deployed();
  })

  it("Should token transfer correct with receipt & logs", async function () {   
    const amount = ethers.utils.parseEther('200.0')
    const txresponse:TransactionResponse =
      await  token.transfer(await account1.getAddress(),amount)
    const txreceipt: TransactionReceipt = 
      await txresponse.wait()

    // console.log(txreceipt.logs[0])
    const abifile = require("../artifacts/contracts/ClassToken.sol/ClassToken.json")
    const iface:ContractInterface = new ethers.utils.Interface(abifile.abi)
    const event:LogDescription = iface.parseLog(txreceipt.logs[0])
    // console.log(event.args)

    expect(event.name).is.equal('Transfer')
    expect(event.args?.from).is.equal(await owner.getAddress())
    expect(event.args?.to).is.equal(await account1.getAddress())
    expect(event.args?.value).is.equal(amount)
  })

})
