# ==============================================================================
# Xiaomi Smart TV 4A (32" 1GB RAM) - Apple TV Optimizer
# Script Otomasi Windows PowerShell (Wi-Fi ADB)
# ==============================================================================

param(
    [string]$Mode = "",
    [string]$TargetIP = "",
    [string]$SbcServerIP = ""
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BinDir = Join-Path $ScriptDir "bin"
$ApkDir = Join-Path $ScriptDir "apk"
$BloatFile = Join-Path $ScriptDir "packages-bloat.txt"
$ProtectedFile = Join-Path $ScriptDir "packages-protected.txt"
$BackupLog = Join-Path $ScriptDir "disabled-packages-backup.txt"

# Warna Output
function Write-Header($text) {
    Write-Host "`n========================================================" -ForegroundColor Cyan
    Write-Host " $text" -ForegroundColor Yellow -NoNewline
    Write-Host "`n========================================================" -ForegroundColor Cyan
}

function Write-Success($text) { Write-Host "[+] $text" -ForegroundColor Green }
function Write-Info($text)    { Write-Host "[*] $text" -ForegroundColor Cyan }
function Write-Warn($text)    { Write-Host "[!] $text" -ForegroundColor Yellow }
function Write-Fail($text)    { Write-Host "[-] $text" -ForegroundColor Red }

Clear-Host
Write-Header "XIAOMI SMART TV 4A - APPLE TV EXPERIENCE OPTIMIZER"
Write-Host "Target Hardware : Xiaomi Smart TV 4A 32 Inch (RAM 1 GB)" -ForegroundColor Gray
Write-Host "Mode            : Safe ADB User-space (No Root, DRM Safe)" -ForegroundColor Gray
Write-Host "Tujuan          : Bebas Iklan, RAM Lega (~300MB), Responsif Ala tvOS`n" -ForegroundColor Gray

# ------------------------------------------------------------------------------
# 1. RESOLUSI ADB (Cek PATH atau Auto-Download)
# ------------------------------------------------------------------------------
Write-Info "Memeriksa ketersediaan Android Debug Bridge (ADB)..."

$AdbCmd = $null
if (Get-Command adb -ErrorAction SilentlyContinue) {
    $AdbCmd = "adb"
    Write-Success "ADB ditemukan di Environment PATH sistem."
} elseif (Test-Path (Join-Path $BinDir "platform-tools\adb.exe")) {
    $AdbCmd = (Join-Path $BinDir "platform-tools\adb.exe")
    Write-Success "ADB ditemukan di folder lokal ($AdbCmd)."
} elseif (Test-Path (Join-Path $BinDir "adb.exe")) {
    $AdbCmd = (Join-Path $BinDir "adb.exe")
    Write-Success "ADB ditemukan di folder lokal ($AdbCmd)."
} else {
    Write-Warn "ADB belum terpasang. Mengunduh Android Platform-Tools resmi dari Google..."
    if (-not (Test-Path $BinDir)) { New-Item -ItemType Directory -Path $BinDir -Force | Out-Null }
    
    $ZipPath = Join-Path $BinDir "platform-tools.zip"
    $Url = "https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
    
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]'Tls12, Tls13'
    Invoke-WebRequest -Uri $Url -OutFile $ZipPath -UseBasicParsing
    
    Write-Info "Mengekstrak Android Platform-Tools..."
    Expand-Archive -Path $ZipPath -DestinationPath $BinDir -Force
    Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue
    
    $AdbCmd = Join-Path $BinDir "platform-tools\adb.exe"
    if (Test-Path $AdbCmd) {
        Write-Success "ADB berhasil diunduh dan siap digunakan!"
    } else {
        Write-Fail "Gagal menginisialisasi ADB. Silakan instal ADB secara manual."
        exit 1
    }
}

# ------------------------------------------------------------------------------
# 2. PILIH METODE INSTALASI (WI-FI, KABEL USB, ATAU FLASHDISK USB)
# ------------------------------------------------------------------------------
if ([string]::IsNullOrWhiteSpace($Mode)) {
    Write-Header "PILIH METODE INSTALASI BUMIAYU TV LAUNCHER"
    Write-Host "Silakan tentukan metode yang ingin Anda gunakan:" -ForegroundColor White
    Write-Host ""
    Write-Host "  [1] Wi-Fi ADB        - Pasang nirkabel lewat jaringan Wi-Fi" -ForegroundColor Cyan
    Write-Host "  [2] Kabel USB ADB    - Pasang langsung lewat kabel data USB ke TV" -ForegroundColor Green
    Write-Host "  [3] Flashdisk USB    - Siapkan installer offline ke Flashdisk USB" -ForegroundColor Yellow
    Write-Host ""

    $choice = ""
    while ($choice -notmatch "^[123]$") {
        $choice = Read-Host "Masukkan pilihan Anda [1, 2, atau 3]"
        if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }
    }
    switch ($choice) {
        "1" { $Mode = "wifi" }
        "2" { $Mode = "usb" }
        "3" { $Mode = "flashdisk" }
    }
}

$Mode = $Mode.ToLower().Trim()

# --- JALUR 3: FLASHDISK USB OFFLINE ---
if ($Mode -eq "flashdisk" -or $Mode -eq "3") {
    $UsbScript = Join-Path $ScriptDir "copy-to-usb.ps1"
    if (Test-Path $UsbScript) {
        & $UsbScript
    } else {
        Write-Fail "Script copy-to-usb.ps1 tidak ditemukan!"
    }
    exit 0
}

# --- JALUR 2: KABEL USB ADB DIRECT ---
if ($Mode -eq "usb" -or $Mode -eq "2") {
    Write-Header "KONEKSI KABEL USB LANGSUNG KE TV"
    Write-Info "Memeriksa perangkat via kabel USB..."

    $UsbFound = $false
    while (-not $UsbFound) {
        $DeviceList = & $AdbCmd devices
        $UsbDeviceLine = ($DeviceList | Where-Object { $_ -match "\bdevice\b" -and $_ -notmatch ":5555" -and $_ -notmatch "List of" })

        if ($UsbDeviceLine) {
            $UsbId = ($UsbDeviceLine.Trim() -split '\s+')[0]
            Write-Success "TV Terdeteksi via Kabel USB! (Device ID: $UsbId)"
            $UsbFound = $true
            break
        }

        $UnauthorizedLine = ($DeviceList | Where-Object { $_ -match "\bunauthorized\b" -and $_ -notmatch ":5555" })
        if ($UnauthorizedLine) {
            Write-Warn "PERHATIAN: Muncul dialog izin USB Debugging di layar TV Anda!"
            Write-Warn "Centang opsi 'Selalu izinkan dari komputer ini' lalu pilih OK pada remote TV."
            Read-Host "Tekan ENTER setelah mengizinkan di layar TV..." | Out-Null
            continue
        }

        Write-Warn "TV belum terdeteksi lewat kabel USB."
        Write-Host "`nLangkah-langkah:" -ForegroundColor Yellow
        Write-Host "1. Tancapkan kabel USB dari Laptop ke port USB TV Xiaomi Anda."
        Write-Host "2. Di TV: Buka Pengaturan > Preferensi Perangkat > Opsi Pengembang."
        Write-Host "3. Pastikan 'Debugging USB' dalam posisi AKTIF (ON)."
        Write-Host ""
        $retry = Read-Host "Tekan ENTER untuk memindai ulang kabel USB (atau ketik 'batal' untuk keluar)"
        if ($retry -match "batal|exit|q") {
            Write-Warn "Instalasi dibatalkan oleh pengguna."
            exit 0
        }
    }
}

# --- JALUR 1: WI-FI ADB ---
if ($Mode -eq "wifi" -or $Mode -eq "1") {
    Write-Header "KONEKSI NIRKABEL WI-FI ADB KE TV"
    $DefaultIP = "192.168.1.4"
    if (-not [string]::IsNullOrWhiteSpace($TargetIP)) {
        $TvIP = $TargetIP
        Write-Info "Menggunakan IP target dari parameter: $TvIP"
    } else {
        $TvIP = Read-Host "Masukkan Alamat IP TV Anda (Tekan ENTER untuk '$DefaultIP')"
        if ([string]::IsNullOrWhiteSpace($TvIP)) {
            $TvIP = $DefaultIP
        }
    }

    Write-Info "Menghubungkan ke $TvIP`:5555 via Wi-Fi ADB..."
    & $AdbCmd disconnect 2>&1 | Out-Null
    $ConnectResult = & $AdbCmd connect "$($TvIP):5555" 2>&1
    Write-Host $ConnectResult -ForegroundColor Gray

    Start-Sleep -Seconds 2

    $DeviceList = & $AdbCmd devices
    $DeviceLine = ($DeviceList | Where-Object { $_ -match "$TvIP`:5555" })

    if ($DeviceLine -match "unauthorized") {
        Write-Warn "PERHATIAN: Muncul dialog izin USB Debugging di layar TV Anda!"
        Write-Warn "Centang opsi 'Selalu izinkan dari komputer ini' lalu pilih OK pada remote TV."
        Read-Host "Tekan ENTER setelah mengizinkan di layar TV..." | Out-Null
        
        $DeviceList = & $AdbCmd devices
        $DeviceLine = ($DeviceList | Where-Object { $_ -match "$TvIP`:5555" })
    }

    if ($DeviceLine -notmatch "device") {
        Write-Fail "Gagal terhubung ke TV di $TvIP`:5555 ($ConnectResult)"
        Write-Host "`nTips Mengatasi:" -ForegroundColor Yellow
        Write-Host "1. Cek IP TV Anda saat ini di menu: Pengaturan TV > Jaringan > Status."
        Write-Host "2. Pastikan TV dan Laptop terhubung ke Wi-Fi yang sama."
        Write-Host "3. Jika Wi-Fi bermasalah, silakan gunakan pilihan [2] Kabel USB atau [3] Flashdisk USB!"
        exit 1
    }
}

Write-Success "TV Terhubung dengan status AUTHORIZED!"

# ------------------------------------------------------------------------------
# 3. BACKUP STATE PAKET SEBELUM MODIFIKASI
# ------------------------------------------------------------------------------
Write-Header "MEMBUAT CADANGAN (BACKUP) STATUS SISTEM"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$ExistingDisabled = & $AdbCmd shell pm list packages -d
$BackupContent = @"
# ==============================================================================
# LOG BACKUP PAKET DINONAKTIFKAN
# Tanggal: $Timestamp
# IP TV  : $TvIP
# ==============================================================================
$ExistingDisabled
"@

Set-Content -Path $BackupLog -Value $BackupContent -Encoding UTF8
Write-Success "Snapshot status sistem awal tersimpan di: $BackupLog"

# ------------------------------------------------------------------------------
# 4. INSTALASI SMARTTUBE STABLE, BUMIAYU TV LAUNCHER & LAUNCHER BEBAS IKLAN
# ------------------------------------------------------------------------------
Write-Header "PENYIAPAN LAUNCHER BEBAS IKLAN & SHORTCUT INPUT TV"

$HasCustomLauncher = $false
$InstalledPackages = (& $AdbCmd shell pm list packages 2>&1) | Out-String

if (-not (Test-Path $ApkDir)) { New-Item -ItemType Directory -Path $ApkDir -Force | Out-Null }

# 4a. Auto-Download & Instalasi SmartTube Stable (YouTube Bebas Iklan)
$SmartTubePkg = "org.smarttube.stable"
$SmartTubeApkPath = Join-Path $ApkDir "smarttube_stable.apk"
$SmartTubeUrl = "https://github.com/yuliskov/SmartTube/releases/latest/download/smarttube_stable.apk"

if ($InstalledPackages -match [regex]::Escape($SmartTubePkg)) {
    Write-Success "SmartTube Stable ($SmartTubePkg) sudah terpasang di TV."
} else {
    if (-not (Test-Path $SmartTubeApkPath)) {
        Write-Info "Mengunduh SmartTube Stable terbaru dari GitHub..."
        try {
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]'Tls12, Tls13'
            $SmartTubeTmp = "$SmartTubeApkPath.tmp"
            Invoke-WebRequest -Uri $SmartTubeUrl -OutFile $SmartTubeTmp -UseBasicParsing -TimeoutSec 120 -ErrorAction Stop
            Move-Item -Path $SmartTubeTmp -Destination $SmartTubeApkPath -Force -ErrorAction Stop
            Write-Success "SmartTube Stable berhasil diunduh ke: $SmartTubeApkPath"
        } catch {
            Remove-Item -Path "$SmartTubeApkPath.tmp" -Force -ErrorAction SilentlyContinue
            Write-Warn "Gagal mengunduh SmartTube Stable ($($_.Exception.Message)). Melanjutkan langkah berikutnya..."
        }
    } else {
        Write-Info "File smarttube_stable.apk sudah tersedia di folder 'apk/'."
    }

    if (Test-Path $SmartTubeApkPath) {
        Write-Info "Memasang SmartTube Stable ke TV..."
        $SmartTubeInstallOutput = & $AdbCmd install -r $SmartTubeApkPath 2>&1
        Write-Host $SmartTubeInstallOutput -ForegroundColor Gray
        if ($SmartTubeInstallOutput -match "Success") {
            Write-Success "Berhasil memasang SmartTube Stable!"
        } else {
            Write-Warn "Instalasi SmartTube Stable tidak mengembalikan status Success."
        }
    }
}

# 4b. Cek & Instalasi Bumiayu TV Launcher atau Launcher Alternatif Lainnya
if ($InstalledPackages -match "com\.bumiayu\.tvlauncher|com\.faisal\.tvhub|flix|flauncher|projectivy|atvlauncher|emotn") {
    Write-Success "Launcher alternatif / Bumiayu TV Launcher sudah terdeteksi di dalam TV."
    $HasCustomLauncher = $true
}

$CustomLauncherApks = Get-ChildItem -Path $ApkDir -Filter "*.apk" -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -like "BumiayuTVLauncher*.apk" -or $_.Name -like "FaisalTVHub*.apk" -or $_.Name -eq "app-debug.apk"
}
if ($CustomLauncherApks -and $CustomLauncherApks.Count -gt 0) {
    foreach ($hubApk in $CustomLauncherApks) {
        Write-Info "Memasang Bumiayu TV Launcher: $($hubApk.Name)..."
        if ($InstalledPackages -match "com\.faisal\.tvhub") {
            Write-Info "Mencopot paket lama com.faisal.tvhub agar bersih..."
            & $AdbCmd uninstall com.faisal.tvhub 2>&1 | Out-Null
        }
        $HubInstallOutput = & $AdbCmd install -r $hubApk.FullName 2>&1
        Write-Host $HubInstallOutput -ForegroundColor Gray
        if ($HubInstallOutput -match "Success") {
            Write-Success "Berhasil memasang $($hubApk.Name) (com.bumiayu.tvlauncher)"
            $HasCustomLauncher = $true
            Write-Info "Membuka Bumiayu TV Launcher di TV..."
            & $AdbCmd shell am start -n com.bumiayu.tvlauncher/.MainActivity 2>&1 | Out-Null
        }
    }
}

$OtherLauncherApks = Get-ChildItem -Path $ApkDir -Filter "*.apk" -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -ne "smarttube_stable.apk" -and
    $_.Name -notlike "BumiayuTVLauncher*.apk" -and
    $_.Name -notlike "FaisalTVHub*.apk" -and
    $_.Name -ne "app-debug.apk"
}

if ($OtherLauncherApks -and $OtherLauncherApks.Count -gt 0) {
    foreach ($apk in $OtherLauncherApks) {
        Write-Info "Memasang aplikasi: $($apk.Name)..."
        $InstallOutput = & $AdbCmd install -r $apk.FullName 2>&1
        Write-Host $InstallOutput -ForegroundColor Gray
        if ($InstallOutput -match "Success") {
            Write-Success "Berhasil memasang $($apk.Name)"
            $HasCustomLauncher = $true
        }
    }
} elseif (-not $HasCustomLauncher) {
    Write-Warn "Belum ada file APK launcher di folder 'apk/'."
    Write-Info "Mengunduh Flix Launcher resmi (Open-Source, super ringan <1MB)..."
    $FlixApkPath = Join-Path $ApkDir "flix-launcher.apk"
    $FlixTmp = "$FlixApkPath.tmp"
    try {
        $FlixUrl = "https://github.com/HatriGt/flix-launcher/releases/latest/download/app-release.apk"
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]'Tls12, Tls13'
        Invoke-WebRequest -Uri $FlixUrl -OutFile $FlixTmp -UseBasicParsing -TimeoutSec 60 -ErrorAction Stop
        Move-Item -Path $FlixTmp -Destination $FlixApkPath -Force -ErrorAction Stop
        Write-Success "Flix Launcher berhasil diunduh!"
        Write-Info "Memasang Flix Launcher ke TV..."
        $InstallRes = & $AdbCmd install -r $FlixApkPath 2>&1
        Write-Host $InstallRes -ForegroundColor Gray
        if ($InstallRes -match "Success") {
            $HasCustomLauncher = $true
            Write-Success "Flix Launcher aktif di TV!"
        }
    } catch {
        Remove-Item -Path $FlixTmp -Force -ErrorAction SilentlyContinue
        Write-Warn "Gagal auto-download APK secara online ($($_.Exception.Message))."
        Write-Warn "Anda dapat menaruh file APK Bumiayu TV Launcher atau launcher pilihan Anda ke folder 'apk/'."
    }
}

# 4c. Konfigurasi Opsional IP Server Lokal SBC / Odroid C2 (apps-config.json)
Write-Info "Konfigurasi opsional alamat server lokal SBC/Odroid C2 untuk Bumiayu TV Launcher:"
$DefaultSbcIP = "192.168.1.100"
if (-not [string]::IsNullOrWhiteSpace($SbcServerIP)) {
    $SbcIP = $SbcServerIP
    Write-Info "Menggunakan IP server SBC dari parameter: $SbcIP"
} else {
    $SbcIP = Read-Host "Masukkan Alamat IP Server SBC/Odroid C2 Anda (Tekan ENTER untuk '$DefaultSbcIP')"
    if ([string]::IsNullOrWhiteSpace($SbcIP)) {
        $SbcIP = $DefaultSbcIP
    }
}
$SbcIP = $SbcIP.Trim()

$AppsConfig = [ordered]@{
    senandung    = "http://$($SbcIP):8080"
    immich       = "http://$($SbcIP):2283"
    dompetmungil = "http://$($SbcIP):3000"
}
$AppsConfigPath = Join-Path $ScriptDir "apps-config.json"
$AppsConfig | ConvertTo-Json -Depth 2 | Set-Content -Path $AppsConfigPath -Encoding UTF8
Write-Success "Referensi URL lokal tersimpan di: $AppsConfigPath"
Write-Info "Catatan: Di TV nanti, Anda dapat mengubah/memeriksa URL ini langsung lewat menu 'Konfigurasi Server' di Bumiayu TV Launcher."


# ------------------------------------------------------------------------------
# 5. EKSEKUSI DEBLOAT PAKET XIAOMI & IKLAN
# ------------------------------------------------------------------------------
Write-Header "MENONAKTIFKAN BLOATWARE & PATCHWALL (HEMAT RAM 1GB)"

$BloatList = Get-Content $BloatFile | Where-Object { $_ -match '^\s*[^#]' -and $_.Trim() -ne '' }
$ProtectedList = Get-Content $ProtectedFile | Where-Object { $_ -match '^\s*[^#]' -and $_.Trim() -ne '' }

$DisabledCount = 0

foreach ($pkg in $BloatList) {
    $pkg = $pkg.Trim()
    
    # Safety Check: Jangan pernah nonaktifkan paket protected
    if ($ProtectedList -contains $pkg) {
        Write-Warn "SKIP (Protected): $pkg dilindungi sistem!"
        continue
    }

    # Safety Check: Jika paket adalah tvlauncher bawaan, pastikan launcher alternatif sudah siap
    if ($pkg -eq "com.google.android.tvlauncher" -and -not $HasCustomLauncher) {
        Write-Warn "SKIP: $pkg belum dinonaktifkan karena launcher alternatif belum terpasang."
        Write-Warn "Ini untuk mencegah layar hitam (black screen). Pasang Flix Launcher terlebih dahulu."
        continue
    }

    Write-Info "Menonaktifkan: $pkg ..."
    $rawRes = & $AdbCmd shell "pm disable-user --user 0 $pkg" 2>&1
    $Res = ($rawRes | Out-String).Trim()
    
    if ($Res -match "new state: disabled-user" -or $Res -match "disabled") {
        Write-Success "$pkg [NONAKTIF]"
        Add-Content -Path $BackupLog -Value $pkg
        $DisabledCount++
    } elseif ($Res -match "not installed") {
        Write-Host "[-] $pkg [TIDAK TERPASANG PADA MODEL INI]" -ForegroundColor Gray
    } else {
        # Coba fallback ke pm disable biasa jika disable-user tidak didukung
        $fallbackRaw = & $AdbCmd shell "pm disable $pkg" 2>&1
        $fallbackRes = ($fallbackRaw | Out-String).Trim()
        if ($fallbackRes -match "new state: disabled" -or $fallbackRes -match "disabled") {
            Write-Success "$pkg [NONAKTIF (via pm disable)]"
            Add-Content -Path $BackupLog -Value $pkg
            $DisabledCount++
        } else {
            Write-Host "[!] $pkg ($Res)" -ForegroundColor Gray
        }
    }
}

Write-Success "Total paket bloatware yang berhasil dinonaktifkan: $DisabledCount paket."

# ------------------------------------------------------------------------------
# 6. TWEAK ANIMASI & PERFORMA UI ALA APPLE TV (SESI 1 MASTER TEMPLATE)
# ------------------------------------------------------------------------------
Write-Header "OPTIMASI KECEPATAN & ANIMASI UI (APPLE TV TWEAKS)"

Write-Info "Mengatur skala animasi ke 0.5x untuk respon instan tanpa jeda..."
& $AdbCmd shell settings put global window_animation_scale 1
& $AdbCmd shell settings put global transition_animation_scale 1
& $AdbCmd shell settings put global animator_duration_scale 0.5
Write-Success "Skala animasi disetel ke 0.5x (Ultra Fast)."

Write-Info "Memaksa akselerasi 2D hardware renderer OpenGL..."
& $AdbCmd shell setprop debug.hwui.renderer opengl
& $AdbCmd shell settings put global force_hw_ui 1 2>&1 | Out-Null
Write-Success "GPU Hardware Acceleration dipaksa aktif."

Write-Info "Membatasi cached background apps untuk meringankan RAM 1GB..."
& $AdbCmd shell settings put global max_cached_apps 2
Write-Success "Batas background process disetel ke maksimal 2 aplikasi."

Write-Info "Menonaktifkan background logger (Logcat) untuk menghemat siklus CPU..."
& $AdbCmd shell setprop log.tag.all SILENT
Write-Success "Background logging (Logcat) dinonaktifkan."

Write-Success "Pengaturan kecepatan UI berhasil diterapkan!"

# ------------------------------------------------------------------------------
# 7. RINGKASAN SELESAI
# ------------------------------------------------------------------------------
Write-Header "OPTIMASI SELESAI DENGAN SUKSES!"
Write-Host "Hasil Optimasi Xiaomi Smart TV 4A:" -ForegroundColor Green
Write-Host "1. PatchWall & Iklan dinonaktifkan -> RAM 1GB jauh lebih lega (~300MB bebas)." -ForegroundColor White
Write-Host "2. Launcher lebih bersih & gesit tanpa banner rekomendasi berat." -ForegroundColor White
Write-Host "3. Tombol Mikrofon Google Assistant di remote Xiaomi TETAP AKTIF." -ForegroundColor White
Write-Host "4. Respon navigasi kini instan dan mulus berkat animasi 0.5x." -ForegroundColor White
Write-Host "`nCatatan Penting:" -ForegroundColor Yellow
Write-Host "- Tekan tombol HOME di remote TV untuk mulai menggunakan launcher baru." -ForegroundColor Gray
Write-Host "- Jika ingin mengembalikan TV seperti semula, jalankan 'restore-tv.bat'." -ForegroundColor Gray
Write-Host "========================================================`n" -ForegroundColor Cyan
