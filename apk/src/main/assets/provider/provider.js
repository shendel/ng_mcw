(function() {
    if (window.ethereum && window.ethereum.isWrapper) {
        return;
    }

    console.log("[Wrapper] 🚀 Injecting Ethereum Provider (Multi-tab)...");
    const pendingRequests = new Map();  // ✅ Храним ВСЕ запросы
    let requestIdCounter = 0;

    const TAB_ID = window.SO_TAB_ID
    console.log("[Wrapper] 📑 Tab ID:", TAB_ID);

    const MOCK_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    const KNOWN_CHAINS = {
        "0x1": { chainId: "0x1", chainName: "Ethereum Mainnet", rpcUrl: "https://mainnet.infura.io" },
        "0x5": { chainId: "0x5", chainName: "Goerli Testnet", rpcUrl: "https://goerli.infura.io" },
        "0xaa36a7": { chainId: "0xaa36a7", chainName: "Sepolia Testnet", rpcUrl: "https://sepolia.infura.io" },
        "0x38": { chainId: "0x38", chainName: "BSC Mainnet", rpcUrl: "https://bsc-dataseed.binance.org" },
        "0x89": { chainId: "0x89", chainName: "Polygon Mainnet", rpcUrl: "https://polygon-rpc.com" }
    };

    const state = {
        accounts: [],
        chainId: "0x1",
        isConnected: false,
        isUnlocked: true,
        initialized: false,
        syncing: false,
        eventListeners: {}
    };

    function emit(event, data) {
        console.log("[Wrapper] 📢 Emit:", event, data);
        const listeners = state.eventListeners[event];
        if (listeners) {
            listeners.slice().forEach(function(cb) {
                try {
                    if (typeof cb === 'function') cb(data);
                } catch (e) {
                    console.error("Event listener error:", e);
                }
            });
        }
    }

    let responseResolver = null;

    function bridgeRequest(method, params) {

        params = params || [];
        console.log('[Bridge Request]', method, params, AndroidWallet)
        if (typeof AndroidWallet === 'undefined') {
            throw { code: -32601, message: "No AndroidWallet bridge found" };
        }

        return new Promise(function(resolve, reject) {
            const requestId = ++requestIdCounter;
            pendingRequests.set(requestId, {
                resolve: resolve,
                reject: reject,
                method: method,
                tabId: TAB_ID,
                timestamp: Date.now()
            });

            var payload = JSON.stringify({
                method: method,
                params: params,
                tabId: TAB_ID,
                requestId: requestId
            });
            console.log("[Wrapper] 🌉 Bridge Request:", method, "Tab:", TAB_ID, payload);
            AndroidWallet.requestFromWallet(payload);

            setTimeout(function() {
                if (pendingRequests.has(requestId)) {
                    var req = pendingRequests.get(requestId);
                    pendingRequests.delete(requestId);
                    req.reject({
                        code: -32603,
                        message: "Bridge timeout (30s)",
                        requestId: requestId
                    });
                }
            }, 30000);
        });
    }

    function updateStateFromResponse(method, response) {
        var shouldEmitAccounts = false;
        var shouldEmitChain = false;
        console.log('[UpdateState]', method, response)
        switch (method) {
            case 'eth_requestAccounts':
                if (response.result && Array.isArray(response.result)) {
                    state.accounts = response.result;
                    state.isConnected = true;
                    state.isUnlocked = true;
                    shouldEmitAccounts = true;
                }
                break;
            case 'wallet_switchEthereumChain':
                if (response.chainId) {
                    state.chainId = response.chainId;
                    shouldEmitChain = true;
                }
                break;
            case 'wallet_getState':
                if (response.result) {
                    if (response.result.accounts) state.accounts = response.result.accounts;
                    if (response.result.chainId) state.chainId = response.result.chainId;
                    state.isConnected = true;
                    state.initialized = true;
                    shouldEmitAccounts = true;
                    shouldEmitChain = true;
                }
                break;
        }

        if (shouldEmitAccounts) {
            emit('accountsChanged', state.accounts);
            if (state.isConnected) emit('connect', { chainId: state.chainId });
        }
        if (shouldEmitChain) {
            emit('chainChanged', state.chainId);
        }
    }

    function request(args) {
    console.log('[Request]', args)
        if (!args || !args.method) throw new Error("Invalid request args");
        var method = args.method;
        var params = args.params || [];
        console.log("[Wrapper] 📥 Request:", method, state.initialized, "Tab:", TAB_ID, params);
        if (state.initialized) {
            if (method === 'eth_accounts') return Promise.resolve(state.accounts);
            if (method === 'eth_chainId') return Promise.resolve(state.chainId);
            if (method === 'net_version') return Promise.resolve(parseInt(state.chainId, 16).toString());
            if (method === 'eth_getBalance') return Promise.resolve("0x2386F26FC10000");
        }
        return bridgeRequest(method, params).then(function(result) {
            updateStateFromResponse(method, { result: result });
            return result;
        }).catch(function(e) {
            console.error("[Wrapper] ❌ Request failed:", method, e);
            throw e;
        });
    }

    function _handleBridgeResponse(responseJson) {
        console.log('[Wrapper] ✅ Bridge Response received:', responseJson);
         try {
            var response = JSON.parse(responseJson);

            // ✅ Извлекаем requestId из ответа
            var requestId = response.requestId;

            if (requestId === undefined || requestId === null) {
                console.warn('[Wrapper] ⚠️ Response without requestId');
                // Для обратной совместимости - пробуем старый способ
                if (pendingRequests.size === 1) {
                    requestId = Array.from(pendingRequests.keys())[0];
                } else {
                    return;
                }
            }

            // ✅ Находим запрос по ID
            var resolver = pendingRequests.get(requestId);

            if (!resolver) {
                console.warn('[Wrapper] ⚠️ No pending request for ID:', requestId,
                            'Pending:', Array.from(pendingRequests.keys()));
                return;
            }

            // ✅ Удаляем из pending
            pendingRequests.delete(requestId);

            // ✅ Проверяем успех
            if (!response.success) {
                console.log('[Wrapper] ❌ Request failed:', response.error);
                resolver.reject({
                    code: 4001,
                    message: response.error || 'Rejected',
                    requestId: requestId
                });
                return;
            }

            // ✅ Обновляем состояние
            updateStateFromResponse(resolver.method, response);

            // ✅ Резолвим ПРАВИЛЬНЫЙ промис
            console.log('[Wrapper] ✅ Resolving request:', requestId,
                       'Method:', resolver.method,
                       'Result:', response.result);
            resolver.resolve(response.result);

        } catch (e) {
            console.error('[Wrapper] ❌ Error handling response:', e);

            // Если есть requestId -reject все pending (на всякий случай)
            if (requestId && pendingRequests.has(requestId)) {
                var resolver = pendingRequests.get(requestId);
                pendingRequests.delete(requestId);
                resolver.reject(e);
            }
        }
    }

    function _syncState() {
        if (state.initialized || state.syncing) {
            console.log("[Wrapper] ⏭️ Sync already in progress or done");
            return Promise.resolve();
        }
        state.syncing = true;
        /*
        return bridgeRequest('wallet_getState', []).then(function() {
            console.log("[Wrapper] ✅ State synced");
            state.isConnected = true
            state.initialized = true;
        }).catch(function(e) {
            console.warn("[Wrapper] ⚠️ Init sync failed, using defaults", e);
            state.accounts = [MOCK_ADDRESS];
            state.isConnected = true;
        });
        */
        return bridgeRequest('wallet_getState', []).then(function(result) {
            console.log("[Wrapper] ✅ State sync response:", result);

            // ✅ Проверяем, что ответ валидный
            if (result) {
                if (result.accounts && result.accounts.length > 0) {
                    state.accounts = result.accounts;
                    state.isConnected = true;
                }
                if (result.chainId) {
                    state.chainId = result.chainId;
                }
                state.initialized = true;

                // ✅ Эмитим события ТОЛЬКО если есть аккаунты
                if (state.accounts.length > 0) {
                    emit('accountsChanged', state.accounts);
                    emit('connect', { chainId: state.chainId });
                    emit('chainChanged', state.chainId);
                }

                console.log("[Wrapper] ✅ State synced:", {
                    accounts: state.accounts,
                    chainId: state.chainId,
                    isConnected: state.isConnected
                });
            } else {
                console.warn("[Wrapper] ⚠️ Invalid state response", result);
                state.isConnected = false;
            }
        }).catch(function(e) {
            console.warn("[Wrapper] ⚠️ Init sync failed:", e);
            // ✅ НЕ используем MOCK! Оставляем состояние как есть
            state.isConnected = false;
            state.accounts = [];
        }).finally(function() {
            state.syncing = false;  // ✅ Снимаем блокировку
        });
    }

    var provider = {
        isMetaMask: true,
        isWrapper: true,
        isMetaMaskLike: true,
        connected: state.isConnected,
        initialized: true,

        get chainId() {
            console.log('call chainId()')
            return state.chainId;
        },
        get networkVersion() {
            console.log('call networkVersion()')
            return parseInt(state.chainId, 16).toString();
        },
        get selectedAddress() {
            console.log('call selectedAddress()')
            return state.accounts[0] || undefined;
        },
        get isConnected() {
            console.log('call isConnected()')
            return state.isConnected;
        },

        request: request,

        send: function(methodOrPayload, callback) {
            console.log('call send', methodOrPayload)
            if (typeof methodOrPayload === 'string') {
                return this.request({ method: methodOrPayload, params: callback });
            }
            return this.request(methodOrPayload);
        },

        sendAsync: function(payload, callback) {
            console.log('call sendAsync', payload)
            this.send(payload, callback);
        },

        enable: function() {
            console.log('call enable')
            return this.request({ method: "eth_requestAccounts" });
        },

        on: function(event, handler) {
            console.log('Setup on', event, handler)
            if (!state.eventListeners[event]) state.eventListeners[event] = [];
            state.eventListeners[event].push(handler);
            return this;
        },

        once: function(event, handler) {
            console.log('Setup once', event, handler)
            var self = this;
            var wrapped = function() {
                handler.apply(null, arguments);
                self.removeListener(event, wrapped);
            };
            return this.on(event, wrapped);
        },

        removeListener: function(event, handler) {
            if (state.eventListeners[event]) {
                state.eventListeners[event] = state.eventListeners[event].filter(function(h) {
                    return h !== handler;
                });
            }
            return this;
        },

        removeAllListeners: function(event) {
            if (event) {
                delete state.eventListeners[event];
            } else {
                Object.keys(state.eventListeners).forEach(function(k) {
                    delete state.eventListeners[k];
                });
            }
            return this;
        },

        _handleBridgeResponse: _handleBridgeResponse,
        _syncState: _syncState,
        _state: state,
        _tabId: TAB_ID
    };

    window.ethereum = provider;
    if (!window.web3) {
        window.web3 = {
            currentProvider: provider,
             __isMetaMaskShim__: true
        }

    }
    console.log("[Wrapper] ✅ window.ethereum ready! (Multi-tab)");
    // ========================================
    // ✅ EIP-6963 Multi-Provider Support
    // ========================================

    const EIP6963_INFO = {
        uuid: "io.github.swaponline.android-wrapper",
        name: "Android Wallet Wrapper",
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='%23627EEA'/><path fill='white' d='M8 4v8M4 8h8'/></svg>",
        rdns: "io.github.swaponline.wrapper"
    };

    // Dispatch announce event
    function announceProvider() {
        console.log("[Wrapper] 📢 EIP-6963: Announcing provider", EIP6963_INFO);

        const event = new CustomEvent("eip6963:announceProvider", {
            detail: Object.freeze({
                info: EIP6963_INFO,
                provider: provider
            })
        });

        window.dispatchEvent(event);
    }

    // Listen for request event
    window.addEventListener("eip6963:requestProvider", () => {
        console.log("[Wrapper] 📡 EIP-6963: Provider requested");
        announceProvider();
    });

    // Announce immediately
    setTimeout(announceProvider, 0);
    setTimeout(announceProvider, 100);

    // Also announce on connect event
    const originalEmit = emit;
    console.log('originalEmit', originalEmit)
    emit = function(event, data) {
        if (event === "connect") {
            setTimeout(announceProvider, 0);
        }
        if (emit) originalEmit(event, data);
    };

    console.log("[Wrapper] ✅ EIP-6963 support enabled");
    _syncState();
})();