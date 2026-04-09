// components/WalletBridge.tsx
import { useEffect, useRef } from 'react'
import { useBrowserWeb3 } from '@/web3/BrowserWeb3Provider'
import { useModal } from '@/contexts/ModalContext'
import { useStorage } from '@/contexts/StorageContext'
import DaoModalConfirm from '@/views/modals/dao/Confirm'

const WalletBridge = () => {
  const { getValue: getStorageValue, setValue: setStorageValue } = useStorage()
  
  const {
    browserWeb3,
    browserAccount,
    browserPK,
    browserRPC,
    browserChainId,
    switchAccount,
    switchNetwork,
  } = useBrowserWeb3()

  const { openModal, closeModal } = useModal()
  
  useEffect(() => {
    // Создаем глобальный WalletAPI
    window.browserWeb3 = browserWeb3
    window.WalletAPI = {
      // Состояние
      pendingRequest: null,
      getState: () => ({
        accounts: browserAccount ? [browserAccount] : [],
        chainId: '0x' + Number(browserChainId).toString(16),
        isConnected: !!browserAccount,
      }),

      // Обработка запросов от Android
      handleRequest: async (requestJson: string | any) => {
        console.log('[WalletBridge] 📥 handleRequest:', requestJson)
        const _this = window.WalletAPI
        console.log(_this.getState())
        console.log('browserChainId', browserChainId)
        try {
          
          const request = typeof requestJson === 'string' 
            ? JSON.parse(requestJson) 
            : requestJson
            
          const method = request.method
          const params = request.params || []
          const tabUrl = request._tabUrl
          const tabId = request._tabId
          const requestId = request.requestId
          
          if (method === 'wallet_getState') {
              _this.sendResponse({
                  success: true,
                  result: _this.getState(),
                  chainId: _this.getState().chainId,
                  tabId: tabId,
                  requestId: requestId,
              });
              return;
          }
          if (method === 'eth_requestAccounts') {
              if (true) {
                // permisions ok
                _this.sendResponse({
                  success: true,
                  result: [browserAccount],
                  chainId: _this.getState().chainId,
                  tabId: tabId,
                  requestId: requestId,
                })
                
              }
              return
          }
          if (
            (method === 'eth_estimateGas')
            || (method === 'eth_gasPrice')
            || (method === 'eth_getTransactionReceipt')
            || (method === 'eth_getTransactionReceipt')
          ) {
            const payload = {
                jsonrpc: '2.0',
                id: Date.now(),
                method: method,
                params: params || []
            };
            // Вызываем web3.send() и обрабатываем асинхронно
            browserWeb3.currentProvider.send(payload, (err, response) => {
                if (err) {
                    console.error('[Wallet] ❌ Web3 RPC error:', err);
                    _this.sendResponse({ 
                        success: false, 
                        error: err.message || 'RPC Error', 
                        chainId: _this.getState().chainId,
                        tabId: tabId,
                        requestId: requestId,
                    });
                } else if (response && response.error) {
                    console.error('[Wallet] ❌ RPC Node error:', response.error);
                    _this.sendResponse({ 
                        success: false, 
                        error: response.error.message || 'Node Error', 
                        chainId: _this.getState().chainId,
                        tabId: tabId,
                        requestId: requestId,
                    });
                } else {
                    console.log('[Wallet] ✅ Web3 RPC success:', response.result);
                    _this.sendResponse({ 
                        success: true, 
                        result: response.result, 
                        chainId: _this.getState().chainId,
                        tabId: tabId,
                        requestId: requestId,
                    });
                }
            });
            return
          }
          if (method === 'eth_blockNumber') {
              browserWeb3.eth.getBlockNumber().then((bn) => {
                 _this.sendResponse({
                  success: true,
                  result: '0x' + Number(nb).toString(16),
                  chainId: _this.getState().chainId,
                  tabId: tabId,
                  requestId: requestId,
                });
              }).catch((err) => {
                console.log('fail get block number')
              })
              return;
          }

          if (method === 'eth_accounts') {
              _this.sendResponse({
                  success: true,
                  result: _this.getState().accounts,
                  chainId: _this.getState().chainId,
                  tabId: tabId,
                  requestId: requestId,
              });
              return;
          }

          if (method === 'eth_chainId') {
              _this.sendResponse({
                  success: true,
                  result: _this.getState().accounts,
                  chainId: _this.getState().chainId,
                  tabId: tabId,
                  requestId: requestId,
              });
              return;
          }

          _this.pendingRequest = {
              method: method,
              params: params,
              tabUrl: tabUrl,
              tabId: tabId,
              requestId: requestId,
          };
          openModal({
            id: 'DAO_CONFIRM',
            onlyLayer: true,
            fullWidth: true,
            onBgClick: () => { },
            content: (
              <DaoModalConfirm
                method={method}
                params={params}
                tabUrl={tabUrl}
                tabId={tabId}
                onConfirm={() => {
                  closeModal('DAO_CONFIRM')
                  _this.handleApprove()
                }}
                onReject={() => {
                  closeModal('DAO_CONFIRM')
                  _this.handleRejected()
                }}
              />
            )
          })
          /*
          // Сохраняем запрос
          pendingRequestRef.current = { method, params }

          // Показываем модалку через глобальный обработчик
          if (window.showWalletConfirmation) {
            window.showWalletConfirmation({
              method,
              params,
              onConfirm: () => window.WalletAPI.handleConfirmed(),
              onReject: () => window.WalletAPI.handleRejected(),
            })
          } else {
            console.error('[WalletBridge] UI handler not found')
            sendResponse({ success: false, error: 'UI not ready' })
          }
          */
        } catch (e) {
          console.error('[WalletBridge] ❌ Error 1:', e)
          console.log('>>> 1', _this)
          _this.sendResponse({ success: false, error: e.message })
        }
      },

      // Обработка подтверждения
      handleConfirmed: async () => {
        console.log('>>> handleConfirmed', this)
        const _this = window.WalletAPI
        const req = _this.pendingRequest;
        if (!req) {
          return this.sendResponse({ success: false, error: 'No request' })
        }

        let result = null

        try {
          switch (req.method) {
            case 'eth_requestAccounts':
              if (!browserAccount) {
                throw new Error('No account available')
              }
              result = [browserAccount]
              break

            case 'eth_accounts':
              result = browserAccount ? [browserAccount] : []
              break

            case 'eth_chainId':
              result = browserChainId
              break

            case 'eth_sendTransaction':
              if (!browserWeb3 || !browserPK) {
                throw new Error('Web3 not initialized')
              }
              
              const tx = req.params[0]
              const signedTx = await browserWeb3.eth.accounts.signTransaction(
                {
                  to: tx.to,
                  value: tx.value,
                  data: tx.data,
                  gas: tx.gas || 21000,
                  gasPrice: tx.gasPrice,
                  nonce: tx.nonce,
                },
                browserPK
              )
              
              const receipt = await browserWeb3.eth.sendSignedTransaction(
                signedTx.rawTransaction
              )
              
              result = receipt.transactionHash
              break

            case 'personal_sign':
              if (!browserWeb3 || !browserPK) {
                throw new Error('Web3 not initialized')
              }
              
              const message = req.params[0]
              const signedMessage = browserWeb3.eth.accounts.sign(
                message,
                browserPK
              )
              
              result = signedMessage.signature
              break

            case 'eth_signTypedData':
            case 'eth_signTypedData_v4':
              if (!browserWeb3 || !browserPK) {
                throw new Error('Web3 not initialized')
              }

              const data = req.params[1]
              const typedData = typeof data === 'string' 
                ? JSON.parse(data) 
                : data

              const signedTypedData = browserWeb3.eth.accounts.signTypedData(
                typedData,
                browserPK
              )

              result = signedTypedData.signature
              break

            case 'wallet_switchEthereumChain':
              const newChainId = req.params[0].chainId
              // ???
              console.log('switch chain to ', newChainId)
              setStorageValue('activeNetwork', Number(newChainId))
              //switchNetwork(newChainId)
              result = null
              break

            default:
              result = 'OK'
          }

          return {
            success: true,
            result: result,
            chainId: _this.getState().chainId,
            _tabId: req.tabId,
            requestId: req.requestId,
          };

        } catch (error) {
          console.error('[WalletBridge] Transaction error 2:', error)
          _this.sendResponse({ success: false, error: error.message })
        }

      },
      handleApprove: async () => {
        
        const _this = window.WalletAPI
        const response = await _this.handleConfirmed();
        _this.sendResponse(response);
        _this.pendingRequest = null;
      },
      // Обработка отклонения
      handleRejected: () => {
        console.log('[Wallet] ❌ User rejected');
        console.log('this', this)
        const _this = window.WalletAPI
        _this.sendResponse({ success: false, error: 'User rejected' });
        _this.pendingRequest = null;
      },

      // Отправка ответа в Android
      sendResponse: (response: any) => {
        console.log('[Wallet] 📤 sendResponse:', response);
        if (window.AndroidWallet) {
            window.AndroidWallet.onWalletResponse(JSON.stringify(response));
        }
      },
    }

    console.log('[WalletBridge] ✅ Initialized')

    return () => {
      delete window.WalletAPI
    }
  }, [
    browserWeb3,
    browserAccount,
    browserPK,
    browserRPC,
    browserChainId,
    switchNetwork,
  ])

  return null // Компонент ничего не рендерит
}

export default WalletBridge

// Добавляем типы для TypeScript
declare global {
  interface Window {
    WalletAPI: any
    AndroidWallet?: {
      onWalletResponse: (response: string) => void
    }
    showWalletConfirmation?: (data: {
      method: string
      params: any[]
      onConfirm: () => void
      onReject: () => void
    }) => void
  }
}