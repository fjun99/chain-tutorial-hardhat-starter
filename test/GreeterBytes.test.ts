import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract } from "ethers"

describe("GreeterBytes", function () {

  let greeter:Contract
  const originalGreet = ethers.utils.formatBytes32String("Hello, world!")

  beforeEach(async function () {
    const Greeter = await ethers.getContractFactory("GreeterBytes")
    greeter = await Greeter.deploy(originalGreet)
    await greeter.deployed()
  })

  it("Should return the new greeting once it's changed", async function () {

    expect(await greeter.greet()).to.equal(originalGreet)

    const newgreet = ethers.utils.formatBytes32String("Hola, mundo!")
    const setGreetingTx = await greeter.setGreeting(newgreet)

    // wait until the transaction is mined
    await setGreetingTx.wait()

    expect(await greeter.greet()).to.equal(newgreet)

    console.log(await greeter.greet())
  })

  it("Should return the prefixed greeting ", async function () {
    const newgreet = ethers.utils.formatBytes32String("ABCDEFGHIJKLMNOPQRSTUVWXYZabcde")  //29 bytes
    const setGreetingTx = await greeter.setGreeting(newgreet)

    // wait until the transaction is mined
    await setGreetingTx.wait()

    const bytesStr = await greeter.greet()
    // expect(await greeter.greet()).to.equal(""newgreet)

    console.log("bytesStr:",bytesStr)
    console.log("bytesStr:",ethers.utils.parseBytes32String(bytesStr), ethers.utils.parseBytes32String(bytesStr).length)

    const withPrefix = await greeter.greetWithPrefix()
    console.log("bytesStrPrefix:",withPrefix)
    console.log("bytesStrPrefix:",ethers.utils.parseBytes32String(withPrefix), 
                  ethers.utils.parseBytes32String(withPrefix).length)
    console.log(ethers.utils.toUtf8String(withPrefix))
    expect(ethers.utils.parseBytes32String(withPrefix)).is.equal("GR:ABCDEFGHIJKLMNOPQRSTUVWXYZab")
    // expect(ethers.utils.toUtf8String(withPrefix)).is.equal("GR:ABCDEFGHIJKLMNOPQRSTUVWXYZab")


    const prefixBytes = await greeter.greetWithPrefixBytes()
    console.log("greetWithPrefixBytes:",prefixBytes)
    // console.log("greetWithPrefixBytes:",ethers.utils.parseBytes32String(prefixBytes), 
    //               ethers.utils.parseBytes32String(prefixBytes).length)


    const withPrefixStr = await greeter.greetWithPrefixStr()
    console.log("bytesStrPrefixStr:",withPrefixStr, withPrefixStr.length)

    console.log(ethers.utils.toUtf8Bytes(withPrefixStr))
    // console.log(ethers.utils.stripZeros(withPrefixStr))
    // expect(withPrefixStr).is.equal("GR:"+"abcdedghijklmnopqrstuvwxyz123")
    
  })

})
