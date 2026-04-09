// components/WalletConfirmationModal.tsx
import { useEffect, useState } from 'react'

interface ConfirmationData {
  method: string
  params: any[]
  onConfirm: () => void
  onReject: () => void
}

const WalletConfirmationModal = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null)

  useEffect(() => {
    // Глобальный обработчик для WalletBridge
    window.showWalletConfirmation = (data: ConfirmationData) => {
      setConfirmation(data)
    }

    return () => {
      delete window.showWalletConfirmation
    }
  }, [])

  const handleConfirm = () => {
  alert(confirmation.onConfirm)
    confirmation?.onConfirm()
    setConfirmation(null)
  }

  const handleReject = () => {
    confirmation?.onReject()
    setConfirmation(null)
  }

  if (!confirmation) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleReject}
      />
      
      <div className="relative bg-white dark:bg-[#1c1830] rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <h2 className="text-xl font-bold mb-2 dark:text-gray-100">
          {getMethodTitle(confirmation.method)}
        </h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {getMethodDescription(confirmation.method)}
        </p>

        <div className="bg-gray-50 dark:bg-[#14121e] rounded-xl p-4 mb-6">
          <pre className="text-xs overflow-auto max-h-64 font-mono text-gray-700 dark:text-gray-300">
            {JSON.stringify(confirmation.params, null, 2)}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold dark:text-gray-100 transition-colors"
          >
            Отклонить
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-wallet-purple hover:bg-wallet-purple-hover text-white rounded-xl font-semibold transition-colors shadow-lg shadow-purple-500/30"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  )
}

// Вспомогательные функции
const getMethodTitle = (method: string) => {
  const titles: Record<string, string> = {
    'eth_requestAccounts': 'Подключить кошелек',
    'eth_sendTransaction': 'Отправить транзакцию',
    'personal_sign': 'Подписать сообщение',
    'eth_signTypedData': 'Подписать данные',
    'wallet_switchEthereumChain': 'Сменить сеть',
  }
  return titles[method] || 'Подтверждение'
}

const getMethodDescription = (method: string) => {
  const descriptions: Record<string, string> = {
    'eth_requestAccounts': 'Сайт запрашивает доступ к вашему кошельку',
    'eth_sendTransaction': 'Подтвердите отправку транзакции',
    'personal_sign': 'Подпишите сообщение для аутентификации',
    'eth_signTypedData': 'Подпишите структурированные данные',
    'wallet_switchEthereumChain': 'Разрешите сменить сеть',
  }
  return descriptions[method] || 'Подтвердите действие'
}

export default WalletConfirmationModal