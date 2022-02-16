import { expect } from "chai"
import { ethers } from "hardhat"
import { formatEther,parseEther } from "ethers/lib/utils"
import { Contract, Signer } from "ethers"
import { BigNumber } from "@ethersproject/bignumber"
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider"


describe("Purchase", async function () {
  let shopcontract:Contract
  let owner:Signer
  let account1:Signer
  let account2:Signer
  const value = '5.0'

  enum State { Created, Locked, Release, Inactive }

  beforeEach(async function () {
    [owner,account1,account2] = await ethers.getSigners()
    const contractFactory= await ethers.getContractFactory("Purchase")
    shopcontract = await contractFactory.deploy({value: parseEther(value).mul(2)})
    await shopcontract.deployed()
  })
  
  it("Should seller be deployer and value correct", async function () {
    expect(await shopcontract.value()).to.equal(parseEther(value))
    expect(await shopcontract.seller()).to.equal(await owner.getAddress())
    expect(await shopcontract.buyer()).to.equal(ethers.constants.AddressZero)
    expect(await shopcontract.state()).to.equal(State.Created)
  })

  it("Should seller abort correctly and get refund", async function () {
    const balanceBefore = await ethers.provider.getBalance(await owner.getAddress())

    const tx:TransactionResponse = await shopcontract.abort()
    expect(await shopcontract.state()).to.equal(State.Inactive)

    const txreceipt =await ethers.provider.getTransactionReceipt(tx.hash)
    const gas = txreceipt.gasUsed.mul(txreceipt.effectiveGasPrice)
    const balanceAfter = await ethers.provider.getBalance(await owner.getAddress())

    // balanceAfter = balanceBefore + value*2 - gas
    expect(balanceAfter).to.equal(balanceBefore.add( parseEther(value).mul(2)).sub(gas) )
  })

  it("Should buyer offer correctly", async function () {
    const msgvalue= parseEther(value).mul(2)
    await shopcontract.connect(account1).confirmPurchase({value:msgvalue})
    expect(await shopcontract.buyer()).to.equal(await account1.getAddress())
    expect(await shopcontract.state()).to.equal(State.Locked)
  })

  it("Should revert if another buyer offer again", async function () {
    const msgvalue= parseEther(value).mul(2)
    await shopcontract.connect(account1).confirmPurchase({value:msgvalue})
    await expect(shopcontract.connect(account2).confirmPurchase({value:msgvalue})).to.be.reverted
  })

  it("Should revert if value is not correct", async function () {
    const msgvalue= parseEther('6.0').mul(2)
    await expect(shopcontract.connect(account1).confirmPurchase({value:msgvalue})).to.be.reverted
  })

  it("Should buyer offer and confirmReceived corretly ", async function () {
    const msgvalue= parseEther(value).mul(2)
    await shopcontract.connect(account1).confirmPurchase({value:msgvalue})

    const balanceBefore = await ethers.provider.getBalance(await account1.getAddress())

    //confirm item received
    const tx:TransactionResponse = await shopcontract.connect(account1).confirmReceived()
    expect(await shopcontract.state()).to.equal(State.Release)

    //shoule get refund *value*
    const txreceipt = await ethers.provider.getTransactionReceipt(tx.hash)
    const gas = txreceipt.gasUsed.mul(txreceipt.effectiveGasPrice)
    const balanceAfter = await ethers.provider.getBalance(await account1.getAddress())

    // balanceAfter = balanceBefore + value - gas
    expect(balanceAfter).to.equal(balanceBefore.add( parseEther(value)).sub(gas) )
  })

  it("Should seller get refund corretly", async function () {
    const msgvalue= parseEther(value).mul(2)

    //buyer
    await shopcontract.connect(account1).confirmPurchase({value:msgvalue})
    await shopcontract.connect(account1).confirmReceived()
    expect(await shopcontract.state()).to.equal(State.Release)

    //seller
    const balanceBefore = await ethers.provider.getBalance(await owner.getAddress())

    const tx = await shopcontract.refundSeller()
    expect(await shopcontract.state()).to.equal(State.Inactive)

    const txreceipt =await ethers.provider.getTransactionReceipt(tx.hash)
    const gas = txreceipt.gasUsed.mul(txreceipt.effectiveGasPrice)
    const balanceAfter = await ethers.provider.getBalance(await owner.getAddress())

    // balanceAfter = balanceBefore + value*3 - gas
    expect(balanceAfter).to.equal(balanceBefore.add( parseEther(value).mul(3)).sub(gas) )

  })
})
