//https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/master/test/src/balance.test.js
import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { parseEther } from "@ethersproject/units"
import { TransactionRequest } from "@ethersproject/providers"
import { balance, tracker } from "../balance"

describe("balance.ts Test Helper", function () {
  let account0:Signer
  let account1:Signer
  let address0: string
  let address1: string

  beforeEach(async function () {
    [account0, account1] = await ethers.getSigners()
    address0 = await account0.getAddress()
    address1 = await account1.getAddress()
  })
  
  it('returns current balance ', async function () {
    expect(await balance(address0)).to.equal(await ethers.provider.getBalance(address0))

    const mytracker = await tracker(address0)
    expect(await mytracker.get()).to.equal(await ethers.provider.getBalance(address0))
  })

  it('returns correct deltas after get() checkpoint', async function () {
    const mytracker = await tracker(address1)
    await mytracker.get()

    await helperSendETH(account0,address1,'1.0')

    expect(await mytracker.delta()).to.equal(parseEther('1.0'))
  })

  it('returns balance increments', async function () {
    const mytracker = await tracker(address1)

    await helperSendETH(account0,address1,'1.0')

    expect(await mytracker.delta()).to.equal(parseEther('1.0'))
  })

  it('returns balance decrements', async function () {
    const mytracker = await tracker(address0)

    await helperSendETH(account0,address1,'1.0')
    await helperSendETH(account0,address1,'1.0')

    const { delta, fees } = await mytracker.deltaWithFees()
    expect(delta.add(fees)).to.equal(parseEther('-2.0'))
  })

  it('returns consecutive deltas', async function () {
    const mytracker = await tracker(address0)

    await helperSendETH(account0,address1,'1.0')

    await mytracker.delta()
    expect(await mytracker.delta()).to.equal(parseEther('0'))
  }) 
  
})

async function helperSendETH(sender:Signer,to:string,value:string){
  const tx:TransactionRequest = {
    from:await sender.getAddress(),
    to: to,
    value: parseEther(value),
    nonce: await sender.getTransactionCount(),
    gasLimit: ethers.utils.hexlify(21000),
    gasPrice: await sender.getGasPrice(),
  }

  await sender.sendTransaction(tx)
}  