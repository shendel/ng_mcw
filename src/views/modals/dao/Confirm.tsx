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


const DaoModalConfirm = (props) => {
  const {
    method = '',
    params = [],
    onReject = () => {},
    onConfirm = () => {}
  } = props
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#1c1830] rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <h2 className="text-xl font-bold mb-2 dark:text-gray-100">
          {getMethodTitle(method)}
        </h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {getMethodDescription(method)}
        </p>

        <div className="bg-gray-50 dark:bg-[#14121e] rounded-xl p-4 mb-6">
          <pre className="text-xs overflow-auto max-h-64 font-mono text-gray-700 dark:text-gray-300">
            {JSON.stringify(params, null, 2)}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { onReject() }}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold dark:text-gray-100 transition-colors"
          >
            Отклонить
          </button>
          <button
            onClick={() => { onConfirm() }}
            className="flex-1 py-3 bg-wallet-purple hover:bg-wallet-purple-hover text-white rounded-xl font-semibold transition-colors shadow-lg shadow-purple-500/30"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  )
}

export default DaoModalConfirm