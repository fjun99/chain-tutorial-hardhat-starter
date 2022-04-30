import { Signer } from "ethers"
import { ethers } from "hardhat"
import { EtherStore, EtherStoreAttack } from  "../typechain"

async function main() {
  let account0:Signer,account1:Signer, account2:Signer
  [account0, account1, account2] = await ethers.getSigners()
 
  // deploy store
  const EtherStore = await ethers.getContractFactory("EtherStore")
  const store:EtherStore = await EtherStore.deploy()
  await store.deployed()

  await store.depositFunds({value:ethers.utils.parseEther('10.0')})

  const bal = await ethers.provider.getBalance(store.address)
  console.log("store balance:", ethers.utils.formatEther(bal))

  // deploy attack contract
  const EtherStoreAttack = await ethers.getContractFactory("EtherStoreAttack")
  const attack:EtherStoreAttack = await EtherStoreAttack.deploy(store.address)
  await attack.deployed()

  // attack!
  await attack.attackEtherStore({value:ethers.utils.parseEther('1.0')})
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
