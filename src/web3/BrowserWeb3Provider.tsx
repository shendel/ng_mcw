import { useState, useEffect, createContext, useContext } from 'react'

import Web3 from 'web3'
import fetchBalance from '@/helpers/fetchBalance'

const authBrowserWeb3 = (rpc, privateKey) => {
  const web3 = new Web3(rpc)
  
  const account = web3.eth.accounts.privateKeyToAccount( privateKey )
  web3.eth.accounts.wallet.add( account.privateKey )

  return {
    web3,
    privateKey,
    rpc,
    account: account.address
  }
}

const BrowserWeb3Context = createContext({
  browserWeb3: false,
  browserAccount: false,
  browserPK: false,
  browserRPC: false,
  balance: 0,
  isBalanceFetched: false,
  isBalanceFetching: true,
  switchAccount: () => {},
  browserChainId: false,
  switchNetwork: () => {},
  isSwitchingNetwork: false,
})

export const useBrowserWeb3 = () => {
  return useContext(BrowserWeb3Context)
}

export default function BrowserWeb3Provider(props) {
  const {
    children,
    chainId,
    privateKey = false,
    rpc = false
  } = props
  const {
    chainIds
  } = {
    chainIds: [ chainId ],
    ...props
  }
  
  const [ browserWeb3, setBrowserWeb3 ] = useState(false)
  const [ browserAccount, setBrowserAccount ] = useState(false)
  const [ browserPK, setBrowserPK ] = useState(false)
  const [ browserRPC, setBrowserRPC ] = useState(false)
  
  const [ browserChainId, setBrowserChainId ] = useState(chainId)
  const [ activeChainId, setActiveChainId ] = useState(chainId)
  
  const [ activePK, setActivePK ] = useState(privateKey)
  const [ activeRPC, setActiveRPC ] = useState(rpc)
  
  useEffect(() => {
    if (activePK && activeRPC && activeChainId) {
      console.log('>>> pk changed', activePK)
      const { web3, account, privateKey } = authBrowserWeb3(activeRPC, activePK)
      setBrowserWeb3(web3)
      setBrowserAccount(account)
      setBrowserPK(privateKey)
      setBrowserRPC(activeRPC)
      setBrowserChainId(activeChainId)
    }
  }, [ activeChainId, activePK, activeRPC ])

  useEffect(() => {
    console.log('PK CHANGE')
    setActivePK(privateKey)
    setActiveChainId(rpc)
  }, [ privateKey, rpc ])
  const switchAccount = (newPK) => {
    const { web3, account, privateKey } = authBrowserWeb3(browserChainId, newPK)
    setBrowserWeb3(web3)
    setBrowserAccount(account)
    setBrowserPK(privateKey)
    
    return false
  }

  const switchNetwork = (newChainId) => {
    setActiveChainId(newChainId)
  }
  
  return (
    <BrowserWeb3Context.Provider
      value={{
        browserWeb3,
        browserPK,
        browserRPC,
        browserAccount,
        browserChainId,
        switchAccount,
        isSwitchingNetwork: false,
        switchNetwork,
      }}
    >
      {children}
    </BrowserWeb3Context.Provider>
  )
}