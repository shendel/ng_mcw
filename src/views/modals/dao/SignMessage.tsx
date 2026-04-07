import Button from '@/components/mcw/items/Button'

const DaoModalSignMessage = (props) => {
  return (
    <div className="fixed left-0 bottom-0 right-0">
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-[#1c1830] rounded-t max-h-[100vh] overflow-y-auto shadow border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 space-y-6">
                {/*<!-- Header -->*/}
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Подписать сообщение</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        opensea.io запрашивает вашу подпись
                    </p>
                </div>

                {/*<!-- Message -->*/}
                <div className="bg-gray-50 dark:bg-[#14121e] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Сообщение</span>
                        <button className="text-xs text-wallet-purple hover:text-wallet-purple-hover font-medium">Копировать</button>
                    </div>
                    <div className="bg-white dark:bg-[#1c1830] border border-gray-200 dark:border-white/10 rounded-lg p-3 max-h-32 overflow-y-auto custom-scroll">
                        <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">Welcome to OpenSea!

Click to sign in and accept the OpenSea Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address:
0x742d35Cc6634C0532925a3b844Bc454e4438f44e

Nonce:
12345678</pre>
                    </div>
                </div>

                {/*<!-- Info -->*/}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div className="text-sm text-blue-700 dark:text-blue-400">
                            <p className="font-semibold mb-1">Безопасная подпись</p>
                            <p>Эта подпись не требует комиссии и не изменяет состояние блокчейна. Она используется только для аутентификации.</p>
                        </div>
                    </div>
                </div>

                {/*<!-- Actions -->*/}
                <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-xl transition-colors">
                        Отклонить
                    </button>
                    <button className="flex-1 py-3 bg-wallet-purple hover:bg-wallet-purple-hover text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/30">
                        Подписать
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DaoModalSignMessage