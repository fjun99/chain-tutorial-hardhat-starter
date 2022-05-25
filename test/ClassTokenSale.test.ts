import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { ClassToken, ClassTokenSale } from "../typechain"
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider"

const parseEther = ethers.utils.parseEther

describe("ClassToken", function () {
  const initialSupply = parseEther('10000.0')
  let token:ClassToken, tokenSale:ClassTokenSale
  let owner:Signer, account1:Signer

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()
    
    const ClassToken = await ethers.getContractFactory("ClassToken")
    token = await ClassToken.deploy(initialSupply)
    await token.deployed()
    
    const ClassTokenSale = await ethers.getContractFactory("ClassTokenSale")
    tokenSale = await ClassTokenSale.deploy(token.address,'100')
    await tokenSale.deployed()

    token.transfer(tokenSale.address,parseEther('5000.0'))  
  })

  it("Should pre-deposit CLT correctly and can withdraw", async function () {
    expect(await token.balanceOf(tokenSale.address)).to.equal(parseEther('5000.0'))

    await tokenSale.withdrawAll()
    expect(await token.balanceOf(tokenSale.address)).to.equal(0)
    expect(await token.balanceOf(await owner.getAddress())).to.equal(initialSupply)
  })

  it("Should withdraw revert if not owner", async function () {
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    await expect(tokenSale_forbuyer.withdrawAll()).to.be.reverted
  })

  it("Should withdraw revert if there is none", async function () {
    await tokenSale.withdrawAll()
    await expect(tokenSale.withdrawAll()).to.be.revertedWith("nothing to withdraw")
  })

  it("Should buy CLT correctly", async function () {
    const price = await tokenSale.tokenPrice()
    const eth_value = parseEther('1.0')
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    await tokenSale_forbuyer.buy({value:eth_value})

    expect(await token.balanceOf(await account1.getAddress()))
      .to.equal(price.mul(eth_value))
  })

  it("Should buy CLT correctly with gas calculation", async function () {
    const address1 = await account1.getAddress()
    const balanceBefore = await ethers.provider.getBalance(address1)

    const eth_value = parseEther('1.0')
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    const tx:TransactionResponse = await tokenSale_forbuyer.buy({value:eth_value})
    const txreceipt:TransactionReceipt = await tx.wait()

    const gas = txreceipt.gasUsed.mul(txreceipt.effectiveGasPrice)
    const balanceAfter = await ethers.provider.getBalance(address1)

    expect(balanceAfter).to.equal(balanceBefore.sub(eth_value).sub(gas) )
  })

  it("Should buy CLT with 50.1 ETH be reverted", async function () {
    const eth_value = parseEther('50.1')
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    await expect(tokenSale_forbuyer.buy({value:eth_value})).to.be.revertedWith('insufficient token')
  })

  it("Should buy CLT with no ETH be reverted", async function () {
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    await expect(tokenSale_forbuyer.buy()).to.be.revertedWith('must supply eth')
  })
})
