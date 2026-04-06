import { useState, useEffect } from 'react'
import Button from '@/components/mcw/items/Button'
import CloseIcon from '@/components/mcw/icons/CloseIcon'
import NetworkSelector from '@/components/mcw/items/NetworkSelector'
import { useStorage } from '@/contexts/StorageContext'

const SelectAssetsNetworksModal = (props) => {
  const {
    onClose,
  } = props

  const { values: storageValues, getValue: getStorageValue, setValue: setStorageValue } = useStorage()
  
  
  const [ chains, setChains ] = useState([])
  useEffect(() => {
    const _chains = getStorageValue('assetNetworks')
    setChains(_chains)
  }, [ storageValues ])
  
  return (
    <>
      {/* Modal */}
      <div
        className="w-full max-w-md bg-white dark:bg-[#1c1830] rounded shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Сети по умолчанию</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <NetworkSelector value={chains} onChange={setChains} />
        {/* Footer Actions */}
        <div className="flex gap-3 align-center items-center mt-4 p-3 border-t border-gray-200 dark:border-white/10 flex-shrink-0 bg-white dark:bg-[#1c1830]">
          <Button onClick={() => {
            setStorageValue('assetNetworks', chains)
            onClose()
          }} fullWidth={true}>
            {`Сохранить`}
          </Button>
          <Button variant="second" onClick={onClose} fullWidth={true}>
            {`Отмена`}
          </Button>
        </div>
      </div>
    </>
  )
}

export default SelectAssetsNetworksModal