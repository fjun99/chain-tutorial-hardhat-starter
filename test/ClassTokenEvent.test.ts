import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { ClassToken } from "../typechain/ClassToken"

describe("ClassToken", function () {
  const initialSupply = ethers.utils.parseEther('10000.0')
  let token:ClassToken
  let owner:Signer, account1:Signer,account2:Signer
  let address1:string, address0:string

  beforeEach(async function () {
    [owner, account1, account2] = await ethers.getSigners()
    address0 = await owner.getAddress()
    address1 = await account1.getAddress()
    
    const ClassTokenFactory = await ethers.getContractFactory("ClassToken")
    token = await ClassTokenFactory.deploy(initialSupply)
    await token.deployed();
  })

  it("Should token transfer with correct event", async function () {
    const amount = ethers.utils.parseEther('200.0')
    await expect(token.transfer(address1,amount))
      .to.emit(token, 'Transfer')
      .withArgs(address0, address1, amount)

    await expect(token.connect(account1).transfer(address0,amount))
      .to.emit(token, 'Transfer')
      .withArgs(address1, address0, amount)
  })

  it("Should approve and transferFrom with correct event", async function () {
    const amount = ethers.utils.parseEther('200.0')
    await expect(token.approve(address1,amount))
      .to.emit(token, 'Approval')
      .withArgs(address0, address1, amount)

    const address2 =  await account2.getAddress()
    await expect(token.connect(account1).transferFrom(address0,address2,amount))
      .to.emit(token, 'Transfer')
      .withArgs(address0, address2, amount)
  })

})
