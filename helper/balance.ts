//https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/master/src/balance.js
import { ethers } from "hardhat"
import { BigNumber } from "ethers"

class Tracker {
  account: string
  prev: BigNumber
  prevBlock: number

  constructor (acc:string) {
    this.account = acc
    this.prev = BigNumber.from(0)
    this.prevBlock = 0
  }

  async get () {
    this.prev = await balance(this.account)
    this.prevBlock = await ethers.provider.getBlockNumber()
    return this.prev
  }

  async deltaWithFees () {
    const current = await balance(this.account)
    const delta = current.sub(this.prev)
    this.prev = current

    const fees = await feesPaid(this.account, this.prevBlock)
    this.prevBlock = await ethers.provider.getBlockNumber()

    return {
        delta: delta,
        fees: fees,
      }
  }

  async delta () {
    const { delta } = await this.deltaWithFees()
    return delta
  }

}

async function feesPaid (account:string, sinceBlock:number) {
  const currentBlock =  await ethers.provider.getBlockNumber()
  let gas = BigNumber.from(0)

  for (let b = sinceBlock + 1; b <= currentBlock; b += 1) {
    const { transactions } = await ethers.provider.getBlockWithTransactions(b)
    for (const tx of transactions) {
      if (tx.from === account) {
        const txreceipt = await tx.wait()
        const txgas  = tx.gasPrice?.mul(txreceipt.gasUsed)
        gas = gas.add(BigNumber.from(txgas))
      }
    }
  }

  return gas
}

export async function balance(account:string) {
  return await ethers.provider.getBalance(account)
}

export async function tracker (owner:string) {
  const tracker = new Tracker(owner)
  await tracker.get() //set original state
  return tracker
}
