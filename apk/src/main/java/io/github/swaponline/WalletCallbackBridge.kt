package io.github.swaponline

import android.webkit.JavascriptInterface

class WalletCallbackBridge(private val activity: MainActivity) {

    @JavascriptInterface
    fun onWalletResponse(resultJson: String) {
        activity.runOnUiThread {
            activity.walletBridge?.onWalletResponse(resultJson)
        }
    }
}