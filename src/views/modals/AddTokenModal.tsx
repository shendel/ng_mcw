import { useState, useEffect } from 'react'
import { useStorage } from '@/contexts/StorageContext'
import Button from '@/components/mcw/items/Button'
import Select from '@/components/mcw/items/Select'
import Input from '@/components/mcw/items/Input'
import { GET_CHAIN_BYID } from '@/web3/chains'
import StepProgress from '@/components/mcw/items/StepProgress'
import CloseIcon from '@/components/mcw/icons/CloseIcon'
import Header from '@/components/mcw/Header'
import { useModal } from '@/contexts/ModalContext'
import { isValidEvmAddress } from '@/helpers/etherscan'
import fetchTokenBalance from '@/helpers/fetchTokenBalance'
import { useBrowserWeb3 } from '@/web3/BrowserWeb3Provider'
import { fromWei } from '@/helpers/wei'
import WarningIcon from '@/components/mcw/icons/WarningIcon'
import LoadingIcon from '@/components/mcw/icons/LoadingIcon'


const AddTokenModal = (props) => {
  const [ currentStep, setCurrentStep ] = useState(1)
  const { getValue: getStorageValue, setValue: setStorageValue, values: storageValues } = useStorage()
  const { closeModal } = useModal()

  const { browserAccount } = useBrowserWeb3()
  const [ chainId, setChainId ] = useState(0)
  const [ chainIdError, setChainIdError ] = useState(false)
  const [ tokenInfoFetching, setTokenInfoFetching ] = useState(false)
  const [ tokenAddress, setTokenAddress ] = useState(`0x64544969ed7EBf5f083679233325356EbE738930`)
  const [ tokenAddressError, setTokenAddressError ] = useState(false)
  const [ tokenInfo, setTokenInfo ] = useState(false)
  
  const chains = ([
    0,
    ...getStorageValue('assetNetworks')
  ]).map((chainId) => {
    if (chainId == 0) {
      return { value: '', title: 'Выберите сеть' }
    } else {
      const chainInfo = GET_CHAIN_BYID(chainId)
      return { value: chainId, title: chainInfo.name }
    }
  })

  useEffect(() => {
    setChainIdError(false)
  }, [ chainId ])
  useEffect(() => {
    setTokenAddressError(false)
  }, [ tokenAddress ])
  
  const gotoStep2 = () => {
    setChainIdError(false)
    setTokenAddressError(false)
    if (!chainId) {
      setChainIdError(`Выберите сеть`)
    } else {
      if (!isValidEvmAddress(tokenAddress)) {
        console.log('er')
        setTokenAddressError(`Укажите валидный адресс`)
        return
      } else {
        setTokenInfoFetching(true)
        fetchTokenBalance({
          wallet: browserAccount,
          tokenAddress,
          chainId
        }).then((info) => {
          setTokenInfoFetching(false)
          setTokenInfo(info)
          setCurrentStep(2)
          console.log('token info', info, browserAccount)
        }).catch((err) => {
          setTokenInfoFetching(false)
          setTokenAddressError(`Это не контракт токена`)
        })
      }
    }
  }
  
  const handleAddToken = () => {
    //closeModal('ADD_TOKEN')
    const assets = getStorageValue('assets')
    assets[`${chainId}-${tokenAddress.toLowerCase()}`] = {
      type: 'TOKEN',
      chainId: chainId,
      tokenAddress: tokenAddress,
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      decimals: tokenInfo.decimals
    }
    setStorageValue('assets', assets)
    setCurrentStep(3)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#1c1830] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Добавить токен</h2>
          <button onClick={() => { closeModal('ADD_TOKEN') }} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            <CloseIcon />
          </button>
        </div>
        <StepProgress current={currentStep} total={3} />
        {(currentStep == 1) && (
          <div className="animate-fade-in p-4 flex-col flex flex-1">
            <div className="flex-1">
              <div className="mb-4">
                <Select
                  label={`Сеть`}
                  value={chainId}
                  onChange={setChainId}
                  hasError={chainIdError}
                  errorMessage={chainIdError}
                  items={chains}
                />
              </div>
              <div className="mb-4">
                <Input
                  label={`Адрес контракта токена`}
                  value={tokenAddress}
                  onChange={setTokenAddress}
                  hasError={tokenAddressError}
                  errorMessage={tokenAddressError}
                  placeholder="0x..."
                />
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-3">
              <Button variant="second" fullWidth={true} onClick={() => { closeModal('ADD_TOKEN') }}>
                {`Отмена`}
              </Button>
              <Button
                fullWidth={true}
                onClick={gotoStep2}
                disabled={tokenInfoFetching}
              >
                {tokenInfoFetching ? (
                  <LoadingIcon />
                ) : (
                  <>{`Далее`}</>
                )}
              </Button>
            </div>
          </div>
        )}
        {(currentStep == 2) && (
          <div className="animate-fade-in p-4 flex-col flex flex-1">
            <div className="flex-1">
              <div className="bg-gradient-to-br from-wallet-purple/10 to-purple-600/10 dark:from-wallet-purple/20 dark:to-purple-600/20 border border-wallet-purple/20 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{tokenInfo.symbol}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tokenInfo.name}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-2 border-t border-wallet-purple/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{`Сеть`}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{GET_CHAIN_BYID(chainId).name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {`Адрес контракта`}
                    </span>
                    <span className="font-mono text-gray-900 dark:text-gray-100 text-xs">
                      {tokenInfo.tokenAddress}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{`Символ`}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{tokenInfo.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{`Децималы`}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{tokenInfo.decimals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{`Баланс`}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{tokenInfo.normalized} {tokenInfo.symbol}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <WarningIcon />
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">
                    <p className="font-semibold mb-1">Проверьте информацию</p>
                    <p>Убедитесь, что это правильный токен. Добавление неправильного токена может привести к потере средств.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-3">
              <Button variant="second" fullWidth={true} onClick={() => { setCurrentStep(1) }}>
                {`Назад`}
              </Button>
              <Button fullWidth={true} onClick={handleAddToken}>{`Добавить токен`}</Button>
            </div>
          </div>
        )}
        {(currentStep == 3) && (
          <>
            <div className="animate-fade-in p-4 flex-col flex flex-1">
              <div className="flex-1">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <svg className="w-24 h-24 text-green-500 animate-bounce-short" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-20" />
                      <path d="M30 50 L45 65 L70 35" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Готово!</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                    Токен успешно добавлен
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 flex gap-3">
                <Button fullWidth={true} onClick={() => { closeModal('ADD_TOKEN') }}>
                  Готово
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AddTokenModal