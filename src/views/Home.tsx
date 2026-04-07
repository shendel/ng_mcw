
import { useEffect, useState, Component } from "react"


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

  return (
    <>
      <Header
        logo={true}
        wallets={true}
        networks={true}
        theme={true}
      />
      <AssetsList
        gotoPage={gotoPage}
      />
    </>
  )
}
