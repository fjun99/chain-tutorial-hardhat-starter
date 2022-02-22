
import { ethers } from "hardhat";

async function main() {

  const Blog = await ethers.getContractFactory("Blog")
  const blog = await Blog.deploy("My blog")
  await blog.deployed()

  console.log("Blog deployed to:", blog.address);
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
