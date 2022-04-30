import { Signer } from "ethers"
import { ethers } from "hardhat"
import { TransactionRequest } from "@ethersproject/providers"
import { parseEther, formatEther } from "ethers/lib/utils"
import { EtherSend, EtherReceiver } from  "../typechain"

async function main() {

  const getBal = async function(address:any){return ethers.utils.formatEther(await ethers.provider.getBalance(address))}
  let account0:Signer,account1:Signer, account2:Signer
  [account0, account1, account2] = await ethers.getSigners()
  const address1=await account1.getAddress()
 
  // /* deploy */
  const EtherSend = await ethers.getContractFactory("EtherSend")
  const sendContract:EtherSend = await EtherSend.deploy()
  await sendContract.deployed()

  const tx:TransactionRequest = {
    to: sendContract.address,
    value: parseEther('1000.0')
  }
  await account0.sendTransaction(tx)

  console.log("EtherSend Contract:", sendContract.address)
  console.log("EtherSend Contract balance:", await getBal(sendContract.address))

  console.log("account1 balance:", await getBal(address1))

  const EtherReceiver = await ethers.getContractFactory("EtherReceiver")
  const receiverContract:EtherReceiver = await EtherReceiver.deploy()
  await receiverContract.deployed()
  
  console.log("EtherReceiver Contract:", receiverContract.address)
  console.log("EtherReceiver Contract balance:",await getBal(receiverContract.address))
  
  console.log("\n==playing here==")

  console.log("\n1. send to address1 (EOA)")
  console.log("=sendTestCall")
  await sendContract.sendTestCall(address1,parseEther('10.0'))
  console.log("account1 balance:",await getBal(address1))

  console.log("=sendTestSend")
  await sendContract.sendTestSend(address1,parseEther('10.0'))
  console.log("account1 balance:", await getBal(address1))

  console.log("=sendTestTransfer")
  await sendContract.sendTestTransfer(address1,parseEther('10.0'))
  console.log("account1 balance:", await getBal(address1))  
  console.log("EtherSend Contract balance:",await getBal(sendContract.address))

  console.log("\n2. send to EtherReceiver contract")

  console.log("=sendTestCall")
  await sendContract.sendTestCall(receiverContract.address,parseEther('10.0'))
  console.log("EtherReceiver Contract balance:", await getBal(receiverContract.address))

  console.log("=sendTestTransfer")
  await sendContract.sendTestTransfer(receiverContract.address,parseEther('10.0'))
  console.log("EtherReceiver Contract balance:", await getBal(receiverContract.address))

  console.log("=sendTestSend")
  await sendContract.sendTestSend(receiverContract.address,parseEther('10.0'))
  console.log("EtherReceiver Contract balance:", await getBal(receiverContract.address))

  console.log("EtherSend Contract balance:", await getBal(sendContract.address))

  console.log("\nend & withdraw ")
  await receiverContract.withdraw()
  console.log("EtherReceiver Contract balance:", await getBal(receiverContract.address))

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
