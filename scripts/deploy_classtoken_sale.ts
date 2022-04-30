import { ethers } from "hardhat";
import { ClassToken } from "../typechain"

const formatEther = ethers.utils.formatEther

async function main() {

  const initialSupply = ethers.utils.parseEther('10000.0')
  const ClassToken = await ethers.getContractFactory("ClassToken")
  const token = await ClassToken.deploy(initialSupply)
  await token.deployed()

  console.log("ClassToken deployed to:", token.address)

  const ClassTokenSale = await ethers.getContractFactory("ClassTokenSale")
  const tokenSale = await ClassTokenSale.deploy(token.address,'100')
  await tokenSale.deployed()

  console.log("ClassTokenSale deployed to:", tokenSale.address)
  const [owner] = await ethers.getSigners()

  const mytokeninstance:ClassToken = await ethers.getContractAt("ClassToken",token.address)
  await mytokeninstance.transfer(tokenSale.address,ethers.utils.parseEther('5000.0'))
  console.log("ClassToken in tokenSale contract:", formatEther(await mytokeninstance.balanceOf(tokenSale.address)))
  console.log("ClassToken in owner:",formatEther(await mytokeninstance.balanceOf(await owner.getAddress())))  
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
