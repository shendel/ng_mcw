// @ts-nocheck
import { configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import NETWORKS from '@/constants/NETWORKS'
import { STORAGE_KEYS } from '@/config'

import { mainnet } from 'wagmi/chains'

export const GET_ALL_CHAINS = () => {
  let lsNetworks = false
  try {
    lsNetworks = localStorage.getItem('networks')
    lsNetworks = JSON.parse(lsNetworks)
  } catch (e) {}

  const _N = (lsNetworks) ? lsNetworks : NETWORKS
  return Object.keys(_N).map((chainName) => {
    return {
      id: _N[chainName].chainId,
      network: chainName,
      name: _N[chainName].name,
      nativeCurrency: _N[chainName].nativeCurrency,
      explorer: _N[chainName].explorer,
      contracts: {
        ensUniversalResolver: false
      },
      rpcUrls: {
        default: {
          http: [
            _N[chainName].rpc
          ]
        },
        public: {
          http: [
            _N[chainName].rpc
          ]
        }
      },
    }
  })
}

export const GET_CHAIN_BYID = (chainId) => {
  let lsNetworks = false
  try {
    lsNetworks = localStorage.getItem('networks')
    lsNetworks = JSON.parse(lsNetworks)
  } catch (e) {}

  const _N = (lsNetworks) ? lsNetworks : NETWORKS
  
  const info = 
    Object
    .keys(_N)
      .filter((chainName) => {
        return _N[chainName].chainId == chainId
    })
    .map((chainName) => {
      return {
        id: _N[chainName].chainId,
        network: chainName,
        name: _N[chainName].name,
        nativeCurrency: _N[chainName].nativeCurrency,
        explorer: _N[chainName].explorer,
        contracts: {
          ensUniversalResolver: (_N[chainName].ensUniversalResolver) ? {
            address: _N[chainName].ensUniversalResolver,
          } : false
        },
        rpcUrls: {
          default: {
            http: [
              _N[chainName].rpc
            ]
          },
          public: {
            http: [
              _N[chainName].rpc
            ]
          }
        },
      }
    })
  return info[0] || false
}

const GET_CHAIN = (chainName) => {
  return {
    id: NETWORKS[chainName].chainId,
    network: chainName,
    name: NETWORKS[chainName].name,
    nativeCurrency: NETWORKS[chainName].nativeCurrency,
    rpcUrls: {
      default: {
        http: [
          NETWORKS[chainName].rpc
        ]
      },
      public: {
        http: [
          NETWORKS[chainName].rpc
        ]
      }
    },
  }
}

export const GET_TX_LINK = (chainId, hash) => {
  return NETWORKS[chainId].explorer + '/tx/' + hash
}

export const GET_CHAIN_RPC = (chainId) => {
  let lsNetworks = false
  try {
    lsNetworks = localStorage.getItem('networks')
    lsNetworks = JSON.parse(lsNetworks)
  } catch (e) {}
  if (lsNetworks) {
    const chainData = lsNetworks.find((nd) => { return Number(chainId) == Number(nd.chainId) })
    console.log('from ls')
    if (chainData) return chainData.rpc
  }  
  const chainData = Object.keys(NETWORKS).filter((chainName) => {
    return `${NETWORKS[chainName].chainId}` == `${chainId}`
  })
  if (chainData.length) return NETWORKS[chainData[0]].rpc
}

export const GET_CHAIN_MULTICALL = (chainId) => {
  let lsNetworks = false
  try {
    lsNetworks = localStorage.getItem('networks')
    lsNetworks = JSON.parse(lsNetworks)
  } catch (e) {}
  if (lsNetworks) {
    const chainData = lsNetworks.find((nd) => { return Number(chainId) == Number(nd.chainId) })
    console.log('from ls')
    if (chainData) return chainData.multicall
  }
  const chainData = Object.keys(NETWORKS).filter((chainName) => {
    return `${NETWORKS[chainName].chainId}` == `${chainId}`
  })
  if (chainData.length) return NETWORKS[chainData[0]].multicall
}

export const getChainsConfig = (chainIds) => {
  const networks = (chainIds == undefined)
    ? GET_ALL_CHAINS()
    : (chainIds instanceof Array)
      ? chainIds.map((chainId) => { return GET_CHAIN_BYID(chainId) })
      : [GET_CHAIN_BYID(chainIds)]
console.log('>>> networks', networks)
  return configureChains(
    networks,
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: GET_CHAIN_RPC(chain.id),
        }),
      }),
    ],
  )
}
