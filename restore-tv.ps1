# ==============================================================================
# Xiaomi Smart TV 4A (32" 1GB RAM) - Restore Tool
# Script Pemulihan Kembali ke Pengaturan Bawaan Pabrik (Wi-Fi ADB)
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BinDir = Join-Path $ScriptDir "bin"
$BloatFile = Join-Path $ScriptDir "packages-bloat.txt"
$BackupLog = Join-Path $ScriptDir "disabled-packages-backup.txt"

function Write-Header($text) {
    Write-Host "`n========================================================" -ForegroundColor Magenta
    Write-Host " $text" -ForegroundColor Yellow -NoNewline
    Write-Host "`n========================================================" -ForegroundColor Magenta
}

function Write-Success($text) { Write-Host "[+] $text" -ForegroundColor Green }
function Write-Info($text)    { Write-Host "[*] $text" -ForegroundColor Cyan }
function Write-Warn($text)    { Write-Host "[!] $text" -ForegroundColor Yellow }
function Write-Fail($text)    { Write-Host "[-] $text" -ForegroundColor Red }

Clear-Host
Write-Header "XIAOMI SMART TV 4A - RESTORE / KEMBALIKAN KE SEMULA"
Write-Host "Alat ini akan mengaktifkan kembali semua aplikasi bawaan (PatchWall," -ForegroundColor Gray
Write-Host "Leanback Launcher, Telemetri) dan mereset animasi ke normal (1.0x).`n" -ForegroundColor Gray

# 1. RESOLUSI ADB
$AdbCmd = $null
if (Get-Command adb -ErrorAction SilentlyContinue) {
    $AdbCmd = "adb"
} elseif (Test-Path (Join-Path $BinDir "platform-tools\adb.exe")) {
    $AdbCmd = (Join-Path $BinDir "platform-tools\adb.exe")
} elseif (Test-Path (Join-Path $BinDir "adb.exe")) {
    $AdbCmd = (Join-Path $BinDir "adb.exe")
} else {
    Write-Fail "ADB tidak ditemukan. Pastikan Anda sudah pernah menjalankan optimize-tv.bat sekali."
    exit 1
}

# 2. KONEKSI KE TV
$DefaultIP = "192.168.1.5"
$TvIP = Read-Host "Masukkan Alamat IP TV Anda (Tekan ENTER untuk '$DefaultIP')"
if ([string]::IsNullOrWhiteSpace($TvIP)) {
    $TvIP = $DefaultIP
}

Write-Info "Menghubungkan ke $TvIP`:5555 via Wi-Fi ADB..."
& $AdbCmd disconnect 2>&1 | Out-Null
$ConnectResult = & $AdbCmd connect "$($TvIP):5555" 2>&1
Write-Host $ConnectResult -ForegroundColor Gray

Start-Sleep -Seconds 2

$DeviceList = & $AdbCmd devices
$DeviceLine = ($DeviceList | Where-Object { $_ -match "$TvIP`:5555" })

if ($DeviceLine -notmatch "device") {
    Write-Fail "Gagal terhubung ke TV ($DeviceLine). Pastikan TV menyala dan di jaringan Wi-Fi yang sama."
    exit 1
}

Write-Success "TV Terhubung dengan status AUTHORIZED!"

# 3. AKTIFKAN KEMBALI SEMUA PAKET
Write-Header "MENGAKTIFKAN KEMBALI PAKET BAWAAN (RESTORE)"

$RestoreList = @()
if (Test-Path $BackupLog) {
    Write-Info "Membaca paket dari log backup ($BackupLog)..."
    $RestoreList = Get-Content $BackupLog | Where-Object { $_ -match '^[a-zA-Z0-9_\.]+$' }
}

if ($RestoreList.Count -eq 0 -and (Test-Path $BloatFile)) {
    Write-Info "Membaca paket dari daftar bloatware ($BloatFile)..."
    $RestoreList = Get-Content $BloatFile | Where-Object { $_ -match '^\s*[^#]' -and $_.Trim() -ne '' }
}

# Pastikan stock launcher & patchwall pasti ada di daftar restore
$CriticalRestore = @("com.google.android.tvlauncher", "com.mitv.tvhome", "com.google.android.tvrecommendations")
foreach ($crit in $CriticalRestore) {
    if (-not ($RestoreList -contains $crit)) {
        $RestoreList += $crit
    }
}

$RestoredCount = 0
foreach ($pkg in $RestoreList) {
    $pkg = $pkg.Trim()
    Write-Info "Mengaktifkan: $pkg ..."
    $rawRes = & $AdbCmd shell "pm enable $pkg" 2>&1
    $Res = ($rawRes | Out-String).Trim()
    if ($Res -match "new state: enabled" -or $Res -match "enabled") {
        Write-Success "$pkg [AKTIF KEMBALI]"
        $RestoredCount++
    } else {
        Write-Host "[-] $pkg ($Res)" -ForegroundColor Gray
    }
}

Write-Success "Total $RestoredCount paket berhasil diaktifkan kembali!"

# 4. RESET SKALA ANIMASI KE 1.0x (DEFAULT)
Write-Header "MERESET SKALA ANIMASI SISTEM KE NORMAL (1.0x)"
& $AdbCmd shell settings put global window_animation_scale 1.0
& $AdbCmd shell settings put global transition_animation_scale 1.0
& $AdbCmd shell settings put global animator_duration_scale 1.0
Write-Success "Skala animasi dikembalikan ke 1.0x."

# 5. SELESAI
Write-Header "PEMULIHAN SELESAI!"
Write-Host "Kondisi TV telah dikembalikan seperti sedia kala." -ForegroundColor Green
Write-Host "Tekan tombol HOME di remote TV Anda untuk kembali ke tampilan awal bawaan." -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Magenta
