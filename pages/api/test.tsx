import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { ethers } from "ethers";
const Web3 = require("web3");
import { contractABI, contractAddress, skaleConnectionString } from '../../lib/const'

// const BN = Web3.utils.BN;

// Setup Web3 Instance
// var web3 = new Web3(
//     new Web3.providers.HttpProvider(
//         "https://hackathon.skalenodes.com/v1/downright-royal-saiph"
//     )
// );

// Setup Contract Instance
// const tokenContract = new web3.eth.Contract(
//     contractABI,
//     contractAddress
// );

// // Setup Wallet
// web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);





const HDWalletProvider = require("@truffle/hdwallet-provider");


// No 0x prefix


const myPrivateKeyHex = process.env.WALLET_PRIVATE_KEY
// const infuraProjectId = "123123123";

const provider = new Web3.providers.HttpProvider(skaleConnectionString);
console.log(provider)

// Create web3.js middleware that signs transactions locally
const localKeyProvider = new HDWalletProvider({
    privateKeys: [myPrivateKeyHex],
    providerOrUrl: skaleConnectionString// provider,
});
console.log(localKeyProvider)


const web3 = new Web3(localKeyProvider);
console.log(web3)

const myAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKeyHex);
console.log(myAccount)
// Interact with existing, already deployed, smart contract on Ethereum mainnet

console.log('address', contractAddress)
const myContract = new web3.eth.Contract(contractABI as any, contractAddress);
console.log('myContract', myContract)






const Test = async (req: NextApiRequest, res: NextApiResponse) => {
    // make sure user is signed in
    const session = await getSession({ req })


    if (req.method === 'PUT') {
        console.log('TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST')
        const sym = await myContract.methods.symbol().call()
        console.log(sym)


        // const currentDuration = await myContract.methods.stakingTime().call();
        // const currentAmount = await myContract.methods.stakingAmount().call();

        // console.log('Transaction signer account is', myAccount.address, ', smart contract is', address);

        // console.log('Starting transaction now');
        // Approve this balance to be used for the token swap
        const receipt = await myContract.methods.transfer('0x3dcB8D010ab88B53d4DEF04c0158FB0169c1C49E', 1000).send({ from: myAccount.address });
        console.log('TX receipt', receipt);

    }

    // Handle any other HTTP method
    res.status(200).json({ message: 'Nothing happened.' })
}

export default Test
