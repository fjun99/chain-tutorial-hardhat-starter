import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, Signer} from "ethers"

// reference: https://hardhat.org/tutorial/testing-contracts.html

describe("ClassOwnToken", async function () {
  let token:Contract
  let owner:Signer
  let addr1:Signer
  const initialSupply = ethers.utils.parseEther('10000')
  const amountMint = ethers.utils.parseEther('5000')

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners()
    const ClassOwnToken = await ethers.getContractFactory("ClassOwnToken")
    token = await ClassOwnToken.deploy(initialSupply)
    await token.deployed()
  })
  
  it("Should have the correct initial supply", async function () {
    expect(await token.totalSupply()).to.equal(initialSupply)
  })

  it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(await owner.getAddress());
  });

  it("Should mint successfully mint() by owner", async function () {
    await token.mint(await owner.getAddress(),amountMint)
    expect(await token.totalSupply()).to.equal(initialSupply.add(amountMint))
  })

  it("Should emit correctEvent mint() by owner", async function () {
    const ownerAddress = await owner.getAddress()
    await expect(token.mint(ownerAddress,amountMint)).to.emit(token, 'Mint').withArgs(ownerAddress, amountMint);
  })

  it("Should revert mint() not called by owner", async function () {
    const tokenwithnewsigner = token.connect(addr1)
    await expect(tokenwithnewsigner.mint(await addr1.getAddress(),amountMint)).to.be.reverted
  })

  it("Should revert mint() with zero", async function () {
    await expect(token.mint(await owner.getAddress(),0)).to.be.reverted
  })

  it("Should revert mint() with wrong mintTo address", async function () {
    //correct: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    const wrongMintTo = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb9226' 
    await expect(token.mint(wrongMintTo,amountMint)).to.be.reverted
  })
})
