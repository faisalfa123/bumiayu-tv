package com.faisal.tvhub

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.SystemClock
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import org.json.JSONObject
import kotlin.math.min

class WebAppActivity : Activity() {

    companion object {
        const val EXTRA_NAME = "extra_name"
        const val EXTRA_URL = "extra_url"
        const val EXTRA_APP_ID = "extra_app_id"

        private const val ERROR_ASSET_PREFIX = "file:///android_asset/error.html"
        private const val BASE_POINTER_STEP_PX = 28f
        private const val MAX_POINTER_STEP_PX = 60f
        private const val ACCEL_PER_REPEAT_PX = 4f
        private const val EDGE_SCROLL_THRESHOLD = 0.10f
        private const val EDGE_SCROLL_STEP_PX = 64
    }

    private lateinit var webView: WebView
    private lateinit var pointerView: VirtualPointerView

    private var appName: String = "Aplikasi"
    private var targetUrl: String = ""
    private var appId: String = ""

    private var pointerMode = true
    private var isErrorPage = false
    private var activeTouchDownTime: Long = 0L

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        appName = intent.getStringExtra(EXTRA_NAME) ?: "Aplikasi"
        targetUrl = intent.getStringExtra(EXTRA_URL) ?: ""
        appId = intent.getStringExtra(EXTRA_APP_ID) ?: ""

        val root = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#0B0E14"))
        }

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
                builtInZoomControls = false
                displayZoomControls = false
            }

            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    isErrorPage = url?.startsWith(ERROR_ASSET_PREFIX) == true
                    updatePointerVisibility()
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    isErrorPage = url?.startsWith(ERROR_ASSET_PREFIX) == true
                    updatePointerVisibility()
                }

                @Deprecated("Deprecated in Java")
                override fun onReceivedError(
                    view: WebView?,
                    errorCode: Int,
                    description: String?,
                    failingUrl: String?
                ) {
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                        if (failingUrl != null && !failingUrl.startsWith(ERROR_ASSET_PREFIX)) {
                            loadErrorPage(failingUrl)
                        }
                    }
                }

                override fun onReceivedError(
                    view: WebView?,
                    request: WebResourceRequest?,
                    error: WebResourceError?
                ) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && request?.isForMainFrame == true) {
                        val failingUrl = request.url?.toString() ?: targetUrl
                        if (!failingUrl.startsWith(ERROR_ASSET_PREFIX)) {
                            loadErrorPage(failingUrl)
                        }
                    }
                }

                override fun onReceivedHttpError(
                    view: WebView?,
                    request: WebResourceRequest?,
                    errorResponse: WebResourceResponse?
                ) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                        request?.isForMainFrame == true &&
                        errorResponse != null &&
                        errorResponse.statusCode >= 500
                    ) {
                        val failingUrl = request.url?.toString() ?: targetUrl
                        if (!failingUrl.startsWith(ERROR_ASSET_PREFIX)) {
                            loadErrorPage(failingUrl)
                        }
                    }
                }
            }

            addJavascriptInterface(WebAppBridge(), "TvBridge")
        }

        pointerView = VirtualPointerView(this)

        root.addView(
            webView,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )
        root.addView(
            pointerView,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )

        setContentView(root)
        webView.requestFocus()

        if (targetUrl.isNotBlank()) {
            webView.loadUrl(targetUrl)
        } else {
            loadErrorPage("")
        }
    }

    private fun updatePointerVisibility() {
        if (::pointerView.isInitialized) {
            pointerView.setPointerVisible(pointerMode && !isErrorPage)
        }
    }

    private fun loadErrorPage(failingUrl: String) {
        val urlToReport = failingUrl.ifBlank { targetUrl }
        val errorUri = Uri.parse(ERROR_ASSET_PREFIX).buildUpon()
            .appendQueryParameter("name", appName)
            .appendQueryParameter("url", urlToReport)
            .appendQueryParameter("appId", appId)
            .build()
            .toString()

        isErrorPage = true
        updatePointerVisibility()
        webView.post {
            webView.loadUrl(errorUri)
        }
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        val keyCode = event.keyCode

        if (keyCode == KeyEvent.KEYCODE_MENU || keyCode == KeyEvent.KEYCODE_INFO) {
            if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0 && !isErrorPage) {
                pointerMode = !pointerMode
                updatePointerVisibility()
                val label = if (pointerMode) "Mode Pointer Aktif" else "Mode D-Pad Native Aktif"
                Toast.makeText(this, label, Toast.LENGTH_SHORT).show()
            }
            return true
        }

        if (pointerMode && !isErrorPage) {
            when (keyCode) {
                KeyEvent.KEYCODE_DPAD_UP,
                KeyEvent.KEYCODE_DPAD_DOWN,
                KeyEvent.KEYCODE_DPAD_LEFT,
                KeyEvent.KEYCODE_DPAD_RIGHT -> {
                    if (event.action == KeyEvent.ACTION_DOWN) {
                        val step = min(
                            MAX_POINTER_STEP_PX,
                            BASE_POINTER_STEP_PX + (event.repeatCount * ACCEL_PER_REPEAT_PX)
                        )
                        handlePointerMove(keyCode, step)
                    }
                    return true
                }

                KeyEvent.KEYCODE_DPAD_CENTER,
                KeyEvent.KEYCODE_ENTER -> {
                    if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0) {
                        activeTouchDownTime = SystemClock.uptimeMillis()
                        dispatchTouchAtPointer(MotionEvent.ACTION_DOWN, activeTouchDownTime, activeTouchDownTime)
                    } else if (event.action == KeyEvent.ACTION_UP) {
                        val downTime = if (activeTouchDownTime > 0L) activeTouchDownTime else SystemClock.uptimeMillis()
                        val eventTime = SystemClock.uptimeMillis()
                        dispatchTouchAtPointer(MotionEvent.ACTION_UP, downTime, eventTime)
                        activeTouchDownTime = 0L
                    }
                    return true
                }
            }
        }

        return super.dispatchKeyEvent(event)
    }

    private fun handlePointerMove(keyCode: Int, step: Float) {
        val h = pointerView.height.toFloat()
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_UP -> {
                pointerView.moveBy(0f, -step)
                if (h > 0f && pointerView.pointerY <= h * EDGE_SCROLL_THRESHOLD) {
                    webView.scrollBy(0, -EDGE_SCROLL_STEP_PX)
                }
            }
            KeyEvent.KEYCODE_DPAD_DOWN -> {
                pointerView.moveBy(0f, step)
                if (h > 0f && pointerView.pointerY >= h * (1f - EDGE_SCROLL_THRESHOLD)) {
                    webView.scrollBy(0, EDGE_SCROLL_STEP_PX)
                }
            }
            KeyEvent.KEYCODE_DPAD_LEFT -> pointerView.moveBy(-step, 0f)
            KeyEvent.KEYCODE_DPAD_RIGHT -> pointerView.moveBy(step, 0f)
        }
    }

    private fun dispatchTouchAtPointer(action: Int, downTime: Long, eventTime: Long) {
        val x = pointerView.pointerX
        val y = pointerView.pointerY
        val motionEvent = MotionEvent.obtain(downTime, eventTime, action, x, y, 0)
        webView.dispatchTouchEvent(motionEvent)
        motionEvent.recycle()
    }

    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack() && !isErrorPage) {
            webView.goBack()
        } else {
            finish()
        }
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) {
            webView.onResume()
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
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }

    inner class WebAppBridge {

        @JavascriptInterface
        fun saveAppUrl(id: String, url: String) {
            val cleanId = id.trim()
            val cleanUrl = url.trim()
            if (cleanId.isEmpty() || cleanUrl.isEmpty()) return

            val prefs = getSharedPreferences(MainActivity.PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().putString(cleanId, cleanUrl).apply()

            if (cleanId == appId || appId.isEmpty()) {
                targetUrl = cleanUrl
            }
        }

        @JavascriptInterface
        fun getAppUrlsJson(): String {
            val prefs = getSharedPreferences(MainActivity.PREFS_NAME, Context.MODE_PRIVATE)
            val json = JSONObject()
            for ((key, value) in prefs.all) {
                if (value is String) {
                    json.put(key, value)
                }
            }
            return json.toString()
        }

        @JavascriptInterface
        fun loadUrl(url: String) {
            val cleanUrl = url.trim()
            if (cleanUrl.isEmpty()) return
            targetUrl = cleanUrl
            runOnUiThread {
                isErrorPage = false
                updatePointerVisibility()
                webView.loadUrl(cleanUrl)
            }
        }

        @JavascriptInterface
        fun closeWebApp() {
            runOnUiThread {
                finish()
            }
        }
    }
}
