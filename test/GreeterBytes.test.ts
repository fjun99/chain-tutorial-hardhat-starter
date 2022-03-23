import { expect } from "chai"
import { ethers } from "hardhat"

describe("Greeter - Normal", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("GreeterBytes")

    const greet = ethers.utils.formatBytes32String("Hello, world!")
    const greeter = await Greeter.deploy(greet)
    await greeter.deployed()

    expect(await greeter.greet()).to.equal(greet)

    const newgreet = ethers.utils.formatBytes32String("Hola, mundo!")
    const setGreetingTx = await greeter.setGreeting(newgreet)

    // wait until the transaction is mined
    await setGreetingTx.wait()

    expect(await greeter.greet()).to.equal(newgreet)
  })
})
