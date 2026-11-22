@echo off
setlocal
title Xiaomi Smart TV 4A Optimizer - Bumiayu TV Launcher
cd /d "%~dp0"

:MENU
cls
echo ========================================================
echo   BUMIAYU TV LAUNCHER - PILIH METODE INSTALASI
echo ========================================================
echo.
echo   [1] Instalasi via Wi-Fi (Nirkabel - Masukkan IP TV)
echo   [2] Instalasi via Kabel USB (Kabel Data Laptop ke TV)
echo   [3] Siapkan Flashdisk USB (Instalasi Offline di TV)
echo   [4] Keluar
echo.
echo ========================================================
set /p PILIHAN="Masukkan pilihan Anda [1, 2, atau 3]: "

if "%PILIHAN%"=="1" goto WIFI
if "%PILIHAN%"=="2" goto USB
if "%PILIHAN%"=="3" goto FLASHDISK
if "%PILIHAN%"=="4" goto END
goto MENU

:WIFI
cls
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0optimize-tv.ps1" -Mode wifi
goto SELESAI

:USB
cls
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0optimize-tv.ps1" -Mode usb
goto SELESAI

:FLASHDISK
cls
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0optimize-tv.ps1" -Mode flashdisk
goto SELESAI

:SELESAI
echo.
echo ========================================================
echo Selesai. Tekan sembarang tombol untuk menutup jendela...
echo ========================================================
pause >nul

:END
