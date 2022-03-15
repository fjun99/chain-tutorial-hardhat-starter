import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { ClassToken } from "../typechain/ClassToken"

describe("ClassToken", function () {
  const initialSupply = ethers.utils.parseEther('10000.0')
  let token:ClassToken
  let owner:Signer, account1:Signer
  let address1:string

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()
    address1 = await account1.getAddress()
    
    const ClassTokenFactory = await ethers.getContractFactory("ClassToken")
    token = await ClassTokenFactory.deploy(initialSupply)
    await token.deployed();
  })

  it("Should have the correct initial supply", async function () {
    expect(await token.totalSupply()).to.equal(initialSupply)
  })

  it("Should token transfer with correct balance", async function () {
    // expect(address1).to.be.properAddress
    const amount = ethers.utils.parseEther('200.0')

    await expect(async () => token.transfer(address1,amount))
            .to.changeTokenBalance(token, account1, amount)
    await expect(async () => token.connect(account1).transfer(await owner.getAddress(),amount))
            .to.changeTokenBalance(token, owner, amount)    
  })

  it("Should revert to transfer token exceed balance", async function () {
    const exceedAmount = ethers.utils.parseEther('10001.0')
    await expect(token.transfer(address1,exceedAmount))
            .to.be.reverted
    await expect(token.transfer(address1,exceedAmount))
            .to.be.revertedWith('ERC20: transfer amount exceeds balance')
  })

  
})
