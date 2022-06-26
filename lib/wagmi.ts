import { Chain, configureChains, createClient } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { InjectedConnector } from 'wagmi/connectors/injected'

const alchemyId = process.env.ALCHEMY_ID
// const infuraId = process.env.INFURA_ID

const skaleChain: Chain = {
    id: 0x40b9020d,
    name: 'Skale',
    network: 'Skale',
    nativeCurrency: {
        decimals: 18,
        name: 'Skale',
        symbol: 'SVL',
    },
    rpcUrls: {
        default: 'https://hackathon.skalenodes.com/v1/downright-royal-saiph',
    },
    testnet: false,
}

const { provider, chains } = configureChains(
    [skaleChain],
    [
        alchemyProvider({ alchemyId }),
        // infuraProvider({ infuraId }),
        jsonRpcProvider({
            rpc: (chain) => {
                if (chain.id !== skaleChain.id) return null
                return { http: chain.rpcUrls.default }
            },
        }),
    ],
)

const wagmiClient = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider,
})


export default wagmiClient

