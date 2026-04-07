import TokenAbi from 'human-standard-token-abi'
import { Interface as AbiInterface } from '@ethersproject/abi'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import { fromWei } from '@/helpers/wei'


const fetchBalancesMC = (options) => {
  const {
    chainId,
    accountAddress,
    tokenContracts = []
  } = {
    ...options
  }
  
  return new Promise((resolve, reject) => {
    const multicall = getMultiCall(chainId)
    const abiI = new AbiInterface(TokenAbi)
    const mcI = getMultiCallInterface()
    const mcA = getMultiCallAddress(chainId)
    
    const calls = {
      balance: { func: 'getEthBalance', target: mcA, encoder: mcI, args: [ accountAddress ]}
    }
    tokenContracts.forEach((tokenContract) => {
      calls[`${tokenContract}_balance`] = { func: 'balanceOf', target: tokenContract, encoder: abiI, args: [ accountAddress ]}
      calls[`${tokenContract}_decimals`] = { func: 'decimals', target: tokenContract, encoder: abiI}
    })
    callMulticall({
      multicall,
      target: mcA,
      encoder: mcI,
      calls: calls,
    }).then((answer) => {
      const result = {
        balance: {
          wei: answer.balance,
          normal: fromWei(answer.balance, 18)
        }
      }
      tokenContracts.forEach((tokenContract) => {
        result[tokenContract] = {
          wei: answer[`${tokenContract}_balance`],
          normal: fromWei(answer[`${tokenContract}_balance`], answer[`${tokenContract}_decimals`])
        }
      })
      console.log('answer', answer)
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
    
  })
}


export default fetchBalancesMC