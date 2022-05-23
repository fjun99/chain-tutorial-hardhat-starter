import { ethers } from "hardhat";

async function main() {

  const MyPermitToken = await ethers.getContractFactory("MyPermitToken")
  const token = await MyPermitToken.deploy()
  await token.deployed()

  console.log("MyPermitToken deployed to:", token.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
