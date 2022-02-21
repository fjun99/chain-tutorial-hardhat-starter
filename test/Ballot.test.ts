import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, Signer } from "ethers"
import { formatBytes32String } from "ethers/lib/utils"
import { BigNumber } from "@ethersproject/bignumber"

describe("Ballot", async function () {
  let ballot:Contract
  let owner:Signer
  const proposals = ['proA','proB','proC']
  let proposalsBytes32:Array<string> = []
  proposals.map((pro)=>proposalsBytes32.push(formatBytes32String(pro)))
  let voters:Array<string> = []

  beforeEach(async function () {
    [owner] = await ethers.getSigners()
    const contractFactory= await ethers.getContractFactory("Ballot")
    ballot = await contractFactory.deploy(proposalsBytes32)
    await ballot.deployed()

    //prepare voters, voters[0] is the chairperson
    let accounts = await ethers.getSigners();
    for (const account of accounts) {
        voters.push(account.address)
    }

    // add one by one
    // for(let i=1;i<10;i++){
    //     ballot.giveRightToVote(voters[i])
    // }

    // add function giveRightToVotes in Smart contract
    // add batch here
    ballot.giveRightToVotes(voters.slice(1,10))
  })
  
  it("Should winning proposal be the first one", async function () {
    expect(await ballot.winningProposal()).to.equal(0)
    expect(await ballot.winnerName()).to.equal(proposalsBytes32[0])

    expect((await ballot.proposals(0)).voteCount).to.equal(BigNumber.from(0))
  })

  
  it("Should revert if trying to vote agin", async function () {
    //first vote
    ballot.vote(0)
    //second vote
    await expect(ballot.vote(0)).to.be.reverted
  })

  it("Should revert if vote with no voter", async function () {
    //Account #10
    const signer = await ethers.getSigner('0xbcd4042de499d14e55001ccbb24a551f3b954096')
    await expect(ballot.connect(signer).vote(0)).to.be.reverted
  })

  it("Should revert if delegate to self", async function () {
    let signer
    signer = await ethers.getSigner(voters[1])
    await expect(ballot.connect(signer).delegate(voters[1])).to.be.reverted
  })

  it("Should delegate successfully and vote correctly", async function () {
    //voter[1] -> voter[0], proB(1) got 2 
    let signer
    signer = await ethers.getSigner(voters[1])
    await ballot.connect(signer).delegate(voters[0])

    //delegate before vote
    //voter[0] choose proB(1) 
    ballot.vote(1)

    //voter[2] choose proC(2)
    signer = await ethers.getSigner(voters[2])
    await ballot.connect(signer).vote(2)

    //proB(1) should win 
    expect(await ballot.winningProposal()).to.equal(1)
    expect((await ballot.proposals(1)).voteCount).to.equal(BigNumber.from(2))
  })

  it("Should add weigh(+1) if vote after delegate", async function () {
    //voter[1] -> voter[0], proB(1) got 2 
    let signer
    signer = await ethers.getSigner(voters[1])
    await ballot.connect(signer).delegate(voters[0])

    //delegate before vote
    //voter[0] choose proB(1) 
    ballot.vote(1)

    expect((await ballot.voters(voters[0])).weight).to.equal(BigNumber.from(2))
  }) 

  it("Should not add weigh(+1) if vote before delegate", async function () {
    //delegate after vote
    //voter[0] choose proB(1) 
    ballot.vote(1)

    //voter[1] -> voter[0], proB(1) got 2 
    let signer
    signer = await ethers.getSigner(voters[1])
    await ballot.connect(signer).delegate(voters[0])

    expect((await ballot.voters(voters[0])).weight).to.equal(BigNumber.from(1))
  })

  it("Should revert if delegate loop", async function () {
    // 1->2, 2->3, 3->1(will revert)
    let signer
    signer = await ethers.getSigner(voters[1])
    await ballot.connect(signer).delegate(voters[2])

    signer = await ethers.getSigner(voters[2])
    await ballot.connect(signer).delegate(voters[3])

    expect((await ballot.voters(voters[3])).weight).to.equal(BigNumber.from(3))

    signer = await ethers.getSigner(voters[3])
    await expect(ballot.connect(signer).delegate(voters[1])).to.be.reverted
  })

})
