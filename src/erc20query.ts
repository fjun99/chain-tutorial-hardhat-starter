// src/erc20query.ts
import { Signer } from "ethers"
import { ethers } from "hardhat"
import { parseEther, formatEther } from "ethers/lib/utils"
import { BigNumber } from "ethers"
import {ContractInterface } from "ethers"
import { LogDescription } from "@ethersproject/abi"
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import { ClassToken } from  "../typechain"

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
async function main() {
  let txresponse:TransactionResponse, txreceipt:TransactionReceipt
  let event: LogDescription

  const abifile = require("../artifacts/contracts/ClassToken.sol/ClassToken.json")
  const iface:ContractInterface = new ethers.utils.Interface(abifile.abi)

  let account0:Signer,account1:Signer, account2:Signer
  [account0, account1, account2] = await ethers.getSigners()
  const address0=await account0.getAddress()
  const address1=await account1.getAddress()
  const address2=await account2.getAddress()
 
  const token:ClassToken = await ethers.getContractAt("ClassToken",contractAddress)

  console.log("ClassToken deployed to:", token.address)
  console.log("current blocknumber:",await ethers.provider.getBlockNumber())

  const approvalEvent = token.filters.Approval(address0)
  const logsApproval = await token.queryFilter(approvalEvent)
  console.log("Approval Events count: ",logsApproval.length)

  logsApproval.forEach(log => {
    console.log("blocknumber:",log.blockNumber)
    console.log("   └──",log.event)
    console.log("       ├──owner:", log.args?.owner)
    console.log("       ├──spender:", log.args?.spender)
    console.log("       └──value:", formatEther(log.args?.value))
  });

  const transferEvent = token.filters.Transfer(address0)
  const logsTransfer = await token.queryFilter(transferEvent)
  console.log("")
  console.log("Transfer Events count: ",logsTransfer.length)

  // console.log(logsTransfer)
  logsTransfer.forEach(log => {
    console.log("blocknumber:",log.blockNumber)
    console.log("   └──",log.event)
    console.log("       ├──from:", log.args?.from)
    console.log("       ├──to:", log.args?.to)
    console.log("       └──value:", formatEther(log.args?.value))
  });

}


main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
