import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { MyPermitToken } from "../typechain/MyPermitToken"

//privateKey for Account#0:0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const wallet = new ethers.Wallet(privateKey)

const types = {
    'Permit':[
        {name:'owner',type:'address'},
        {name:'spender',type:'address'},
        {name:'value',type:'uint256'},
        {name:'nonce',type:'uint256'},
        {name:'deadline',type:'uint256'}
    ]
};

const transfervalue = ethers.utils.parseEther("1.0");

let domain = {
    name: 'MyPermitToken',
    version: '1',
    chainId: '31337',
    verifyingContract: ''
};

let token:MyPermitToken
let account0:Signer, account1:Signer
let senderAddress:string,spenderAddress:string

describe("MyPermitToken", function () {

  beforeEach(async function () {
    [account0, account1] = await ethers.getSigners()

    senderAddress = await wallet.getAddress()
    spenderAddress = await account1.getAddress()
    
    const MyPermitTokenFactory = await ethers.getContractFactory("MyPermitToken")
    token = await MyPermitTokenFactory.deploy()
    await token.deployed();
  })

  it("Should have the correct initial supply", async function () {
    const initialSupply = ethers.utils.parseEther('10000.0')
    expect(await token.totalSupply()).to.equal(initialSupply)
  })

  it("should set allowance with permit() sent by one's own address", async () => {
    const blocktime = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
    const deadline = blocktime + 20*1000
    const nonce = await token.nonces(senderAddress)

    domain.verifyingContract = token.address

    let value ={
        owner:senderAddress,
        spender:spenderAddress,
        value:transfervalue,
        nonce:nonce,
        deadline:deadline
        }

    let signature = await wallet._signTypedData(domain, types, value)
    let sig = ethers.utils.splitSignature(signature)
    
    // const TypedDataEncoder = ethers.utils._TypedDataEncoder
    // console.log(JSON.stringify(TypedDataEncoder.getPayload(domain,types,value)))
    // console.log(signature)
    //
    // Note : you can sign this using metamask: localhost, 0x..66
    // ethereum.request({ method: 'eth_requestAccounts' });
    // account = ethereum.selectedAddress
    // ethereum.request({
    //       method: 'eth_signTypedData_v4',
    //       params: [account,msgParams, ],
    //       from: account,
    //     }).then(console.log)

    await expect(token.permit(
        senderAddress,
        spenderAddress,
        transfervalue,
        deadline,
        sig.v,
        sig.r,
        sig.s)
    ).to.emit(token, 'Approval').withArgs(senderAddress, spenderAddress, transfervalue)

    expect(await token.allowance(senderAddress,spenderAddress)).to.be.equal(transfervalue)

    const newtokeninstance = await token.connect(account1)
    await newtokeninstance.transferFrom(senderAddress,spenderAddress,transfervalue)

    expect(await token.allowance(senderAddress,spenderAddress)).to.be.equal(0)
    expect(await token.balanceOf(spenderAddress)).to.be.equal(transfervalue)
    expect(await token.nonces(senderAddress)).to.be.equal(nonce.add(1))
  }); 

  it("should set allowance with permit() sent by another address", async () => {
    const blocktime = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
    const deadline = blocktime + 20*1000
    const nonce = await token.nonces(senderAddress)

    domain.verifyingContract = token.address

    let value ={
        owner:senderAddress,
        spender:spenderAddress,
        value:transfervalue,
        nonce:nonce,
        deadline:deadline
        }

    let signature = await wallet._signTypedData(domain, types, value)
    let sig = ethers.utils.splitSignature(signature)

    const newtokeninstance = await token.connect(account1)

    await newtokeninstance.permit(
        senderAddress,
        spenderAddress,
        transfervalue,
        deadline,
        sig.v,
        sig.r,
        sig.s)

    expect(await token.allowance(senderAddress,spenderAddress)).to.be.equal(transfervalue)

  }); 

  it("should revert with wrong nonce", async () => {
    const blocktime = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
    const deadline = blocktime + 20*1000
    const nonce = await token.nonces(senderAddress)

    domain.verifyingContract = token.address

    let value ={
        owner:senderAddress,
        spender:spenderAddress,
        value:transfervalue,
        nonce:nonce.add(1),
        deadline:deadline
        }

    let signature = await wallet._signTypedData(domain, types, value)
    let sig = ethers.utils.splitSignature(signature)

    await expect(token.permit(
        senderAddress,
        spenderAddress,
        transfervalue,
        deadline,
        sig.v,
        sig.r,
        sig.s)
        ).to.be.reverted
  });  


  it("should revert with wrong deadline", async () => {
    const blocktime = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
    const deadline = blocktime
    const nonce = await token.nonces(senderAddress)

    domain.verifyingContract = token.address

    let value ={
        owner:senderAddress,
        spender:spenderAddress,
        value:transfervalue,
        nonce:nonce,
        deadline:deadline
        }

    let signature = await wallet._signTypedData(domain, types, value)
    let sig = ethers.utils.splitSignature(signature)

    await expect(token.permit(
        senderAddress,
        spenderAddress,
        transfervalue,
        deadline,
        sig.v,
        sig.r,
        sig.s)
        ).to.be.reverted
  });  

  it("should revert if replay", async () => {
    const blocktime = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
    const deadline = blocktime + 20*1000
    const nonce = await token.nonces(senderAddress)

    domain.verifyingContract = token.address

    let value ={
        owner:senderAddress,
        spender:spenderAddress,
        value:transfervalue,
        nonce:nonce,
        deadline:deadline
        }

    let signature = await wallet._signTypedData(domain, types, value)
    let sig = ethers.utils.splitSignature(signature)

    await token.permit(
        senderAddress,
        spenderAddress,
        transfervalue,
        deadline,
        sig.v,
        sig.r,
        sig.s)

    await expect(token.permit(
        senderAddress,
        spenderAddress,
        transfervalue,
        deadline,
        sig.v,
        sig.r,
        sig.s)
        ).to.be.reverted
  }); 
})
