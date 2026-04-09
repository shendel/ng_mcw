var WalletState = {
    accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
    chainId: "0x1",
    isConnected: true
};

var pendingRequest = null;

var WalletAPI = {
    handleRequest: function(requestJson) {
        console.log('[Wallet] 📥 handleRequest:', requestJson);
        try {
            var request = requestJson;
            var method = request.method;
            var params = request.params;
            var tabUrl = request._tabUrl;
            var tabId = request._tabId;

            if (method === 'wallet_getState') {
                this.sendResponse({
                    success: true,
                    result: {
                        accounts: WalletState.accounts,
                        chainId: WalletState.chainId,
                        isConnected: WalletState.isConnected
                    },
                    chainId: WalletState.chainId
                });
                return;
            }

            if (method === 'eth_blockNumber') {
                this.sendResponse({
                    success: true,
                    result: "0x54eb329",
                    chainId: WalletState.chainId
                });
                return;
            }

            if (method === 'eth_accounts') {
                this.sendResponse({
                    success: true,
                    result: WalletState.accounts,
                    chainId: WalletState.chainId
                });
                return;
            }

            if (method === 'eth_chainId') {
                this.sendResponse({
                    success: true,
                    result: WalletState.chainId,
                    chainId: WalletState.chainId
                });
                return;
            }

            this.pendingRequest = {
                method: method,
                params: params,
                tabUrl: tabUrl,
                tabId: tabId
            };
            this.showModal(method, params, tabUrl, tabId);
        } catch (e) {
            console.error('[Wallet] ❌ Error:', e);
            this.sendResponse({ success: false, error: e.message });
        }
    },

    handleConfirmed: function() {
        var req = this.pendingRequest;
        if (!req) return { success: false, error: 'No request' };

        var result = null;

        switch (req.method) {
            case 'eth_chainId':
                result = WalletState.chainId;
                break;
            case 'eth_requestAccounts':
                WalletState.isConnected = true;
                result = WalletState.accounts;
                break;
            case 'personal_sign':
                result = '0x' + Array(131).join('a');
                break;
            case 'eth_sendTransaction':
                result = '0x' + Array(65).join('f');
                break;
            case 'wallet_switchEthereumChain':
                if (req.params && req.params[0] && req.params[0].chainId) {
                    WalletState.chainId = req.params[0].chainId;
                }
                result = null;
                break;
            default:
                result = 'OK';
        }

        return { success: true, result: result, chainId: WalletState.chainId };
    },

    showModal: function(method, params, tabUrl, tabId) {
        console.log('[Wallet] ✍️ Show modal:', method, 'Tab:', tabId);

        var modal = document.getElementById('confirmationModal');
        var title = document.getElementById('modalTitle');
        var details = document.getElementById('modalDetails');
        var tabInfo = document.getElementById('tabInfo');

        if (!modal || !title || !details) {
            this.sendResponse({ success: false, error: 'UI not ready' });
            return;
        }

        title.textContent = 'Confirm ' + method;
        details.textContent = JSON.stringify(params, null, 2);

        if (tabInfo) {
            var shortUrl = tabUrl ? (tabUrl.length > 50 ? tabUrl.substring(0, 50) + '...' : tabUrl) : 'Unknown';
            tabInfo.textContent = '📑 Вкладка: ' + shortUrl;
            tabInfo.style.display = 'block';
        }

        modal.classList.remove('hidden');
    },

    approve: function() {
        console.log('[Wallet] ✅ User approved');
        this.hideModal();
        var response = this.handleConfirmed();
        this.sendResponse(response);
        this.pendingRequest = null;
    },

    reject: function() {
        console.log('[Wallet] ❌ User rejected');
        this.hideModal();
        this.sendResponse({ success: false, error: 'User rejected' });
        this.pendingRequest = null;
    },

    sendResponse: function(response) {
        console.log('[Wallet] 📤 sendResponse:', response);
        if (window.AndroidWallet) {
            window.AndroidWallet.onWalletResponse(JSON.stringify(response));
        }
    },

    hideModal: function() {
        var modal = document.getElementById('confirmationModal');
        var tabInfo = document.getElementById('tabInfo');
        if (modal) modal.classList.add('hidden');
        if (tabInfo) tabInfo.style.display = 'none';
    },

    showNotification: function(message) {
        var notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(function() {
                notification.classList.remove('show');
            }, 3000);
        }
    }
};

window.WalletAPI = WalletAPI;