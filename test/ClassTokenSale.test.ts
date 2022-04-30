import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { ClassToken, ClassTokenSale } from "../typechain"

const formatEther = ethers.utils.formatEther
const parseEther = ethers.utils.parseEther

describe("ClassToken", function () {
  const initialSupply = parseEther('10000.0')
  let token:ClassToken, tokenSale:ClassTokenSale
  let owner:Signer, account1:Signer
  let address1:string

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()
    address1 = await account1.getAddress()
    
    const ClassToken = await ethers.getContractFactory("ClassToken")
    token = await ClassToken.deploy(initialSupply)
    await token.deployed()
    
    const ClassTokenSale = await ethers.getContractFactory("ClassTokenSale")
    tokenSale = await ClassTokenSale.deploy(token.address,'100')
    await tokenSale.deployed()

    token.transfer(tokenSale.address,parseEther('5000.0'))  
  })

  it("Should deposit and withdraw CLT correctly", async function () {
    expect(await token.balanceOf(tokenSale.address)).to.equal(parseEther('5000.0'))

    await tokenSale.withdrawAll()
    expect(await token.balanceOf(tokenSale.address)).to.equal(0)
    expect(await token.balanceOf(await owner.getAddress())).to.equal(initialSupply)
  })

  it("Should buy CLT correctly", async function () {
    const price = await tokenSale.tokenPrice()
    const eth_value = parseEther('1.0')
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    await tokenSale_forbuyer.buy({value:eth_value})

    expect(await token.balanceOf(address1)).to.equal(price.mul(eth_value))
  })

  it("Should buy CLT with 50.1 ETH be reverted", async function () {
    const eth_value = parseEther('50.1')
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    await expect(tokenSale_forbuyer.buy({value:eth_value})).to.be.revertedWith('insufficient token')
  })

  it("Should buy CLT with no ETH be reverted", async function () {
    // const eth_value = parseEther('50.1')
    const tokenSale_forbuyer = await tokenSale.connect(account1)
    await expect(tokenSale_forbuyer.buy()).to.be.revertedWith('must supply eth')
  })

})
