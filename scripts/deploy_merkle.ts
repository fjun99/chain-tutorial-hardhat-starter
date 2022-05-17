
import { ethers } from "hardhat";

async function main() {

  const Merkle = await ethers.getContractFactory("Merkle")
  const merkle = await Merkle.deploy()
  await merkle.deployed()

  console.log("merkle deployed to:", merkle.address);
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
