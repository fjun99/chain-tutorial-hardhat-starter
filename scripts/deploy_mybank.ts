
import { ethers } from "hardhat";

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther

async function main() {

  const MyBank = await ethers.getContractFactory("MyBank")
  const mybank = await MyBank.deploy({value:parseEther('1.0')})
  await mybank.deployed()

  console.log("MyBank deployed to:", mybank.address);


  console.log("Balance after deployment:",formatEther(await ethers.provider.getBalance(mybank.address)))

  console.log("deposit 50.0 ETH")

  await mybank.deposit({value:parseEther('50.0')})
  console.log("Balance after deposit:",formatEther(await ethers.provider.getBalance(mybank.address)))

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
