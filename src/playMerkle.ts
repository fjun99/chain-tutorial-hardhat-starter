import { Signer } from "ethers"
import { ethers } from "hardhat"


async function main() {

  console.log("play merkle")

  const signers = await ethers.getSigners()
  const abifile = require("../artifacts/contracts/Merkle.sol/Merkle.json")
  const abi = abifile.abi

  console.log(abi)
  const merkle = new ethers.Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3',abi,signers[0])

  const proof =  [
    '0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0',
    '0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63',
    '0x209d75d5e3d9985cc3bc49708a769f2f42a88f1eaa2236d38ed58aad88fc0819'
  ]

  await merkle.whitelistMint(proof)

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
