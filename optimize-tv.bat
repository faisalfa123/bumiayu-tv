@echo off
setlocal
title Xiaomi Smart TV 4A Optimizer - Apple TV Experience
cd /d "%~dp0"
echo ========================================================
echo  Membuka Xiaomi TV Optimizer (PowerShell)...
echo ========================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0optimize-tv.ps1"
echo.
echo Tekan sembarang tombol untuk menutup jendela ini...
pause >nul
