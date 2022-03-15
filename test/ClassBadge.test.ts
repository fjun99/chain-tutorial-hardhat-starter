import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { ClassBadge } from "../typechain"

describe("ClassBadge", function () {
  let token:ClassBadge
  let owner:Signer
  let account1:Signer

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()

    const ClassBadge = await ethers.getContractFactory("ClassBadge")
    token = await ClassBadge.deploy()
    await token.deployed();
  })

  it("Should have the correct name", async function () {
    expect(await token.name()).to.equal("ClassBadge")
  })

  it("Should mint NFT with Event correctly ", async function () {
    const address1 = await account1.getAddress()
    await expect(token.safeMint(address1))
      .to.emit(token, 'Transfer')
      .withArgs(ethers.constants.AddressZero, address1, 1)

    expect(await token.balanceOf(await owner.getAddress())).to.equal(0)
    expect(await token.balanceOf(address1)).to.equal(1)
    expect(await token.tokenOfOwnerByIndex(address1,0)).to.equal(1)
    expect(await token.tokenByIndex(0)).to.equal(1)
  })
})
