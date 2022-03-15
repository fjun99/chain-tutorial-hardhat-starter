// src/playERC20.ts
import { Signer } from "ethers"
import { ethers } from "hardhat"
import { parseEther, formatEther } from "ethers/lib/utils"
import { ClassToken } from  "../typechain"

async function main() {

  let account0:Signer,account1:Signer, account2:Signer
  [account0, account1, account2] = await ethers.getSigners()
  const address0=await account0.getAddress()
  const address1=await account1.getAddress()
  const address2=await account2.getAddress()
 
  /* deploy */
  const initialSupply = ethers.utils.parseEther('10000.0')
  const ClassToken = await ethers.getContractFactory("ClassToken")
  const token:ClassToken = await ClassToken.deploy(initialSupply)
  // await token.deployed()

  console.log("ClassToken deployed to:", token.address)
  console.log("==give allowance 100.0==")
  await token.approve(address1,parseEther('100.0'))
  let allowance = await token.allowance(address0,address1)
  console.log(formatAddress(address0,2),"give allowance to ", formatAddress(address1,2),formatEther(allowance),"CLT")

  console.log("==transferFrom 50.0==")
  await token.connect(account1).transferFrom(address0,address2,parseEther('50.0'))
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

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
