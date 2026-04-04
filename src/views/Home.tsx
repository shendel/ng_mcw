
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'

import ConnectWalletButton from '@/components/ConnectWalletButton'

import LoadingPlaceholder from '@/components/LoadingPlaceholder'
import Header from '@/components/mcw/Header'

export default function Home(props) {
  const {
    gotoPage,
    params,
    on404
  } = props

  const {
    isConnected,
    injectedAccount
  } = useInjectedWeb3()


  return (
    <>
      <Header
        logo={true}
        wallets={true}
        theme={true}
      />
      Home page
    </>
  )
}
