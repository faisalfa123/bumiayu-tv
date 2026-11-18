@echo off
setlocal
title Xiaomi Smart TV 4A Restore Tool
cd /d "%~dp0"
echo ========================================================
echo  Membuka Xiaomi TV Restore Tool (PowerShell)...
echo ========================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0restore-tv.ps1"
echo.
echo Tekan sembarang tombol untuk menutup jendela ini...
pause >nul
