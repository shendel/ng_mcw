import { useState, useRef, useEffect } from 'react'
import Button from '@/components/mcw/items/Button'
import AddIcon from '@/components/mcw/icons/AddIcon'
import EditIcon from '@/components/mcw/icons/EditIcon'
import DeleteIcon from '@/components/mcw/icons/DeleteIcon'
import CloseIcon from '@/components/mcw/icons/CloseIcon'
import HideIcon from '@/components/mcw/icons/HideIcon'
import ShowIcon from '@/components/mcw/icons/ShowIcon'
import SendIcon from '@/components/mcw/icons/SendIcon'
import SettingsIcon from '@/components/mcw/icons/SettingsIcon'
import ReceiveIcon from '@/components/mcw/icons/ReceiveIcon'
import InfoIcon from '@/components/mcw/icons/InfoIcon'
import PopupMenu from '@/components/mcw/items/PopupMenu'
import SelectAssetsNetworksModal from '@/views/modals/SelectAssetsNetworksModal'
import { useModal } from '@/contexts/ModalContext'
import { useStorage } from '@/contexts/StorageContext'
import { GET_CHAIN_BYID } from '@/web3/chains'
import AddTokenModal from '@/views/modals/AddTokenModal'
import MenuDotsIcon from '@/components/mcw/icons/MenuDotsIcon'
import { useAssets } from '@/contexts/AssetsProvider'


/**
 * Assets List Component
 * @param {Object} props
 * @param {Array} props.assets - Array of asset objects
 * @param {Function} props.onAddToken - Add new token callback
 * @param {Function} props.onHideZeroBalances - Hide zero balances callback
 * @param {Function} props.onSortByBalance - Sort by balance callback
 * @param {Function} props.onSettings - Settings callback
 */
const AssetsList = (props) => {
  const {
    gotoPage,
  } = props

  const { openModal, closeModal } = useModal()
  const { values: storageValues, getValue: getStorageValue } = useStorage()
  
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0, direction: 'down' })
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isAssetsMenuVisible, setIsAssetsMenuVisible ] = useState(false)
  const [menuForAsset, setMenuForAsset ] = useState(false)

  const menuRef = useRef(null)
  const assetsMenuRef = useRef(null)

  const { assets, getAssetBalance, assetsBalances } = useAssets()
  /*
  const [ assets, setAssets ] = useState([])
  useEffect(() => {
    console.log('assetsList', assetsList, assetsList.map)
    setAssets(
      assetsList.map((a) => {
        return {
          ...a,
          isBalanceFetching: !(assetsBalances[a.key]),
          balance: (assetsBalances[a.key])
            ? Number(assetsBalances[a.key].normal)
            : 0
        }
      })
    )
    
  }, [ assetsList, assetsBalances ])
*/
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false)
      }
      if (assetsMenuRef.current && !assetsMenuRef.current.contains(event.target)) {
        setIsAssetsMenuVisible(false)
      }
    }

    if (isMenuVisible || isAssetsMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuVisible, isAssetsMenuVisible])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuVisible) {
        setIsMenuVisible(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuVisible])

  // Calculate menu position
  const openMenu = (event) => {
    event.stopPropagation()
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const menuHeight = 180
    const gap = 8

    const spaceBelow = window.innerHeight - rect.bottom
    const direction = spaceBelow < menuHeight + gap ? 'up' : 'down'

    setMenuPosition({
      top: direction === 'down' ? rect.bottom + gap : rect.top - menuHeight - gap,
      right: window.innerWidth - rect.right,
      direction,
    })

    setIsMenuVisible(true)
  }
  
  const [ assetsMenuItem, setAssetsMenuItem ] = useState(null)
  const [ assetsMenuButton, setAssetsMenuButton ] = useState(null)
  useEffect(() => {
    if (isAssetsMenuVisible && assetsMenuButton) {
      
      const button = assetsMenuButton
      const rect = button.getBoundingClientRect()
      const menuRect = assetsMenuRef.current.getBoundingClientRect()
      const menuHeight = menuRect.height
      const gap = 0

      const spaceBelow = window.innerHeight - rect.bottom
      const direction = spaceBelow < menuHeight + gap ? 'up' : 'down'

      setMenuPosition({
        top: direction === 'down' ? rect.bottom + gap : rect.top - menuHeight - gap,
        right: window.innerWidth - rect.right,
        direction,
      })
    }
  }, [ isAssetsMenuVisible, assetsMenuButton ])
  
  const openAssetsMenu = (event, assetInfo) => {
    event.stopPropagation()
    setAssetsMenuItem(assetInfo)
    setIsAssetsMenuVisible(true)
    setAssetsMenuButton(event.currentTarget)
  }


  const closeMenu = () => {
    setIsMenuVisible(false)
    setIsAssetsMenuVisible(false)
  }

  const handleMenuAction = (action) => {
    switch (action) {
      case 'addToken':
        openModal({
          id: 'ADD_TOKEN',
          onlyLayer: true,
          fullWidth: true,
          onBgClick: () => { },
          content: (
            <AddTokenModal />
          )
        })
        break
      case 'hideZero':
        
        break
      case 'sortByBalance':
        
        break
      case 'settings':
        openModal({
          id: 'DEFAULT_CHAINS',
          onlyLayer: true,
          onBgClick: () => { closeModal('DEFAULT_CHAINS') },
          content: (
              <SelectAssetsNetworksModal
                onClose={() => { closeModal('DEFAULT_CHAINS') }}                
              />
            )
          })
        break
      default:
        break
    }

    closeMenu()
  }

  const getAssetIcon = (asset) => {
    const iconColors = {
      'Ethereum': 'from-blue-400 to-blue-600',
      'A7A5': 'from-orange-400 to-red-500',
      'Tether': 'from-green-400 to-green-600',
      'USDT': 'from-green-400 to-green-600',
      'Azuro': 'from-cyan-400 to-blue-500',
    }

    const defaultColor = 'from-gray-400 to-gray-600'
    const colorKey = Object.keys(iconColors).find(name => asset.name.includes(name))
    return iconColors[colorKey] || defaultColor
  }

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

console.log('>>>> ASSETS', assets, assetsBalances)
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ваши валюты</h2>
          <button
            onClick={() => handleMenuAction('settings')}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <SettingsIcon size={5} />
          </button>
        </div>

        <button
          onClick={openMenu}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors relative"
        >
          <MenuDotsIcon size={5} />
        </button>
      </div>

      {/* Assets List */}
      <div className="space-y-0">
        {assets.map((asset) => {
          const change = asset.change || 0

          return (
            <div
              key={asset.key}
              onClick={() => {
                gotoPage(`/asset/${asset.key}`)
              }}
              className="group bg-white dark:bg-[#1c1830] border border-gray-200 dark:border-white/10 rounded p-4 hover:border-wallet-purple transition-all cursor-pointer pr-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br ${getAssetIcon(asset)}
                  `}>
                    {asset.icon ? (
                      asset.icon
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {asset.symbol?.substring(0, 2) || '?'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {asset.name}
                      </span>
                    </div>
                    {/*
                    {change !== undefined && (
                      <div className={`text-sm font-medium ${getChangeColor(change)}`}>
                        {change > 0 ? '+' : ''}{change.toFixed(2)}%
                      </div>
                    )}
                    */}
                  </div>
                </div>

                {/* Values */}
                <div className="flex">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      ${asset.usdValue?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(asset.isBalanceFetching) ? (
                        <>...</>
                      ) : (
                        <>{asset.balance.toFixed(6) || '0'} {asset.symbol}</>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      openAssetsMenu(e, asset)
                    }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors relative"
                  >
                    <MenuDotsIcon size={5} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {assets.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Нет активов</p>
          </div>
        )}
      </div>
      
      {/* Popup Menu */}
      {isAssetsMenuVisible && (
        <>
          <PopupMenu
            menuRef={assetsMenuRef}
            top={menuPosition.top}
            right={menuPosition.right}
            items={[
              {
                title: (<><SendIcon />{'Asset item'}</>),
                onClick: () => handleMenuAction('asd')
              }
            ]}
          />
        </>
      )}
      {isMenuVisible && (
        <>
          <PopupMenu
            menuRef={menuRef}
            top={menuPosition.top}
            right={menuPosition.right}
            items={[
              {
                title: (<><AddIcon size={4} />{`Добавить токен`}</>),
                onClick: () => handleMenuAction('addToken')
              },
              {
                title: (<><EditIcon size={4} />{`Скрыть нулевые балансы`}</>),
                onClick: () => handleMenuAction('hideZero')
              },
              {
                title: (<><EditIcon size={4} />{`Сортировать по балансу`}</>),
                onClick: () => handleMenuAction('sortByBalance')
              },
            ]}
          />
        </>
      )}
    </div>
  )
}

export default AssetsList