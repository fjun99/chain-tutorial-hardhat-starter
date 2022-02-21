// Test using truffle, web3 and OpenZeppelin Test Helper
//  
// yarn add @nomiclabs/hardhat-truffle5 @nomiclabs/hardhat-web3
// https://hardhat.org/guides/truffle-testing.html
// yarn add @openzeppelin/test-helpers
// https://docs.openzeppelin.com/test-helpers/0.5/
// github: https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/master/src/expectEvent.js

const {
  BN,
  constants,
  expectEvent,
  expectRevert,
  ether,
} = require('@openzeppelin/test-helpers')

const ClassToken = artifacts.require("ClassToken")
contract('ClassToken', (accounts)=> {
  beforeEach(async function () {
    this.value = new BN(1);
    this.erc20 = await ClassToken.new(ether('10000.0'));
  })

  it('emits a Transfer event on successful transfers', async function () {
    const receipt = await this.erc20.transfer(
      accounts[1], this.value, { from: accounts[0] }
    )

    expectEvent(receipt, 'Transfer', {
      from: accounts[0],
      to: accounts[1],
      value: this.value,
    })
  })
})

const Blog = artifacts.require("Blog")
contract('Blog', (accounts)=> {
  const blogTitle = "My first post"
  const contentHash = ethers.utils.id("12345")

  beforeEach(async function () {
    this.blog = await Blog.new('my blog');
  })

  it('emits a PostCreated event on successful new post', async function () {
    const receipt = await this.blog.createPost(
      blogTitle, contentHash, { from: accounts[0] }
    )

    expectEvent(receipt, 'PostCreated', {
      id: new BN(1),
      title: blogTitle,
      contentHash: contentHash,
    })

  })
})
