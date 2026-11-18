package com.faisal.tvhub

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.provider.Settings
import android.view.KeyEvent
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import org.json.JSONObject

class MainActivity : Activity() {

    companion object {
        const val PREFS_NAME = "faisal_tv_urls"
        private const val HUB_ASSET_URL = "file:///android_asset/hub/index.html"
        const val TV_USER_AGENT = "Mozilla/5.0 (Linux; Android 9; MiTV-4A Build/PI; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36 BumiayuTV/1.0 IPTV/ExoPlayer"
    }

    private lateinit var webView: WebView
    private var isHubLoaded = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            setBackgroundColor(Color.parseColor("#0B0E14"))
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
            isFocusable = true
            isFocusableInTouchMode = true

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                useWideViewPort = true
                loadWithOverviewMode = true
                mediaPlaybackRequiresUserGesture = false
                cacheMode = WebSettings.LOAD_DEFAULT
                allowFileAccess = true
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                userAgentString = TV_USER_AGENT
            }

            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    isHubLoaded = true
                    syncUrlsToHubStorage()
                }
            }

            addJavascriptInterface(TvBridge(), "TvBridge")
        }

        setContentView(webView)
        webView.requestFocus()
        webView.loadUrl(HUB_ASSET_URL)
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) {
            webView.onResume()
            webView.requestFocus()
            if (isHubLoaded) {
                syncUrlsToHubStorage()
            }
        }
    }

    override fun onPause() {
        if (::webView.isInitialized) {
            webView.onPause()
        }
        super.onPause()
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            webView.removeJavascriptInterface("TvBridge")
            webView.destroy()
        }
        super.onDestroy()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && ::webView.isInitialized) {
            webView.evaluateJavascript("(function(){ return typeof window.onAndroidBack === 'function' && window.onAndroidBack(); })()") { result ->
                if (result != "true" && webView.canGoBack()) {
                    webView.goBack()
                }
            }
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    private fun syncUrlsToHubStorage() {
        val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val allEntries = prefs.all
        if (allEntries.isEmpty()) return

        val overridesJson = JSONObject()
        for ((key, value) in allEntries) {
            if (value is String && value.isNotBlank()) {
                overridesJson.put(key, value)
            }
        }
        if (overridesJson.length() == 0) return

        val escapedJson = JSONObject.quote(overridesJson.toString())
        val js = """
            (function() {
                try {
                    var overrides = JSON.parse($escapedJson);
                    var key = 'faisal_tv_apps_config';
                    var existing = {};
                    try {
                        var raw = localStorage.getItem(key);
                        if (raw) existing = JSON.parse(raw) || {};
                    } catch (e) {}
                    for (var k in overrides) {
                        if (Object.prototype.hasOwnProperty.call(overrides, k) && overrides[k]) {
                            existing[k] = overrides[k];
                        }
                    }
                    localStorage.setItem(key, JSON.stringify(existing));
                } catch (err) {}
            })();
        """.trimIndent()

        webView.post {
            webView.evaluateJavascript(js, null)
        }
    }

    private fun showToast(message: String) {
        runOnUiThread {
            Toast.makeText(this@MainActivity, message, Toast.LENGTH_SHORT).show()
        }
    }

    inner class TvBridge {

        @JavascriptInterface
        fun openWebApp(appName: String, url: String, appId: String) {
            val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val savedOverride = prefs.getString(appId, null)?.trim()
            val targetUrl = if (!savedOverride.isNullOrEmpty()) savedOverride else url

            runOnUiThread {
                val intent = Intent(this@MainActivity, WebAppActivity::class.java).apply {
                    putExtra(WebAppActivity.EXTRA_NAME, appName)
                    putExtra(WebAppActivity.EXTRA_URL, targetUrl)
                    putExtra(WebAppActivity.EXTRA_APP_ID, appId)
                }
                startActivity(intent)
            }
        }

        @JavascriptInterface
        fun launchApp(packageName: String) {
            try {
                val pm = packageManager
                val intent = pm.getLeanbackLaunchIntentForPackage(packageName)
                    ?: pm.getLaunchIntentForPackage(packageName)

                if (intent != null) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    startActivity(intent)
                } else {
                    showToast("Aplikasi belum terpasang: $packageName")
                }
            } catch (_e: Exception) {
                showToast("Aplikasi belum terpasang: $packageName")
            }
        }

        @JavascriptInterface
        fun openTvInputs() {
            try {
                val inputIntent = Intent("android.media.tv.action.VIEW_INPUTS").apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                startActivity(inputIntent)
                return
            } catch (_e: Exception) {
                // Fallback to Live Channels if VIEW_INPUTS is unavailable
            }

            val fallbackPackages = listOf("com.google.android.tv", "com.android.tv")
            for (pkg in fallbackPackages) {
                try {
                    val intent = packageManager.getLeanbackLaunchIntentForPackage(pkg)
                        ?: packageManager.getLaunchIntentForPackage(pkg)
                    if (intent != null) {
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        startActivity(intent)
                        return
                    }
                } catch (_e: Exception) {
                    // Try next fallback
                }
            }

            showToast("Menu Input TV tidak tersedia di perangkat ini.")
        }

        @JavascriptInterface
        fun openSettings() {
            try {
                val intent = Intent(Settings.ACTION_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                startActivity(intent)
            } catch (_e: Exception) {
                showToast("Tidak dapat membuka Pengaturan TV.")
            }
        }

        @JavascriptInterface
        fun saveAppUrl(appId: String, url: String) {
            if (appId.isBlank() || url.isBlank()) return
            val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().putString(appId.trim(), url.trim()).apply()
        }

        @JavascriptInterface
        fun getAppUrlsJson(): String {
            val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val json = JSONObject()
            for ((key, value) in prefs.all) {
                if (value is String) {
                    json.put(key, value)
                }
            }
            return json.toString()
        }
    }
}
