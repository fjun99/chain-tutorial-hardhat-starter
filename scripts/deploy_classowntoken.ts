import { ethers } from "hardhat";

async function main() {

  const initialSupply = ethers.utils.parseEther('10000')
  const ClassOwnToken = await ethers.getContractFactory("ClassOwnToken")
  const token = await ClassOwnToken.deploy(initialSupply)
  await token.deployed()

  console.log("ClassOwnToken deployed to:", token.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
