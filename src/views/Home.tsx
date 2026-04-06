
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'

import ConnectWalletButton from '@/components/ConnectWalletButton'

import LoadingPlaceholder from '@/components/LoadingPlaceholder'
import Header from '@/components/mcw/Header'
import AssetsList from '@/components/mcw/AssetsList'
import Button from '@/components/mcw/items/Button'
import { useStorage } from '@/contexts/StorageContext'

export default function Home(props) {
  const {
    gotoPage,
    params,
    on404
  } = props

  const { getValue } = useStorage()

  const accounts = getValue('accounts')
  
  useEffect(() => {
    if (accounts.length == 0) {
      gotoPage('/welcome')
    }
  }, [ accounts ])
  const {
    isConnected,
    injectedAccount
  } = useInjectedWeb3()

  return (
    <>
      <Header
        logo={true}
        wallets={true}
        networks={true}
        theme={true}
      />
      <AssetsList />
    </>
  )
}
