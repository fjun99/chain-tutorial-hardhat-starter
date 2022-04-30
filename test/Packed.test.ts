import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract } from "ethers"

describe("Packed", function () {
  let contract:Contract

  beforeEach(async function () {
    const PackedContract = await ethers.getContractFactory("Packed");
    contract = await PackedContract.deploy()
    await contract.deployed()
  })

  it("ab+c", async function () {
    const r = await contract.fbytes()
    console.log(r)

    // console.log(ethers.utils.zeroPad( r , 32 ) )
    console.log(ethers.utils.toUtf8String(r))
    // console.log(ethers.utils.parseBytes32String(r))

    const r2 = await contract.fbytes32()
    console.log("fbytes32",r2)
    console.log(ethers.utils.toUtf8String(r2))
    console.log(ethers.utils.parseBytes32String(r2))

    const bb = ethers.utils.formatBytes32String("a1b1cde")
    await contract.dcd(bb)


    const r3 = await contract.fstring()
    console.log(r3)


    await contract.comparestr()
  })
  
})
