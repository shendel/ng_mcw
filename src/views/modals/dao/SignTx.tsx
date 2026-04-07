import Button from '@/components/mcw/items/Button'

const DaoModalSignTx = (props) => {
  return (
    <div className="fixed left-0 bottom-0 right-0">
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-[#1c1830] rounded-t max-h-[100vh] overflow-y-auto shadow border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 space-y-6">
              {/*<!-- Header -->*/}
              <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Подтверждение транзакции</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     uniswap.org запрашивает подтверждение
                  </p>
              </div>

              {/*<!-- Transaction Details -->*/}
              <div className="bg-gray-50 dark:bg-[#14121e] rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Отправить</span>
                      <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">0.5 ETH</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">~$1,234.56</div>
                      </div>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Получатель</span>
                      <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-wallet-purple bg-wallet-purple/10 px-2 py-1 rounded">0x742d35...4a8B</span>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                              </svg>
                          </button>
                      </div>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Комиссия сети</span>
                      <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">0.002 ETH</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">~$4.92</div>
                      </div>
                  </div>

                  <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Итого</span>
                      <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">0.502 ETH</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">~$1,239.48</div>
                      </div>
                  </div>
              </div>

              {/*<!-- Gas Settings -->*/}
              <div className="space-y-2">
                  <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Газ</span>
                      <button className="text-sm text-wallet-purple hover:text-wallet-purple-hover font-medium">Изменить</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                      <button className="py-2 px-3 bg-gray-100 dark:bg-[#14121e] border-2 border-gray-200 dark:border-white/10 rounded-lg text-center hover:border-wallet-purple transition-colors">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Медленно</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">15 Gwei</div>
                      </button>
                      <button className="py-2 px-3 bg-wallet-purple/10 border-2 border-wallet-purple rounded-lg text-center">
                          <div className="text-xs text-wallet-purple">Средне</div>
                          <div className="text-sm font-semibold text-wallet-purple">25 Gwei</div>
                      </button>
                      <button className="py-2 px-3 bg-gray-100 dark:bg-[#14121e] border-2 border-gray-200 dark:border-white/10 rounded-lg text-center hover:border-wallet-purple transition-colors">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Быстро</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">35 Gwei</div>
                      </button>
                  </div>
              </div>

              {/*<!-- Actions -->*/}
              <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-xl transition-colors">
                      Отклонить
                  </button>
                  <button className="flex-1 py-3 bg-wallet-purple hover:bg-wallet-purple-hover text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/30">
                      Подтвердить
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DaoModalSignTx