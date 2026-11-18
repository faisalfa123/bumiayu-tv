package com.faisal.tvhub

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View

class VirtualPointerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    var pointerX: Float = 0f
        private set
    var pointerY: Float = 0f
        private set

    private var initialized = false
    private var pointerVisible = true

    private val density = resources.displayMetrics.density
    private val radius = 11f * density

    private val shadowPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.argb(110, 0, 0, 0)
        style = Paint.Style.FILL
    }

    private val borderPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.argb(220, 24, 28, 36)
        style = Paint.Style.STROKE
        strokeWidth = 2.5f * density
    }

    private val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.argb(245, 255, 255, 255)
        style = Paint.Style.FILL
    }

    init {
        isClickable = false
        isFocusable = false
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (!initialized && w > 0 && h > 0) {
            pointerX = w / 2f
            pointerY = h / 2f
            initialized = true
        } else if (w > 0 && h > 0) {
            pointerX = pointerX.coerceIn(0f, w.toFloat())
            pointerY = pointerY.coerceIn(0f, h.toFloat())
        }
    }

    fun moveBy(dx: Float, dy: Float) {
        if (width <= 0 || height <= 0) return
        pointerX = (pointerX + dx).coerceIn(0f, width.toFloat())
        pointerY = (pointerY + dy).coerceIn(0f, height.toFloat())
        invalidate()
    }

    fun setPointerPosition(x: Float, y: Float) {
        if (width <= 0 || height <= 0) return
        pointerX = x.coerceIn(0f, width.toFloat())
        pointerY = y.coerceIn(0f, height.toFloat())
        invalidate()
    }

    fun setPointerVisible(visible: Boolean) {
        pointerVisible = visible
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (!pointerVisible || width <= 0 || height <= 0) return

        canvas.drawCircle(pointerX, pointerY + (1.5f * density), radius + (1.5f * density), shadowPaint)
        canvas.drawCircle(pointerX, pointerY, radius, fillPaint)
        canvas.drawCircle(pointerX, pointerY, radius, borderPaint)
    }
}
