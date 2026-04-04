import { useState } from 'react'
import { useStorage } from '@/contexts/StorageContext'
import { useModal } from '@/contexts/ModalContext'
import NetworksModal from '@/views/modals/NetworksModal'
import ChainIcon from '@/components/mcw/icons/ChainIcon'
import chainIcons from '@/components/mcw/chainIcons'

const HeaderNetworksBlock = (props) => {
  const { values: storageData, getValue, setValue } = useStorage()
  const { openModal, closeModal } = useModal()
  
  const networks = getValue('networks') || []
  const activeNetworkId = getValue('activeNetwork')
  const activeNetwork = networks.find((n) => n.chainId === activeNetworkId) || networks[0]

  const handleSelectNetwork = (network) => {
    console.log('select network', network)
    setValue('activeNetwork', network.chainId)
  }

  const handleAddNetwork = () => {
    alert('Открыть форму добавления кастомной сети')
  }

  const handleEditNetwork = (network) => {
    alert(`Редактировать: ${network.name}`)
  }

  const handleDeleteNetwork = (network) => {
    console.log('delete network', network)
  }

  const handleOpenExplorer = (network) => {
    if (network.explorer) {
      window.open(network.explorer, '_blank')
    }
  }

  const handleOpenNetworks = () => {
    openModal({
      id: 'NETWORKS_MODAL',
      onlyLayer: true,
      onBgClick: () => { closeModal('NETWORKS_MODAL') },
      content: (
        <NetworksModal
          isOpen={true}
          onClose={() => { closeModal('NETWORKS_MODAL') }}
          networks={networks}
          activeNetworkId={activeNetworkId}
          onSelectNetwork={handleSelectNetwork}
          onAddNetwork={handleAddNetwork}
          onEditNetwork={handleEditNetwork}
          onDeleteNetwork={handleDeleteNetwork}
          onOpenExplorer={handleOpenExplorer}
        />
      )
    })
  }

  return (
    <>
      <button
        onClick={handleOpenNetworks}
        className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full px-3 py-1.5 transition-colors"
      >
        {activeNetwork ? (
          <>
            {chainIcons?.[activeNetworkId]?.src ? (
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <img src={chainIcons[activeNetworkId].src} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <ChainIcon size={5} />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {activeNetwork.name}
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-700 dark:text-gray-300">...</span>
        )}
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </>
  )
}

export default HeaderNetworksBlock