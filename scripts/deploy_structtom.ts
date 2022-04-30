
import { ethers } from "hardhat"

async function main() {

  const StructTom = await ethers.getContractFactory("StructTom")
  const contract = await StructTom.deploy()

  await contract.deployed()

  console.log("Contract StructTom deployed to:", contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
