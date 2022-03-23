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
  console.log("==give allowance 100.0==")
  txresponse =  await token.approve(address1,parseEther('100.0'))

  txreceipt = await txresponse.wait()
  console.log(txreceipt)
  console.log(txreceipt.logs[0])
  event = iface.parseLog(txreceipt.logs[0])
  console.log(event)
  printEvent(event)

  let allowance = await token.allowance(address0,address1)
  console.log(formatAddress(address0,2),"give allowance to ", formatAddress(address1,2),formatEther(allowance),"CLT")


  console.log("==transferFrom 50.0==")
  txresponse =  await token.connect(account1).transferFrom(address0,address2,parseEther('70.0'))

  txreceipt = await txresponse.wait()
  console.log(txreceipt)
  console.log(txreceipt.logs[0])
  event = iface.parseLog(txreceipt.logs[0])
  printEvent(event)

  event = iface.parseLog(txreceipt.logs[1])
  printEvent(event)
  

  console.log(formatAddress(address0,2),":",formatEther(await token.balanceOf(address0))," CLT")
  console.log(formatAddress(address2,2),":",formatEther(await token.balanceOf(address2))," CLT")
  allowance = await token.allowance(address0,address1)
  console.log(formatAddress(address0,2),"give allowance to ", formatAddress(address1,2),formatEther(allowance)," CLT")

  await token.approve(address1,parseEther('0.0'))
  allowance = await token.allowance(address0,address1)
  console.log("==set allowance to 0==")
  console.log(formatAddress(address0,2),"give allowance to ", formatAddress(address1,2),formatEther(allowance)," CLT")

}

function formatAddress(value: string, length: number = 4) {
  return `${value.substring(0, length + 2)}...${value.substring(value.length - length)}`
}

function printEvent( event:LogDescription){
  switch(event.name){
    case "Transfer":
      const {from,to,value} = event.args

      console.log("Event")
      console.log("   └──",event.name)
      console.log("       ├──from:", from)
      console.log("       ├──to  :", to)
      console.log("       └──value:", formatEther( value))
      break
    case "Approval":
      // const {owner,approved,tokenId} = event.args

      const value1:BigNumber = event.args?.value
      console.log("Event")
      console.log("   └──",event.name)
      console.log("       ├──owner:", event.args?.owner)
      console.log("       ├──spender:", event.args?.spender)
      console.log("       └──value:", formatEther(event.args?.value))

      break

    default:
      break    
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
