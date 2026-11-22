# ==============================================================================
# BUMIAYU TV - USB FLASHDISK INSTALLER PREPARATION SCRIPT
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ApkDir = Join-Path $ScriptDir "apk"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " PENYIAP FLASHDISK USB - BUMIAYU TV LAUNCHER" -ForegroundColor Yellow
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Deteksi Drive Removable (Flashdisk USB)
$Drives = Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DriveType -eq 2 }

if (-not $Drives -or $Drives.Count -eq 0) {
    Write-Host "[!] Tidak terdeteksi Flashdisk USB di komputer ini." -ForegroundColor Yellow
    Write-Host "    Silakan tancapkan Flashdisk USB Anda ke Laptop/PC, lalu coba lagi.`n" -ForegroundColor Gray
    
    $ManualLetter = Read-Host "Atau masukkan huruf drive Flashdisk Anda secara manual (contoh: E atau F)"
    if ([string]::IsNullOrWhiteSpace($ManualLetter)) {
        Write-Host "[-] Dibatalkan." -ForegroundColor Red
        exit 1
    }
    $TargetDrive = "$($ManualLetter.Trim().ToUpper().TrimEnd(':')):"
} elseif ($Drives.Count -eq 1) {
    $TargetDrive = $Drives[0].DeviceID
    Write-Host "[+] Terdeteksi Flashdisk USB di drive: $TargetDrive ($($Drives[0].VolumeName))" -ForegroundColor Green
} else {
    Write-Host "Terdeteksi beberapa Flashdisk USB:" -ForegroundColor Cyan
    foreach ($d in $Drives) {
        Write-Host "  - $($d.DeviceID) ($($d.VolumeName))" -ForegroundColor Yellow
    }
    $SelectedLetter = Read-Host "Pilih huruf drive tujuan (misal E atau F)"
    $TargetDrive = "$($SelectedLetter.Trim().ToUpper().TrimEnd(':')):"
}

$TargetPath = "$TargetDrive\"
if (-not (Test-Path $TargetPath)) {
    Write-Host "[-] Drive $TargetDrive tidak ditemukan atau tidak dapat diakses." -ForegroundColor Red
    exit 1
}

Write-Host "`n[*] Menyiapkan paket instalasi ke $TargetDrive ...`n" -ForegroundColor Cyan

# 2. Buat folder di Flashdisk
$UsbFolder = Join-Path $TargetPath "BumiayuTV_Installer"
if (-not (Test-Path $UsbFolder)) {
    New-Item -ItemType Directory -Path $UsbFolder -Force | Out-Null
}

# 3. Salin File APK
$LauncherApk = Join-Path $ApkDir "BumiayuTVLauncher.apk"
$SmartTubeApk = Join-Path $ApkDir "smarttube_stable.apk"

if (Test-Path $LauncherApk) {
    Copy-Item -Path $LauncherApk -Destination (Join-Path $UsbFolder "BumiayuTVLauncher.apk") -Force
    Write-Host "[+] Berhasil menyalin: BumiayuTVLauncher.apk" -ForegroundColor Green
} else {
    Write-Host "[!] File BumiayuTVLauncher.apk tidak ditemukan di folder apk/!" -ForegroundColor Yellow
}

if (Test-Path $SmartTubeApk) {
    Copy-Item -Path $SmartTubeApk -Destination (Join-Path $UsbFolder "smarttube_stable.apk") -Force
    Write-Host "[+] Berhasil menyalin: smarttube_stable.apk (YouTube Bebas Iklan)" -ForegroundColor Green
}

# 4. Tulis Panduan Text
$GuideText = @"
========================================================================
 PANDUAN CARA PASANG BUMIAYU TV LAUNCHER LEWAT FLASHDISK USB
========================================================================

Langkah 1: Cabut Flashdisk ini dari laptop dan colokkan ke port USB TV Xiaomi Anda.

Langkah 2: Di TV Xiaomi Anda:
  - Buka aplikasi bawaan: 'Pengelola Berkas' (File Manager / TV File Explorer).
  - Pilih perangkat penyimpanan USB Anda.
  - Masuk ke folder 'BumiayuTV_Installer'.

Langkah 3:
  - Klik file 'BumiayuTVLauncher.apk' lalu pilih 'Instal'.
  - Jika muncul peringatan keamanan, pilih 'Setelan' lalu aktifkan izin 'Sumber Tidak Dikenal' (Unknown Sources).
  - Klik file 'smarttube_stable.apk' lalu pilih 'Instal' untuk YouTube tanpa iklan.

Langkah 4:
  - Tekan tombol HOME di remote TV Anda.
  - Pilih 'YouTube' (Bumiayu TV Launcher) sebagai Launcher Beranda Default Anda.
  - Selesai! Nikmati tampilan premium Apple TV Dark yang ultra-cepat.
========================================================================
"@

Set-Content -Path (Join-Path $UsbFolder "PANDUAN_INSTALL_TV.txt") -Value $GuideText -Encoding UTF8
Set-Content -Path (Join-Path $TargetPath "PANDUAN_INSTALL_TV.txt") -Value $GuideText -Encoding UTF8
Write-Host "[+] Berhasil membuat: PANDUAN_INSTALL_TV.txt" -ForegroundColor Green

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " FLASHDISK USB SIAP DIGUNAKAN!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Folder installer tersimpan di: $UsbFolder" -ForegroundColor White
Write-Host "Sekarang cabut Flashdisk dan colokkan ke TV Xiaomi Anda.`n" -ForegroundColor Gray
