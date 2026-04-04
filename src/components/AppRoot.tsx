import { useState, useEffect } from 'react'

import ModalProvider from "@/contexts/ModalContext";
import NotificationProvider from "@/contexts/NotificationContext"
import HashRouterProvider from '@/contexts/HashRouterProvider'
import MarkDownProvider from '@/contexts/MarkDownContext'

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

  return (
    <>
      <MarkDownProvider>
        <NotificationProvider>
          <ModalProvider>
            <HashRouterProvider>
              {children}
            </HashRouterProvider>
          </ModalProvider>
        </NotificationProvider>
      </MarkDownProvider>
    </>
  )
}