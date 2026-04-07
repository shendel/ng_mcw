import Button from '@/components/mcw/items/Button'

const DaoModalConnect = (props) => {
  return (
    <div className="fixed left-0 bottom-0 right-0">
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-[#1c1830] rounded-t max-h-[100vh] overflow-y-auto shadow border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 space-y-6">
              {/*<!-- Header -->*/}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>  
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Подключить сайт?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">uniswap.org</span> запрашивает доступ к вашему кошельку
                </p>
              </div>

              {/*<!-- Site Info -->*/}
              <div className="bg-gray-50 dark:bg-[#14121e] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Сайт</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">uniswap.org</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">URL</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-gray-100 text-xs">https://app.uniswap.org</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Сеть</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Ethereum</span>
                  </div>
                </div>
              </div>

              {/*<!-- Permissions -->*/}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Этот сайт получит доступ к:</p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Просмотр баланса и активности
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Запрос на подпись транзакций
                  </li>
                </ul>
              </div>

              {/*<!-- Warning -->*/}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Никогда не подключайте кошелек к непроверенным сайтам
                  </p>
                </div>
              </div>

              {/*<!-- Actions -->*/}
              <div className="flex gap-3">
                <Button variant="second" fullWidth={true}>
                  {`Отмена`}
                </Button>
                <Button fullWidth={true}>
                  {`Подключить`}
                </Button>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DaoModalConnect