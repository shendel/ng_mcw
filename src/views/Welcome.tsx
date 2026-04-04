import { useEffect, useState, Component, useRef } from "react"
import Header from '@/components/mcw/Header'

import LabelWithCheck from '@/components/mcw/items/LabelWithCheck'
import Button from '@/components/mcw/items/Button'
import StepProgress from '@/components/mcw/items/StepProgress'
import Toggle from '@/components/mcw/items/Toggle'
import StepList from '@/components/mcw/items/StepList'
import MnemonicInputGrid from '@/components/mcw/items/MnemonicInputGrid'


import CheckMarkIcon from '@/components/mcw/icons/CheckMarkIcon'
import AddIcon from '@/components/mcw/icons/AddIcon'
import RefreshIcon from '@/components/mcw/icons/RefreshIcon'
import ForwardIcon from '@/components/mcw/icons/ForwardIcon'
import BackIcon from '@/components/mcw/icons/BackIcon'
import CopyIcon from '@/components/mcw/icons/CopyIcon'

import { copyToClipboard } from '@/helpers/copyToClipboard'
import { getRandomMnemonicWords, validateMnemonicWords , getEthLikeWallet } from '@/web3/mnemonic'
import { useStorage } from '@/contexts/StorageContext'


export default function Welcome(props) {
  const {
    gotoPage,
    params,
    on404
  } = props

  const { values, setValue } = useStorage()
  
  const [ currentStep, setCurrentStep ] = useState(1)
  const [ mode, setMode ] = useState('create')
  const [ seedWords, setSeedWords ] = useState('voyage unveil seven labor market enact rebel wave mail uniform network payment')
  
  const [ seedIsCopied, setSeedIsCopied ] = useState(false)
  const seedLength = 12 // New wallet seed length
  
  const handleCopySeed = () => {
    copyToClipboard(seedWords)
    setSeedIsCopied(true)
  }
  useEffect(() => {
    if (seedIsCopied) {
      const timer = setTimeout(() => {
        setSeedIsCopied(false)
      }, 5000)
      return () => { clearTimeout(timer) }
    }
  }, [ seedIsCopied ])
  
  const [ wordsCount, setWordsCount] = useState(12) // Recovery seed length

  const handleWordCountToggle = (newCount) => {
    console.log('new count', newCount)
    setWordsCount(newCount);
    setSeedWords(Array(newCount).fill(''));
  }

  const handleCreateWallet = () => {
    const wallet = getEthLikeWallet({
      mnemonic: seedWords
    })

    const newAccount = {
      name: 'Account #1',
      id: crypto.randomUUID(),
      address: wallet.address,
      type: 'seed',
      wallet: {
        mnemonic: wallet.mnemonic,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey
      }
    }
    const accounts = values.accounts
    accounts.push( newAccount )
    setValue('accounts', accounts)
    setValue('activeAccount', newAccount.id)
  }

  return (
    <>
      <div>
        <Header title={`Welcome`} logo={true} theme={true} />
      </div>
      
      {currentStep == 1 && (
        <div className="animate-fade-in">
          <StepProgress current={1} total={4} />
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-wallet-purple to-purple-400 rounded-2xl flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                    <path d="M6 6 L16 4 L16 28 L6 26 Z" fill="white"/>
                    <path d="M16 4 L26 6 L26 10 L16 8 Z" fill="white" opacity="0.8"/>
                    <path d="M6 14 L16 12 L26 14 L16 16 Z" fill="white" opacity="0.6"/>
                    <path d="M16 16 L26 18 L26 28 L16 28 Z" fill="white" opacity="0.8"/>
                </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Добро пожаловать
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
              Безопасный и простой способ управления вашими криптовалютами
            </p>

            <div className="space-y-3 text-left max-w-xs mx-auto mb-8">
              <LabelWithCheck>{`Полный контроль над ключами`}</LabelWithCheck>
              <LabelWithCheck>{`Поддержка множественных сетей`}</LabelWithCheck>
              <LabelWithCheck>{`Бесплатно и с открытым исходным кодом`}</LabelWithCheck>
            </div>
          </div>

          <Button fullWidth={true} onClick={() => setCurrentStep(2) }>
            {`Далее`}
            <ForwardIcon />
          </Button>
        </div>
      )}
      {currentStep == 2 && (
        <div className="animate-fade-in">
          <StepProgress current={2} total={4} />
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Начнем настройку
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
              Выберите действие для продолжения. Вы можете создать новый кошелек или восстановить существующий.
            </p>

            <div className="space-y-3">
              <Button fullWidth={true} onClick={() => {
                setCurrentStep(3)
                setSeedWords(
                  getRandomMnemonicWords(seedLength)
                )
                setMode('create')
              }}>
                <AddIcon />
                {`Создать новый кошелек`}
              </Button>
              <Button fullWidth={true} onClick={() => {
                setCurrentStep(3)
                setSeedWords(
                   Array(wordsCount).fill('')
                )
                setMode('recovery')
              }}
                variant='outline'
              >
                <RefreshIcon />
                {`Восстановить кошелек`}
              </Button>
            </div>
          </div>
        </div>
      )}
      {(currentStep == 3 && mode == 'create') && (
        <div className="animate-fade-in">
          <StepProgress current={3} total={4} />
          <div className="py-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Ваша секретная фраза
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Запишите эти слова в правильном порядке и сохраните их в безопасном месте.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6" id="seedGrid">
                {seedWords.split(' ').map((word, index) => {
                  return (
                    <div key={index} className="seed-word bg-white dark:bg-[#1c1830] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer">
                      <span className="text-gray-400 text-sm font-medium">{index + 1}</span>
                      <span className="text-gray-900 dark:text-gray-100 font-mono font-semibold">{word}</span>
                    </div>
                  )
                })}
              </div>

              <StepList
                steps={[
                  'Запишите фразу на бумагу',
                  'Обязательно подпишите что это ключ от кошелька',
                  'Никогда не передавайте фразу третьим лицам',
                ]}
              />
              
              <div className="flex gap-3">
                <Button fullWidth={true} onClick={handleCopySeed}>
                  {seedIsCopied ? <CheckMarkIcon /> : <CopyIcon />}
                  {seedIsCopied ? 'Скопировано' : `Скопировать`}
                </Button>
              </div>
              <div className="flex gap-3 mt-4">
                <Button fullWidth={true} variant='second' onClick={() => { setCurrentStep(2) }}>
                  <BackIcon />
                  {`Назад`}
                </Button>
                <Button fullWidth={true} onClick={() => { setCurrentStep(4) }}>
                  {`Создать`}
                  <ForwardIcon />
                </Button>
              </div>
          </div>
        </div>
      )}
      {(currentStep == 3 && mode == 'recovery') && (
        <div className="animate-fade-in">
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Восстановление</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Введите сид-фразу ({wordsCount} слов)</p>
            </div>

            {/* Toggle 12/24 */}
            <Toggle
              options={{
                12: '12 слов',
                24: '24 слова'
              }}
              value={wordsCount}
              onChange={(v) => { handleWordCountToggle(Number(v)) }}
            />
            <MnemonicInputGrid
              wordCount={wordsCount}
              seedWords={seedWords}
              onSeedChange={setSeedWords}
            />
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-xs text-yellow-700 dark:text-yellow-400 text-center">
                💡 Совет: Вы можете скопировать всю фразу и вставить её в первое поле
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button fullWidth={true} variant='second' onClick={() => { setCurrentStep(2) }}>
                <BackIcon />
                {`Назад`}
              </Button>
              <Button fullWidth={true} disabled={!validateMnemonicWords(seedWords.join(' '))} onClick={() => { setCurrentStep(4) }}
                variant='brand'
              >
                <RefreshIcon />
                {`Восстановить`}
              </Button>
            </div>
          </div>
        </div>
      )}
      {(currentStep == 4) && (
        <div className="animate-fade-in">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <svg className="w-24 h-24 text-green-500 animate-bounce-short" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-20" />
                <path d="M30 50 L45 65 L70 35" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Готово!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
              Ваш кошелек успешно настроен.
            </p>
            <div className="bg-gray-100 dark:bg-[#1c1830] rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span>Кошелек создан</span>
                </div>
              </div>
            </div>
            <Button fullWidth={true} onClick={handleCreateWallet}>
              Готово
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
