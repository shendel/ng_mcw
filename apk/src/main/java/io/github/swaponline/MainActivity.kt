package io.github.swaponline

import android.os.Bundle
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.HorizontalScrollView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    lateinit var webViewWallet: WebView
    lateinit var browserContainer: FrameLayout
    lateinit var tabsContainer: LinearLayout
    lateinit var btnAddTab: Button
    lateinit var btnCloseTab: Button
    lateinit var tabCounter: TextView
    lateinit var urlInput: EditText
    lateinit var btnGo: Button
    lateinit var btnHome: Button
    lateinit var btnBrowser: Button
    lateinit var browserToolbar: LinearLayout

    lateinit var providerScript: String
    var walletBridge: WalletBridge? = null
    lateinit var tabManager: TabManager
    var currentTabIndex = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webViewWallet = findViewById(R.id.webViewWallet)
        browserContainer = findViewById(R.id.browserContainer)
        tabsContainer = findViewById(R.id.tabsContainer)
        btnAddTab = findViewById(R.id.btnAddTab)
        btnCloseTab = findViewById(R.id.btnCloseTab)
        tabCounter = findViewById(R.id.tabCounter)
        urlInput = findViewById(R.id.urlInput)
        btnGo = findViewById(R.id.btnGo)
        btnHome = findViewById(R.id.btnHome)
        btnBrowser = findViewById(R.id.btnBrowser)
        browserToolbar = findViewById(R.id.browserToolbar)

        providerScript = loadAssetFile("provider/provider.js")
        tabManager = TabManager()
        walletBridge = WalletBridge(this)

        setupWebView(webViewWallet, isWallet = true)

        // Создаём первую вкладку
        createNewTab()
        val settings = webViewWallet.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        @Suppress("DEPRECATION")
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true


        webViewWallet.webChromeClient = WebChromeClient()

        webViewWallet.addJavascriptInterface(WalletCallbackBridge(this), "AndroidWallet")
        //webViewWallet.loadUrl("file:///android_asset/wallet/index.html")
        webViewWallet.loadUrl("http://192.168.0.105:3000/")

        btnAddTab.setOnClickListener { createNewTab() }
        btnCloseTab.setOnClickListener { closeCurrentTab() }
        btnGo.setOnClickListener { loadUrlInCurrentTab() }
        btnHome.setOnClickListener { switchToWalletView() }
        btnBrowser.setOnClickListener {
            if (tabManager.getTabCount() == 0) {
                createNewTab()
            }
            switchToBrowserView()
        }

        switchToBrowserView()

        // Инициализируем видимость кнопок
        btnHome.visibility = View.VISIBLE
        btnBrowser.visibility = View.VISIBLE
    }

    private fun createNewTab() {
        val webView = createWebView()
        val tabId = tabManager.createTab(webView)

        // Добавляем WebView в контейнер
        browserContainer.addView(webView, FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ))

        // Добавляем кнопку вкладки
        addTabButton(tabId, tabsContainer.childCount)

        currentTabIndex = tabManager.getTabCount() - 1
        showCurrentTab()
        updateTabUI()
    }

    private fun addTabButton(tabId: String, position: Int) {
        val tabButton = Button(this).apply {
            text = "Tab ${position + 1}"
            // ✅ Применяем стиль НЕАКТИВНОЙ вкладки по умолчанию
            //setTextAppearance(R.style.TabButton_Inactive)

            setOnClickListener {
                val index = tabManager.getAllTabs().indexOfFirst { it.id == tabId }
                if (index >= 0) {
                    currentTabIndex = index
                    showCurrentTab()
                    updateTabStyles() // ✅ Обновляем стили
                    updateTabUI()
                }
            }

            setOnLongClickListener {
                val tab = tabManager.getTab(tabId)
                tab?.let { info ->
                    urlInput.setText(info.url)
                    Toast.makeText(this@MainActivity, "URL: ${info.url}", Toast.LENGTH_SHORT).show()
                    true
                } ?: false
            }
        }
        androidx.core.widget.TextViewCompat.setTextAppearance(tabButton, R.style.TabButton_Active)

        tabsContainer.addView(tabButton)
    }
    private fun updateTabStyles() {
        for (i in 0 until tabsContainer.childCount) {
            val btn = tabsContainer.getChildAt(i) as? Button ?: continue

            if (i == currentTabIndex) {
                // ✅ Активная вкладка - применяем стиль из XML
                androidx.core.widget.TextViewCompat.setTextAppearance(btn, R.style.TabButton_Active)
            } else {
                // ✅ Неактивная вкладка - применяем стиль из XML
                androidx.core.widget.TextViewCompat.setTextAppearance(btn, R.style.TabButton_Inactive)
            }
        }
    }
    private fun closeCurrentTab() {
        if (tabManager.getTabCount() <= 1) {
            Toast.makeText(this, "Нельзя закрыть последнюю вкладку", Toast.LENGTH_SHORT).show()
            return
        }

        val currentTab = tabManager.getCurrentTab() ?: return

        // Удаляем WebView из контейнера
        browserContainer.removeView(currentTab.webView)
        currentTab.webView.destroy()

        // Удаляем кнопку вкладки
        tabsContainer.removeViewAt(currentTabIndex)

        // Закрываем вкладку в TabManager
        tabManager.closeTab(currentTab.id)

        // Обновляем текущий индекс
        if (currentTabIndex >= tabManager.getTabCount()) {
            currentTabIndex = tabManager.getTabCount() - 1
        }

        // Переименовываем кнопки вкладок
        for (i in 0 until tabsContainer.childCount) {
            val btn = tabsContainer.getChildAt(i) as? Button
            btn?.text = "Tab ${i + 1}"
        }

        showCurrentTab()
        updateTabUI()
    }

    private fun showCurrentTab() {
        val tabs = tabManager.getAllTabs()
        tabs.forEachIndexed { index, tab ->
            tab.webView.visibility = if (index == currentTabIndex) {
                View.VISIBLE
            } else {
                View.GONE
            }
        }

        // Обновляем URL в поле ввода
        tabs.getOrNull(currentTabIndex)?.let {
            urlInput.setText(it.url)
        }
    }

    private fun createWebView(): WebView {
        return WebView(this).apply {
            setupWebView(this, isWallet = false)
            loadUrl("https://www.google.com")
        }
    }

    private fun loadUrlInCurrentTab() {
        val currentTab = tabManager.getCurrentTab() ?: return
        var url = urlInput.text.toString().trim()
        if (url.isNotEmpty()) {
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://$url"
            }
            currentTab.webView.loadUrl(url)
            tabManager.updateTabUrl(currentTab.id, url)
        }
    }

    private fun setupWebView(webView: WebView, isWallet: Boolean) {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        @Suppress("DEPRECATION")
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true

        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                if (!isWallet && url != null) {
                    tabManager.getAllTabs().find { it.webView == view }?.let {
                        tabManager.updateTabUrl(it.id, url)
                        view?.evaluateJavascript("window.SO_TAB_ID=\"" + it.id + "\"", null)

                        view?.evaluateJavascript(providerScript, null)
                        if (tabManager.getAllTabs().indexOf(it) == currentTabIndex) {
                            urlInput.setText(url)
                        }
                    }
                }
                if (!isWallet) {
                    //view?.evaluateJavascript("window.SO_TAB_ID=\"${it.id}\"")

                    //view?.evaluateJavascript(providerScript, null)
                }
            }

            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return false
            }
        }

        if (!isWallet) {
            webView.addJavascriptInterface(walletBridge!!, "AndroidWallet")
        }
    }

    fun switchToWalletView() {
        runOnUiThread {
            webViewWallet.visibility = View.VISIBLE
            browserContainer.visibility = View.GONE
            browserToolbar.visibility = View.GONE
            tabsContainer.visibility = View.GONE
            btnAddTab.visibility = View.GONE
            btnCloseTab.visibility = View.GONE
            tabCounter.visibility = View.GONE

            btnHome.visibility = View.VISIBLE
            btnBrowser.visibility = View.VISIBLE
        }
    }

    fun switchToBrowserView() {
        runOnUiThread {
            webViewWallet.visibility = View.GONE
            browserContainer.visibility = View.VISIBLE
            browserToolbar.visibility = View.VISIBLE
            tabsContainer.visibility = View.VISIBLE
            btnAddTab.visibility = View.VISIBLE
            btnCloseTab.visibility = View.VISIBLE
            tabCounter.visibility = View.VISIBLE

            showCurrentTab()

            btnHome.visibility = View.VISIBLE
            btnBrowser.visibility = View.VISIBLE
        }
        updateTabUI()
    }

    private fun updateTabUI() {
        tabCounter.text = "${tabManager.getTabCount()} вкладок"
    }

    private fun loadAssetFile(path: String): String {
        return try {
            assets.open(path).bufferedReader().use { it.readText() }
        } catch (e: Exception) {
            e.printStackTrace()
            ""
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        val currentTab = tabManager.getCurrentTab()
        if (currentTab?.webView?.canGoBack() == true && webViewWallet.visibility == View.GONE) {
            currentTab.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        tabManager.getAllTabs().forEach { it.webView.destroy() }
        webViewWallet.destroy()
        walletBridge = null
    }
}