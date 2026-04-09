package io.github.swaponline

import android.webkit.WebView
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.UUID

data class TabInfo(
    val id: String,
    val webView: WebView,
    var url: String = "",
    var title: String = ""
)

data class PendingRequest(
    val requestId: String,
    val tabId: String,
    val tabUrl: String,
    val requestJson: String,
    val method: String
)

class TabManager {
    private val tabs = mutableMapOf<String, TabInfo>()
    private val requestQueue = ConcurrentLinkedQueue<PendingRequest>()
    private var currentTabId: String? = null
    private var isProcessing = false

    fun createTab(webView: WebView): String {
        val id = UUID.randomUUID().toString()
        tabs[id] = TabInfo(id, webView)
        currentTabId = id
        return id
    }

    fun closeTab(tabId: String) {
        val tab = tabs.remove(tabId)

        // ✅ Освобождаем память (как free())
        tab?.webView?.destroy()

        if (currentTabId == tabId) {
            currentTabId = tabs.keys.firstOrNull()
        }
    }

    fun getTab(tabId: String): TabInfo? = tabs[tabId]
    fun getCurrentTab(): TabInfo? = currentTabId?.let { tabs[it] }

    fun setCurrentTab(tabId: String) {
        if (tabs.containsKey(tabId)) {
            currentTabId = tabId
        }
    }

    fun getTabCount(): Int = tabs.size
    fun getAllTabs(): List<TabInfo> = tabs.values.toList()
    fun updateTabUrl(tabId: String, url: String) { tabs[tabId]?.url = url }

    fun enqueueRequest(tabId: String, tabUrl: String, requestJson: String, method: String): String {
        val requestId = UUID.randomUUID().toString()
        requestQueue.offer(PendingRequest(requestId, tabId, tabUrl, requestJson, method))
        return requestId
    }

    fun dequeueRequest(): PendingRequest? = requestQueue.poll()
    fun isQueueEmpty(): Boolean = requestQueue.isEmpty()
    fun getQueueSize(): Int = requestQueue.size
    fun setProcessing(value: Boolean) { isProcessing = value }
    fun isProcessing(): Boolean = isProcessing

    // ✅ Очистка всех ресурсов (как cleanup в C)
    fun destroy() {
        tabs.values.forEach { it.webView.destroy() }
        tabs.clear()
        requestQueue.clear()
        currentTabId = null
        isProcessing = false
    }
}