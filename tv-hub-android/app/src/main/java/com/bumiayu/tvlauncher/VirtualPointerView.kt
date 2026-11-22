package com.bumiayu.tvlauncher

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.util.AttributeSet
import android.view.View

class VirtualPointerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private var posX = 0f
    private var posY = 0f

    private val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
        style = Paint.Style.FILL
    }

    private val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.BLACK
        style = Paint.Style.STROKE
        strokeWidth = 3f
    }

    private val pointerPath = Path()

    init {
        // Draw standard mouse arrow pointer
        pointerPath.moveTo(0f, 0f)
        pointerPath.lineTo(0f, 32f)
        pointerPath.lineTo(8f, 24f)
        pointerPath.lineTo(16f, 38f)
        pointerPath.lineTo(22f, 34f)
        pointerPath.lineTo(14f, 20f)
        pointerPath.lineTo(24f, 20f)
        pointerPath.close()
    }

    fun updatePosition(x: Float, y: Float) {
        posX = x
        posY = y
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.save()
        canvas.translate(posX, posY)
        canvas.drawPath(pointerPath, fillPaint)
        canvas.drawPath(pointerPath, strokePaint)
        canvas.restore()
    }
}
