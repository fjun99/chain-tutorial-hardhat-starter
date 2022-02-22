const { expect } = require("chai")
const { ethers } = require("hardhat")
import { BigNumberish } from "ethers"
import { BytesLike } from "@ethersproject/bytes"
import { Contract, Signer } from "ethers"

interface Post {
    id: BigNumberish,
    title: string,
    contentHash: BytesLike,
    published: boolean,
    }  

describe("Blog", async function () {
  let initialblogName = "My blog"
  let blog:Contract
  let posts:Post[]
  let owner:Signer
  let account1:Signer
  
  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners()
    const Blog = await ethers.getContractFactory("Blog")
    blog = await Blog.deploy(initialblogName)
    await blog.deployed()
  })
    
  it("Should create a post", async function () {
    const blogTitle = "My first post"
    const contentHash = ethers.utils.id("12345")

    await blog.createPost(blogTitle, contentHash)

    const posts = await blog.fetchPosts()

    //this is the first post, so it is posts[0]
    expect(posts[0].title).to.equal(blogTitle)
    expect(posts[0].contentHash).to.equal(contentHash)
    expect(posts[0].id).to.equal(1)
  })  

  it("Should create 3 post with incremental id", async function () {
    const contentHash = ethers.utils.id("12345")

    await blog.createPost("My first post", contentHash)
    await blog.createPost("My second post", contentHash)
    await blog.createPost("My third post", contentHash)

    const posts = await blog.fetchPosts()

    expect(posts[0].title).to.equal("My first post")
    expect(posts[0].id).to.equal(1)

    expect(posts[1].title).to.equal("My second post")
    expect(posts[1].id).to.equal(2)

    expect(posts[2].title).to.equal("My third post")
    expect(posts[2].id).to.equal(3)
  })

  it("Should edit a post", async function () {
    const blogTitle = "My first post"
    const contentHash = ethers.utils.id("12345")
    const newBlogTitle = "My updated post"
    const newContentHash = ethers.utils.id("23456")

    await blog.createPost(blogTitle, contentHash)

    //change title and contentHash 
    await blog.updatePost(1, newBlogTitle, newContentHash, true)

    posts = await blog.fetchPosts()
    expect(posts[0].title).to.equal(newBlogTitle)
    expect(posts[0].contentHash).to.equal(newContentHash)
  })

  it("Should update the blog name by owner", async function () {
    const newBlogName = "My new blog"
    expect(await blog.name()).to.equal(initialblogName)
    await blog.updateName(newBlogName)
    expect(await blog.name()).to.equal(newBlogName)
  })

  it("Should revert to update the blog name not by owner", async function () {
    const newBlogName = "My new blog"
    expect(await blog.name()).to.equal(initialblogName)
    await expect(blog.connect(account1).updateName(newBlogName)).to.be.reverted
  })

  it("Should transfer owner successfuly and update name by new owner", async function () {
    expect(await blog.name()).to.equal(initialblogName)

    await blog.transferOwnership(await account1.getAddress())

    const newBlogName = "My new blog"
    await blog.connect(account1).updateName(newBlogName)
    expect(await blog.name()).to.equal(newBlogName)
  })

})
