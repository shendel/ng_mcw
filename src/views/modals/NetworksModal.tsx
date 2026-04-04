import { useState, useRef, useEffect } from 'react'
import Button from '@/components/mcw/items/Button'
import AddIcon from '@/components/mcw/icons/AddIcon'
import EditIcon from '@/components/mcw/icons/EditIcon'
import ExportIcon from '@/components/mcw/icons/ExportIcon'
import DeleteIcon from '@/components/mcw/icons/DeleteIcon'
import CheckMarkIcon from '@/components/mcw/icons/CheckMarkIcon'
import CloseIcon from '@/components/mcw/icons/CloseIcon'
import PopupMenu from '@/components/mcw/items/PopupMenu'
import ChainIcon from '@/components/mcw/icons/ChainIcon'
import chainIcons from '@/components/mcw/chainIcons'

const NetworkModal = (props) => {
  const {
    isOpen,
    onClose,
    networks,
    activeNetworkId,
    onSelectNetwork,
    onAddNetwork,
    onEditNetwork,
    onDeleteNetwork,
    onOpenExplorer
  } = props

  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0, direction: 'down' })
  const [activeMenuNetwork, setActiveMenuNetwork] = useState(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const menuRef = useRef(null)
  const modalRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false)
        setActiveMenuNetwork(null)
      }
    }

    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuVisible])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isMenuVisible) {
          setIsMenuVisible(false)
          setActiveMenuNetwork(null)
        } else if (isOpen) {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isMenuVisible, onClose])

  // Reset menu state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsMenuVisible(false)
      setActiveMenuNetwork(null)
    }
  }, [isOpen])

  // Calculate menu position
  const openMenu = (event, network) => {
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

    setActiveMenuNetwork(network)
    setIsMenuVisible(true)
  }

  const closeMenu = () => {
    setIsMenuVisible(false)
    setActiveMenuNetwork(null)
  }

  const handleMenuAction = (action) => {
    const network = networks.find(n => n.chainId === activeMenuNetwork?.chainId)
    if (!network) return

    switch (action) {
      case 'edit':
        onEditNetwork?.(network)
        break
      case 'explorer':
        onOpenExplorer?.(network)
        break
      case 'delete':
        const confirmed = window.confirm(`Удалить сеть "${network.name}"?\n\nЭто действие нельзя отменить!`)
        if (confirmed) {
          onDeleteNetwork?.(network)
        }
        break
      default:
        break
    }

    closeMenu()
  }

  const handleSelectNetwork = (network) => {
    onSelectNetwork?.(network)
    onClose()
  }

  if (!isOpen) return null

  const getNetworkIcon = (network) => {
    const iconColors = {
      'Ethereum': 'from-blue-400 to-blue-600',
      'BSC': 'from-gray-400 to-gray-600',
      'Polygon': 'from-purple-400 to-purple-600',
      'Arbitrum': 'from-blue-500 to-blue-700',
    }

    const defaultColor = 'from-gray-400 to-gray-600'
    const colorKey = Object.keys(iconColors).find(name => network.name.includes(name))
    return iconColors[colorKey] || defaultColor
  }

  return (
    <>
      {/* Modal */}
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-[#1c1830] rounded shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Сети</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Networks List */}
        <div className="overflow-y-auto custom-scroll p-2 space-y-2 flex-1">
          {networks.map((network) => {
            const isActive = network.chainId === activeNetworkId
            
            return (
              <div key={network.chainId} className="group relative">
                <div
                  onClick={() => handleSelectNetwork(network)}
                  className={`
                    flex items-center gap-3 p-3 rounded cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-wallet-purple/10 dark:bg-wallet-purple/20 border-2 border-wallet-purple' 
                      : 'bg-white dark:bg-[#14121e] border-2 border-gray-200 dark:border-white/10 hover:border-wallet-purple'
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br ${getNetworkIcon(network)}
                  `}>
                    {chainIcons?.[network.chainId]?.src ? (
                      <div className="w-5 h-5">
                        <img src={chainIcons[network.chainId].src} />
                      </div>
                    ) : (
                      <ChainIcon size={5} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {network.name}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-wallet-purple text-white text-xs font-medium rounded-full whitespace-nowrap">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 truncate">
                      {network.nativeCurrency.symbol} • {network.testnet ? 'Testnet' : 'Mainnet'}
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isActive && (
                      <CheckMarkIcon size={5} />
                    )}
                    
                    <button
                      onClick={(e) => openMenu(e, network)}
                      className="p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors z-20 relative"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {networks.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Нет доступных сетей</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10 space-y-2 flex-shrink-0 bg-white dark:bg-[#1c1830]">
          <Button onClick={onAddNetwork} fullWidth={true}>
            <AddIcon />
            {`Добавить сеть`}
          </Button>
        </div>
      </div>

      {/* Global Menu (Positioned via JS, outside modal to avoid overflow clipping) */}
      {isMenuVisible && (
        <>
          <PopupMenu
            menuRef={menuRef}
            top={menuPosition.top}
            right={menuPosition.right}
            items={[
              {
                title: (<><EditIcon size={4} />{`Редактировать`}</>),
                onClick: () => handleMenuAction('edit')
              },
              {
                title: (<><ExportIcon size={4} />{`Эксплорер`}</>),
                onClick: () => handleMenuAction('explorer')
              },
              { type: 'seperator' },
              {
                title: (<><DeleteIcon size={4} />{`Удалить`}</>),
                onClick: () => handleMenuAction('delete'),
                red: true
              }
            ]}
          />
        </>
      )}
    </>
  )
}

export default NetworkModal