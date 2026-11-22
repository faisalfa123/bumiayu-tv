package com.bumiayu.tvlauncher

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
    }

    private lateinit var webView: WebView
    private lateinit var pointerView: VirtualPointerView
    private lateinit var rootLayout: FrameLayout

    private var appName: String = "Web App"
    private var initialUrl: String = "about:blank"
    private var appId: String = ""

    private var virtualPointerEnabled = false
    private var pointerX = 640f
    private var pointerY = 360f
    private val pointerSpeed = 24f

    private var lastBackPressTime = 0L

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        appName = intent.getStringExtra(EXTRA_NAME) ?: "Web App"
        initialUrl = intent.getStringExtra(EXTRA_URL) ?: "about:blank"
        appId = intent.getStringExtra(EXTRA_APP_ID) ?: ""

        rootLayout = FrameLayout(this).apply {
            setBackgroundColor(Color.BLACK)
        }

        webView = WebView(this).apply {
            setBackgroundColor(Color.BLACK)
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
                userAgentString = MainActivity.TV_USER_AGENT
            }

            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    super.onReceivedError(view, request, error)
                }
            }

            addJavascriptInterface(WebAppBridge(), "WebAppBridge")
        }

        pointerView = VirtualPointerView(this).apply {
            visibility = View.GONE
        }

        rootLayout.addView(webView, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        rootLayout.addView(pointerView, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        setContentView(rootLayout)
        webView.requestFocus()
        webView.loadUrl(initialUrl)
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
            webView.removeJavascriptInterface("WebAppBridge")
            webView.destroy()
        }
        super.onDestroy()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (virtualPointerEnabled) {
                toggleVirtualPointer(false)
                return true
            }

            val now = System.currentTimeMillis()
            if (now - lastBackPressTime < 2000) {
                finish()
                return true
            }

            if (webView.canGoBack()) {
                webView.goBack()
                lastBackPressTime = now
                Toast.makeText(this, "Tekan Back lagi untuk keluar ke Beranda", Toast.LENGTH_SHORT).show()
                return true
            }

            finish()
            return true
        }

        if (keyCode == KeyEvent.KEYCODE_MENU) {
            toggleVirtualPointer(!virtualPointerEnabled)
            return true
        }

        if (virtualPointerEnabled) {
            when (keyCode) {
                KeyEvent.KEYCODE_DPAD_LEFT -> {
                    movePointer(-pointerSpeed, 0f)
                    return true
                }
                KeyEvent.KEYCODE_DPAD_RIGHT -> {
                    movePointer(pointerSpeed, 0f)
                    return true
                }
                KeyEvent.KEYCODE_DPAD_UP -> {
                    movePointer(0f, -pointerSpeed)
                    return true
                }
                KeyEvent.KEYCODE_DPAD_DOWN -> {
                    movePointer(0f, pointerSpeed)
                    return true
                }
                KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                    simulateClick(pointerX, pointerY)
                    return true
                }
            }
        }

        return super.onKeyDown(keyCode, event)
    }

    private fun toggleVirtualPointer(enable: Boolean) {
        virtualPointerEnabled = enable
        pointerView.visibility = if (enable) View.VISIBLE else View.GONE
        if (enable) {
            pointerX = (rootLayout.width / 2).toFloat()
            pointerY = (rootLayout.height / 2).toFloat()
            pointerView.updatePosition(pointerX, pointerY)
            Toast.makeText(this, "Mode Kursor Aktif (Menu untuk matikan)", Toast.LENGTH_SHORT).show()
        }
    }

    private fun movePointer(dx: Float, dy: Float) {
        val maxX = rootLayout.width.toFloat()
        val maxY = rootLayout.height.toFloat()
        pointerX = (pointerX + dx).coerceIn(0f, maxX)
        pointerY = (pointerY + dy).coerceIn(0f, maxY)
        pointerView.updatePosition(pointerX, pointerY)
    }

    private fun simulateClick(x: Float, y: Float) {
        val downTime = SystemClock.uptimeMillis()
        val eventTime = SystemClock.uptimeMillis()

        val downEvent = MotionEvent.obtain(downTime, eventTime, MotionEvent.ACTION_DOWN, x, y, 0)
        val upEvent = MotionEvent.obtain(downTime, eventTime + 50, MotionEvent.ACTION_UP, x, y, 0)

        webView.dispatchTouchEvent(downEvent)
        webView.dispatchTouchEvent(upEvent)

        downEvent.recycle()
        upEvent.recycle()
    }

    inner class WebAppBridge {
        @JavascriptInterface
        fun closeApp() {
            runOnUiThread {
                finish()
            }
        }
    }
}
