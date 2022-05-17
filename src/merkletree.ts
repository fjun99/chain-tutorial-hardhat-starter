import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

const whitelistAddresses=[
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
    '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
    '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
    '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    '0x976ea74026e726554db657fa54763abd0c3a0aa9'
]

const leafNodes = whitelistAddresses.map(addr => keccak256(addr))
const merkleTree = new MerkleTree(whitelistAddresses, keccak256, {hashLeaves: true,sortPairs:true})

const rootHash = merkleTree.getHexRoot()

console.log(leafNodes.map(item => item.toString('hex')))

console.log("Whitelist Merke Tree\n",merkleTree.toString())

console.log("rootHash:",rootHash)


const claimingAdress = whitelistAddresses[0]
const leaf = keccak256(claimingAdress)
const hexProof = merkleTree.getHexProof(leaf)

console.log("claimingAdress",claimingAdress)
console.log("hexProof",hexProof)