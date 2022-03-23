// src/playBadge.ts
import { BigNumber, Signer, ContractInterface } from "ethers"
import { ethers } from "hardhat"
import { ClassBadge } from  "../typechain"
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import { LogDescription } from "@ethersproject/abi"

async function main() {

  let account0:Signer,account1:Signer, account2:Signer
  [account0, account1, account2] = await ethers.getSigners()
  const address0=await account0.getAddress()
  const address1=await account1.getAddress()
  const address2=await account2.getAddress()
 
  /* deploy */
  const ClassBadge = await ethers.getContractFactory("ClassBadge")
  const token:ClassBadge = await ClassBadge.deploy()
  await token.deployed();

  console.log("ClassBadge deployed to:", token.address)

  const abifile = require("../artifacts/contracts/ClassBadge.sol/ClassBadge.json")
  const iface:ContractInterface = new ethers.utils.Interface(abifile.abi)
       
  /* mint */
  let txresponse:TransactionResponse
  let txreceipt:TransactionReceipt
  
  txresponse = await token.safeMint(address0)
  txreceipt = await txresponse.wait()

  let e:LogDescription = iface.parseLog(txreceipt.logs[0])
  console.log("==mint==")
  // console.log("Events In this Tx")
  // console.log("└──ClassBadge",token.address)

  printNFTEvent(e)

  txresponse = await token.approve(address1,1)
  txreceipt = await txresponse.wait()

  e = iface.parseLog(txreceipt.logs[0])
  console.log("==approve==")

  printNFTEvent(e)

  txresponse = await token.approve(ethers.constants.AddressZero,1)
  txreceipt = await txresponse.wait()

  e = iface.parseLog(txreceipt.logs[0])
  console.log("==remove approve==")

  printNFTEvent(e)

  txresponse = await token.setApprovalForAll(address1,true)
  txreceipt = await txresponse.wait()

  e = iface.parseLog(txreceipt.logs[0])
  console.log("==setApprovalForAll==")

  printNFTEvent(e)

  txresponse = await token.setApprovalForAll(address1,false)
  txreceipt = await txresponse.wait()

  e = iface.parseLog(txreceipt.logs[0])
  console.log("==remove operator==")

  printNFTEvent(e)
  // console.log(e)
  console.log(e)
  // console.log(typeof e.args)
  
  // console.log(e.args.length)
  // console.log(e.args[0])
  // e.args.map(i=>console.log(i))
//   for(var name in e.args) {
//     console.log(name,e.args[name])
//  }
}

function printNFTEvent( event:LogDescription){
  switch(event.name){
    case "Transfer":
      const {from,to,tokenId} = event.args

      console.log("Event")
      console.log("   └──",event.name)
      console.log("       ├──from:", from)
      console.log("       ├──to  :", to)
      console.log("       └──tokenId:", tokenId.toNumber())
      break
    case "Approval":
      // const {owner,approved,tokenId} = event.args

      const tokenId2:BigNumber = event.args?.tokenId
      console.log("Event")
      console.log("   └──",event.name)
      console.log("       ├──owner:", event.args?.owner)
      console.log("       ├──approved:", event.args?.approved)
      console.log("       └──tokenId:", tokenId2.toNumber())

      break
    case "ApprovalForAll":
      const {owner,operator,approved} = event.args

      console.log("Event")
      console.log("   └──",event.name)
      console.log("       ├──owner:", owner)
      console.log("       ├──operator:", operator)
      console.log("       └──approved:", approved)

      break
    default:
      break    
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
