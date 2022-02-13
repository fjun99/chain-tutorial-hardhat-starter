import { task } from "hardhat/config";
import { types } from "hardhat/config";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { Contract } from "ethers";
import { TransactionResponse,TransactionReceipt } from "@ethersproject/abstract-provider";

// refer: 
// https://docs.alchemy.com/alchemy/tutorials/how-to-create-an-nft/how-to-mint-an-nft-with-ethers

// a testtask: yarn hardhat testtask --token-uri 'abc'
task("testtask", "test task")
  .addParam("tokenUri", "Your ERC721 Token URI", undefined, types.string)
  .setAction(async (tokenUri, hre) => {
      console.log(tokenUri)
  });

// yarn hardhat transfer --network localhost --amount '10.0' --to '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' 
task("transfer", "Transfer ERC20 ClassToken(CLT) at 0x5FbDB2315678afecb367f032d93F642f64180aa3")
  .addParam("to", "To Address", undefined, types.string)
  .addParam("amount","Amount",undefined,types.string)
  .setAction(async (params, hre) => {
    console.log(params)
    const tokenAddress= '0x5FbDB2315678afecb367f032d93F642f64180aa3'

    return getContractAt(hre,"ClassToken",tokenAddress,hre.ethers.provider.getSigner())
      .then((contract: Contract) => {
        return contract.transfer(params.to, hre.ethers.utils.parseEther(params.amount));
      })
      .then((tr: TransactionResponse) => {
        // console.log("tr",tr)
        return tr.wait().then((receipt:TransactionReceipt)=>{
          console.log("transfer receipt got, transfer completed at block:",receipt.blockNumber)
        })
        // process.stdout.write(`TX hash: ${tr.hash}`);
      }).catch((e:Error)=>console.log(e))
});
