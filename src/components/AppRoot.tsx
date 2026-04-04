import { useState, useEffect } from 'react'

import ModalProvider from "@/contexts/ModalContext";
import NotificationProvider from "@/contexts/NotificationContext"
import HashRouterProvider from '@/contexts/HashRouterProvider'
import MarkDownProvider from '@/contexts/MarkDownContext'
import BrowserWeb3Provider from '@/web3/BrowserWeb3Provider'

import NETWORKS from '@/constants/NETWORKS'
import {
  MAINNET_CHAIN_ID,
  MAINNET_CONTRACT,
} from '@/config'

import { useStorage } from '@/contexts/StorageContext'

const allChainIds = Object.keys(NETWORKS).map((slug) => {
  return NETWORKS[slug].chainId
})

export default function AppRoot(props) {
  const {
    children,
  } = props

  const { getValue: getStorageValue } = useStorage()
  
  const accounts = getStorageValue('accounts') || []
  const activeAccountId = getStorageValue('activeAccount') || false
  
  
  const activeAccount = (activeAccountId)
    ? accounts.find(({ id }) => { return id == activeAccountId})
    : false
  
  const activeAccountPk = (activeAccount)
    ? activeAccount.wallet.privateKey
    : false

  console.log('activeAccountPk', activeAccountPk)
  
  const activeNetworkId = getStorageValue('activeNetwork')
  const networks = getStorageValue('networks')
  const activeNetwork = networks.find(({chainId}) => { return chainId == activeNetworkId })
  console.log('>>> activeNetwork', activeNetwork)
  const activeRPC = (activeNetwork)
    ? activeNetwork.rpc
    : false
  return (
    <>
      <BrowserWeb3Provider chainId={activeNetworkId} privateKey={activeAccountPk} rpc={activeRPC}>
        <MarkDownProvider>
          <NotificationProvider>
            <ModalProvider>
              <HashRouterProvider>
                {children}
              </HashRouterProvider>
            </ModalProvider>
          </NotificationProvider>
        </MarkDownProvider>
      </BrowserWeb3Provider>
    </>
  )
}