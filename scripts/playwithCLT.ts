import { ethers } from "hardhat"
import { Contract  } from "ethers"
import { formatEther, parseEther} from "@ethersproject/units"
import { TransactionResponse, TransactionReceipt } from "@ethersproject/providers"

// *** please DEPLOY ClassToken to localhost first ***

const contractaddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

async function main() {
//  get ERC20 token contract  
    const token = await ethers.getContractAt( "ClassToken",contractaddress)

    console.log("Token Info: ",token.address)
    const symbol = await token.symbol()
    console.log("Symbol: ", symbol)
    const totalSupply = await token.totalSupply()
    console.log("TotalSupply :  ",formatEther(totalSupply))

//  prepare initial state
    const accounts = await ethers.getSigners()
    let addresses = ["","","","",""]
    for(let i=0;i<5;i++){
        addresses[i] = await accounts[i].getAddress()
    }

    console.log("\nstate 1, initial state")
    const allocation = ['2000','2000','2000','2000','2000']
    for(let i=1;i< addresses.length;i++){
        await token.transfer(addresses[i],parseEther(allocation[i]))
    }
    await printBalances(token,addresses,symbol)

//  change state by transfer and print receipt
    console.log("\nstate, after account[1] -->50CLT--> account[2] & other 4")
    const txresponse:TransactionResponse = await token.connect(accounts[1]).transfer(addresses[2],parseEther('50'))
    const txreceipt:TransactionReceipt = await ethers.provider.getTransactionReceipt(txresponse.hash)
  
    await token.connect(accounts[1]).transfer(addresses[3],parseEther('100'))
    await token.connect(accounts[3]).transfer(addresses[4],parseEther('300'))
    await token.connect(accounts[4]).transfer(addresses[0],parseEther('5'))
    await token.connect(accounts[0]).transfer(addresses[3],parseEther('30'))

    await printBalances(token,addresses,symbol)
 
//  query logs to get all the logs
    console.log("\nprint all transfer logs")
    const filter = token.filters.Transfer();
    const logs = await token.queryFilter(filter, 0, "latest");
    
    for(let i=0;i<logs.length;i++){    
        console.log(formatAddress(logs[i].args?.from,4),
                    formatAddress(logs[i].args?.to,4),
                    formatEther(logs[i].args?.value))
    }

    console.log("\ntransfer details from receipt: account[1] -->50CLT--> account[2]")
    console.log("Transfer from:",addresses[1])
    console.log("Transfer to:",addresses[2])
    console.log("transaction receipt.logs[0]:")
    console.log(txreceipt.logs[0])
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

async function printBalances(token:Contract,addresses:string[],symbol:string){
    console.log("\n === balance ===")
    for(let i=0;i< addresses.length;i++){
        const balance = await token.balanceOf(addresses[i])
        console.log(formatAddress(addresses[i]),":",formatEther(balance)," ",symbol)
    }
}

function formatAddress(value: string, length: number = 4) {
    return `${value.substring(0, length + 2)}...${value.substring(value.length - length)}`
}
