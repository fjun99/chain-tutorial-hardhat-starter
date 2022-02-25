import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, Signer } from "ethers"

describe("ClassToken", function () {
  const initialSupply = ethers.utils.parseEther('10000.0')
  let token:Contract
  let owner:Signer
  let account1:Signer

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()

    const ClassToken = await ethers.getContractFactory("ClassToken")
    token = await ClassToken.deploy(initialSupply)
    await token.deployed();
  })

  it("Should have the correct initial supply", async function () {
    expect(await token.totalSupply()).to.equal(initialSupply)
  })

  it("Should token transfer with correct balance", async function () {
    expect(await account1.getAddress()).to.be.properAddress
    
    const amount = ethers.utils.parseEther('200.0')

    await expect(async () => token.transfer(await account1.getAddress(),amount))
            .to.changeTokenBalance(token, account1, amount)
  })

  it("Should revert to transfer token exceed balance", async function () {
    const exceedAmount = ethers.utils.parseEther('10001.0')
    await expect(token.transfer(await account1.getAddress(),exceedAmount))
            .to.be.reverted
    await expect(token.transfer(await account1.getAddress(),exceedAmount))
            .to.be.revertedWith('ERC20: transfer amount exceeds balance')
  })

})
