
import { useEffect, useState, Component } from "react"


import Header from '@/components/mcw/Header'
import AssetsList from '@/components/mcw/AssetsList'
import Button from '@/components/mcw/items/Button'
import { useStorage } from '@/contexts/StorageContext'
import DaoModalConnect from '@/views/modals/dao/Connect'
import DaoModalSignTx from '@/views/modals/dao/SignTx'
import DaoModalSignMessage from '@/views/modals/dao/SignMessage'
import DaoModalConfirm from '@/views/modals/dao/Confirm'

import { useModal } from '@/contexts/ModalContext'

export default function Home(props) {
  const {
    gotoPage,
    params,
    on404
  } = props

  const { openModal } = useModal()
  const { getValue } = useStorage()

  const accounts = getValue('accounts')
  
  useEffect(() => {
    if (accounts.length == 0) {
      gotoPage('/welcome')
    }
  }, [ accounts ])

  const handleTest = () => {
    openModal({
      id: 'ADD_TOKEN',
      onlyLayer: true,
      fullWidth: true,
      onBgClick: () => { },
      content: (
        <DaoModalConfirm />
      )
    })
  }
  return (
    <>
      <Header
        logo={true}
        wallets={true}
        networks={true}
        gotoPage={gotoPage}
        theme={true}
      />
      
      <div className="animate-fade-in pt-4">
        <AssetsList
          gotoPage={gotoPage}
        />
        <button onClick={handleTest}>test</button>
      </div>
    </>
  )
}
