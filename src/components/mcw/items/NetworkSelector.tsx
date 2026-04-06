import { useState, useEffect } from 'react'
import { GET_ALL_CHAINS } from '@/web3/chains'

/**
 * Network Selector Component
 * @param {Object} props
 * @param {number[]} props.value - Array of selected chain IDs
 * @param {Function} props.onChange - Callback when selection changes (returns array of chain IDs)
 */
const NetworkSelector = (props) => {
  const { value = [], onChange } = props
  
  const [networks, setNetworks] = useState([])
  const [selectedChains, setSelectedChains] = useState<number[]>(value)

  useEffect(() => {
    // Load all chains
    const allChains = GET_ALL_CHAINS()
    console.log('GET_ALL_CHAINS', GET_ALL_CHAINS())
    setNetworks(allChains)
  }, [])

  useEffect(() => {
    setSelectedChains(value)
  }, [value])

  const handleToggleChain = (chainId: number) => {
    const newSelectedChains = selectedChains.includes(chainId)
      ? selectedChains.filter(id => id !== chainId)
      : [...selectedChains, chainId]
    
    setSelectedChains(newSelectedChains)
    onChange?.(newSelectedChains)
  }

  const handleSelectAll = () => {
    const allChainIds = networks.map(network => network.chainId)
    setSelectedChains(allChainIds)
    onChange?.(allChainIds)
  }

  const handleDeselectAll = () => {
    setSelectedChains([])
    onChange?.([])
  }

  const getNetworkIcon = (network) => {
    // You can customize icons based on network
    if (network.name.toLowerCase().includes('ethereum')) {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
    
    return (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div className="bg-white dark:bg-[#1c1830] rounded-xl border border-gray-200 dark:border-white/10 overflow-y-auto custom-scroll flex-1">
      {/* Networks List */}
      <div className="divide-y divide-gray-200 dark:divide-white/10 ">
        {networks.map((network) => {
          const isSelected = selectedChains.includes(network.id)
          
          return (
            <div
              key={network.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => handleToggleChain(network.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Network Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${network.id === 1 
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }
                `}>
                  {getNetworkIcon(network)}
                </div>

                {/* Network Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                    {network.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span className="font-mono">{network.nativeCurrency.symbol}</span>
                    <span>•</span>
                    <span>{network.testnet ? 'Testnet' : 'Mainnet'}</span>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex-shrink-0 ml-4">
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                  ${isSelected 
                    ? 'bg-wallet-purple border-wallet-purple' 
                    : 'bg-transparent border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {networks.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <p>Нет доступных сетей</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkSelector