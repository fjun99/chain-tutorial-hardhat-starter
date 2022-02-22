import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, Signer } from "ethers"

describe("OwnableGreeter with prefix", function () {
  let greeter:Contract
  let owner:Signer
  let account1:Signer

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()

    const Greeter = await ethers.getContractFactory("NewOwnableGreeter")
    greeter = await Greeter.deploy("Hello, world!")
    await greeter.deployed()
  })

  it("Should return the new greeting once it's changed", async function () {
    const prefix = await greeter.prefix()
    expect(await greeter.greet()).to.equal(prefix.concat("Hello, world!"))

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!")

    // wait until the transaction is mined
    await setGreetingTx.wait()

    expect(await greeter.greet()).to.equal(prefix.concat("Hola, mundo!"))
  });

  it("Should set prefix by owner", async function () {
    const prefix = await greeter.prefix()
    expect(await greeter.greet()).to.equal(prefix.concat("Hello, world!"))

    await greeter.setPrefix("GG: ")

    expect(await greeter.greet()).to.equal("GG: ".concat("Hello, world!"))
  })

  it("Should revert to set prefix *NOT* by owner", async function () {
    await expect(greeter.connect(account1).setPrefix("GG: ")).to.be.reverted
  })
})
