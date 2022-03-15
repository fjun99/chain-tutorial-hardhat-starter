import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { TransactionRequest, TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider"

describe("Send ETH gas checker", async function () {
  let account0:Signer, account1:Signer
  const value = ethers.utils.parseEther('5.0')

  it("Should send ETH correctly with gas", async function () {
    [account0, account1] = await ethers.getSigners()
    const address0 = await account0.getAddress()
    const address1 = await account1.getAddress()
    const balance0before = await ethers.provider.getBalance(address0)
    const balance1before = await ethers.provider.getBalance(address1)

    const tx: TransactionRequest = {
      to:address1,
      value:value
    }

    const txresponse:TransactionResponse = 
      await ethers.provider.getSigner().sendTransaction(tx)

    const txreceipt:TransactionReceipt =await txresponse.wait()
    const gas = txreceipt.gasUsed.mul(txreceipt.effectiveGasPrice)    

    const balance0after = await ethers.provider.getBalance(address0)
    const balance1after = await ethers.provider.getBalance(address1)

    expect(balance0after).to.equal(balance0before.sub(value).sub(gas) )
    expect(balance1after).to.equal(balance1before.add(value))
  })
})
