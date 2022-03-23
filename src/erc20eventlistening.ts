// src/erc20event.ts
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
  txresponse =  await token.transfer(address1,parseEther('100.0'))
  console.log("doing transfer...")

  const transferEvent = token.filters.Transfer(address0)
  token.on(transferEvent,async (from, to, value ,event)=>{
    console.log("blocknumber", event.blockNumber)
    console.log("Event")
    console.log("   └──",event.event)
    console.log("       ├──from:", from)
    console.log("       ├──to  :", to)
    console.log("       └──value:", formatEther( value))
  })

}


main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
