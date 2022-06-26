export const defaultProfilePicture =
   'https://storage.googleapis.com/innercircle_public_image_server/website_resource/azuki14014.png'
export const logoNoBackground =
   'https://storage.googleapis.com/innercircle_public_image_server/website_resource/logo_no_bg.png'
export const logoNameNoBackground =
   'https://storage.googleapis.com/innercircle_public_image_server/website_resource/logo_no_bg_w_name.png'

export const inviteMessageMaxLength = 250
export const contractAddress = '0x3dcB8D010ab88B53d4DEF04c0158FB0169c1C49E'
export const skaleConnectionString = 'https://hackathon.skalenodes.com/v1/downright-royal-saiph'
export const dmPrice = 1 * 100000 * 100000
export const contractABI = [
   {
      "inputs": [
         {
            "internalType": "string",
            "name": "name_",
            "type": "string"
         },
         {
            "internalType": "string",
            "name": "symbol_",
            "type": "string"
         }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
   },
   {
      "anonymous": false,
      "inputs": [
         {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
         },
         {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
         }
      ],
      "name": "Approval",
      "type": "event"
   },
   {
      "anonymous": false,
      "inputs": [
         {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
         },
         {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
         }
      ],
      "name": "Transfer",
      "type": "event"
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "owner",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "spender",
            "type": "address"
         }
      ],
      "name": "allowance",
      "outputs": [
         {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
         }
      ],
      "stateMutability": "view",
      "type": "function"
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "spender",
            "type": "address"
         },
         {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
         }
      ],
      "name": "approve",
      "outputs": [
         {
            "internalType": "bool",
            "name": "",
            "type": "bool"
         }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "account",
            "type": "address"
         }
      ],
      "name": "balanceOf",
      "outputs": [
         {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
         }
      ],
      "stateMutability": "view",
      "type": "function"
   },
   {
      "inputs": [],
      "name": "decimals",
      "outputs": [
         {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
         }
      ],
      "stateMutability": "view",
      "type": "function"
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "spender",
            "type": "address"
         },
         {
            "internalType": "uint256",
            "name": "subtractedValue",
            "type": "uint256"
         }
      ],
      "name": "decreaseAllowance",
      "outputs": [
         {
            "internalType": "bool",
            "name": "",
            "type": "bool"
         }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "spender",
            "type": "address"
         },
         {
            "internalType": "uint256",
            "name": "addedValue",
            "type": "uint256"
         }
      ],
      "name": "increaseAllowance",
      "outputs": [
         {
            "internalType": "bool",
            "name": "",
            "type": "bool"
         }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
   },
   {
      "inputs": [],
      "name": "name",
      "outputs": [
         {
            "internalType": "string",
            "name": "",
            "type": "string"
         }
      ],
      "stateMutability": "view",
      "type": "function"
   },
   {
      "inputs": [],
      "name": "symbol",
      "outputs": [
         {
            "internalType": "string",
            "name": "",
            "type": "string"
         }
      ],
      "stateMutability": "view",
      "type": "function"
   },
   {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
         {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
         }
      ],
      "stateMutability": "view",
      "type": "function"
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "to",
            "type": "address"
         },
         {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
         }
      ],
      "name": "transfer",
      "outputs": [
         {
            "internalType": "bool",
            "name": "",
            "type": "bool"
         }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "from",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "to",
            "type": "address"
         },
         {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
         }
      ],
      "name": "transferFrom",
      "outputs": [
         {
            "internalType": "bool",
            "name": "",
            "type": "bool"
         }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
   }
]