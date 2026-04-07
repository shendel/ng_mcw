
import { useEffect, useState, useRef } from "react"


import Header from '@/components/mcw/Header'
import AssetsList from '@/components/mcw/AssetsList'
import PopupMenu from '@/components/mcw/items/PopupMenu'
import Button from '@/components/mcw/items/Button'
import HideIcon from '@/components/mcw/icons/HideIcon'
import ReceiveIcon from '@/components/mcw/icons/ReceiveIcon'
import SendIcon from '@/components/mcw/icons/SendIcon'
import SwapIcon from '@/components/mcw/icons/SwapIcon'
import ExplorerIcon from '@/components/mcw/icons/ExplorerIcon'
import ChainIcon from '@/components/mcw/ChainIcon'
import CopyIcon from '@/components/mcw/icons/CopyIcon'
import CheckMarkIcon from '@/components/mcw/icons/CheckMarkIcon'

import { copyToClipboard } from '@/helpers/copyToClipboard'
import { useStorage } from '@/contexts/StorageContext'
import { useAssets } from '@/contexts/AssetsProvider'
import { GET_CHAIN_BYID } from '@/web3/chains'
import { getShortAddress } from '@/helpers/etherscan'

export default function AssetInfo(props) {
  const {
    gotoPage,
    params: {
      key: assetKey
    },
    on404
  } = props

  const { getValue: getStorageValue } = useStorage()
  const { getAsset } = useAssets()
  const assetInfo = getAsset(assetKey)
  console.log('>> assetInfo', assetInfo)
  
  const [ isContractCopied, setIsContractCopied ] = useState(false)
  useEffect(() => {
    if (isContractCopied) {
      const timer = setTimeout(() => {
        setIsContractCopied(false)
      }, 2000)
      
      return () => { clearTimeout(timer) }
    }
    
  }, [ isContractCopied ])
  
  const handleCopyContract = () => {
    setIsContractCopied(true)
    copyToClipboard(assetInfo.tokenInfo.tokenAddress)
  }
  
  if (!assetInfo) return null
  const chainInfo  = GET_CHAIN_BYID(assetInfo.chainId)
  
  return (
    <>
      <Header
        logo={false}
        wallets={false}
        networks={false}
        theme={false}
        title={assetInfo.symbol}
        titleCenter={true}
        backButton={true}
        onBackClick={() => { gotoPage('/') }}
        menuButton={true}
        menuItems={[
          {
            title: (<><ExplorerIcon />{`Открыть в обозревателе`}</>),
            onClick: () => {  }
          },
          {
            title: (<><HideIcon />{`Скрыть актив`}</>),
            onClick: () => {
            }
          }
        ]}
      />
      <div className="animate-fade-in">
        {/* Actions Buttons */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-[#1c1830] hover:bg-gray-200 dark:hover:bg-white/5 rounded transition-colors">
            <ReceiveIcon size={6} />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {`Получить`}
            </span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-[#1c1830] hover:bg-gray-200 dark:hover:bg-white/5 rounded transition-colors">
            <SendIcon size={6} />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {`Отправить`}
            </span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-[#1c1830] hover:bg-gray-200 dark:hover:bg-white/5 rounded transition-colors">
            <SwapIcon size={6} />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {`Поменять`}
            </span>
          </button>
        </div>
        {/* Asset balance and general info */}
        <div className="bg-gray-100 dark:bg-[#1c1830] rounded p-4 mt-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Ваш баланс</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">A7</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{assetInfo.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-gray-100">...</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{assetInfo.amount} {assetInfo.symbol}</div>
            </div>
          </div>
          
          
        </div>
        {/* Details */}
        <div className="space-y-1 mt-4 bg-gray-100 dark:bg-[#1c1830] rounded p-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {`Сеть`}
            </span>
            <div className="flex items-center gap-2">
              <ChainIcon chainId={assetInfo.chainId} />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{chainInfo.name}</span>
            </div>
          </div>
          {(assetInfo.type == 'TOKEN') && (
            <>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {`Адрес контракта`}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-wallet-purple bg-wallet-purple/10 px-2 py-1 rounded">
                      {getShortAddress(assetInfo.tokenInfo.tokenAddress)}
                    </span>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                      onClick={handleCopyContract}
                    >
                      {(isContractCopied) ? (
                        <CheckMarkIcon />
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      )}
                    </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {`Децималы токена`}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {assetInfo.tokenInfo.decimals}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}