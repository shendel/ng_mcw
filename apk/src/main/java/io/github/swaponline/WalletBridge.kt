package io.github.swaponline

import android.webkit.JavascriptInterface
import org.json.JSONObject

class WalletBridge(private val activity: MainActivity) {

    private val silentMethods = setOf(
        "eth_blockNumber", "eth_gasPrice", "eth_maxPriorityFeePerGas",
        "eth_estimateGas", "eth_call", "eth_getCode", "eth_getStorageAt",
        "eth_getTransactionCount", "eth_getBalance", "eth_getLogs",
        "eth_getTransactionReceipt ",
        "eth_getFilterLogs", "eth_getFilterChanges", "eth_newFilter",
        "eth_newBlockFilter", "eth_uninstallFilter", "eth_syncing",
        "eth_coinbase", "eth_hashrate", "eth_mining", "net_version",
        "net_listening", "net_peerCount", "web3_clientVersion",
        "web3_sha3", "wallet_getCapabilities", "wallet_getPermissions",
        "wallet_getState"
    )

    private var shouldSwitchBackToBrowser = false

    @JavascriptInterface
    fun requestFromWallet(requestJson: String) {
        // ✅ Проверка входных данных (как проверка аргументов в C)
        if (requestJson.isEmpty()) return
        val json = try {
            JSONObject(requestJson)
        } catch (e: Exception) {
            return
        }
        val tabId = try {
            json.getString("tabId")
        } catch (e: Exception) {
            return
        }
        val currentTab = activity.tabManager.getTab(tabId)
        val tabUrl = currentTab?.url ?: ""



        val method = try {
            json.getString("method")
        } catch (e: Exception) {
            return
        }

        val requiresConfirmation = !silentMethods.contains(method)

        if (requiresConfirmation) {
            activity.tabManager.enqueueRequest(tabId, tabUrl, requestJson, method)
            processNextRequest()
        } else {
            activity.runOnUiThread {
                val jsCode = "WalletAPI.handleRequest($requestJson)"
                activity.webViewWallet.evaluateJavascript(jsCode, null)
            }
        }
    }

    fun processNextRequest() {
        if (activity.tabManager.isProcessing() || activity.tabManager.isQueueEmpty()) {
            return
        }

        val request = activity.tabManager.dequeueRequest()
        if (request == null) return

        activity.tabManager.setProcessing(true)
        shouldSwitchBackToBrowser = true

        val enrichedJson = enrichRequestWithTabInfo(request.requestJson, request.tabId, request.tabUrl)

        activity.runOnUiThread {
            activity.switchToWalletView()
            val jsCode = "WalletAPI.handleRequest($enrichedJson)"
            activity.webViewWallet.evaluateJavascript(jsCode, null)
        }
    }

    private fun enrichRequestWithTabInfo(requestJson: String, tabId: String, tabUrl: String): String {
        return try {
            val json = JSONObject(requestJson)
            json.put("_tabId", tabId)
            json.put("_tabUrl", tabUrl)
            json.toString()
        } catch (e: Exception) {
            requestJson
        }
    }

    @JavascriptInterface
    fun onWalletResponse(responseJson: String) {
        if (responseJson.isEmpty()) return

        activity.runOnUiThread {
            val currentTab = activity.tabManager.getCurrentTab()

            if (shouldSwitchBackToBrowser) {
                activity.switchToBrowserView()
                shouldSwitchBackToBrowser = false
            }

            val jsCode = """
                if(window.ethereum && typeof window.ethereum._handleBridgeResponse === 'function') {
                    window.ethereum._handleBridgeResponse('$responseJson');
                }
            """.trimIndent()

            // ✅ Проверка перед доступом (как if (ptr != NULL))
            currentTab?.webView?.evaluateJavascript(jsCode, null)

            activity.tabManager.setProcessing(false)
            processNextRequest()
        }
    }

    fun completeRequest(result: String) {
        onWalletResponse(result)
    }

    fun getQueueSize(): Int = activity.tabManager.getQueueSize()
}