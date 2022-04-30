
import { ethers } from "hardhat"

async function main() {

  const EtherReceiver = await ethers.getContractFactory("EtherReceiver")
  const contract = await EtherReceiver.deploy()

  await contract.deployed()

  console.log("Contract EtherReceiver deployed to:", contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
