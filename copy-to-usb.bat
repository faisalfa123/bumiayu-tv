@echo off
setlocal
title Penyiap Flashdisk USB - Bumiayu TV Launcher
cd /d "%~dp0"
echo ========================================================
echo  Membuka Penyiap Flashdisk USB (PowerShell)...
echo ========================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0copy-to-usb.ps1"
echo.
echo Tekan sembarang tombol untuk keluar...
pause >nul
