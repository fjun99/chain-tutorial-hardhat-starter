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

  async delta () {
    const { delta } = await this.deltaWithFees()
    return delta
  }

  async deltaWithFees () {
    const current = await balanceCurrent(this.account)
    const delta = current.sub(this.prev)
    this.prev = current

    const fees = await feesPaid(this.account, this.prevBlock)
    this.prevBlock = await ethers.provider.getBlockNumber()

    return {
        delta: delta,
        fees: fees,
      }
  }

  async get () {
    this.prev = await balanceCurrent(this.account)
    this.prevBlock = await ethers.provider.getBlockNumber()
    return this.prev
  }
}

async function balanceTracker (owner:string) {
  const tracker = new Tracker(owner)
  await tracker.get()
  return tracker
}

async function balanceCurrent (account:string) {
    return await ethers.provider.getBalance(account)
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

module.exports = {
  current: balanceCurrent,
  tracker: balanceTracker,
}