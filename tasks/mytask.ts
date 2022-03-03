// tasks/mytasks.ts
import { task } from "hardhat/config";
import { types } from "hardhat/config";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { Contract } from "ethers";
import { TransactionResponse,TransactionReceipt } from "@ethersproject/abstract-provider";

// yarn hardhat transfer --amount '10.0' --to '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' --network localhost 
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
        return tr.wait().then((receipt:TransactionReceipt)=>{
          console.log("transfer receipt got, transfer completed at block:",receipt.blockNumber)
        })
      }).catch((e:Error)=>console.log(e))
});

// a testtask: yarn hardhat testtask --token-desc 'abc'
task("testtask", "a test task")
  .addParam("tokenDesc", "Token Desc", "default-desc", types.string)
  .setAction(async (tokenDesc, hre) => {
      console.log(tokenDesc)
  });
