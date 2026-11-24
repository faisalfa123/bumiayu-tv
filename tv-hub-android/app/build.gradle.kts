plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.bumiayu.tvlauncher"
    compileSdk = 33

    defaultConfig {
        applicationId = "com.bumiayu.tvlauncher"
        minSdk = 21
        targetSdk = 33
        versionCode = 6
        versionName = "2.0.4"

        // Cross-Platform ABI Filters: 32-bit & 64-bit ARM, 32-bit & 64-bit x86
        ndk {
            abiFilters.addAll(listOf("armeabi-v7a", "arm64-v8a", "x86", "x86_64"))
        }
    }

    // Support Universal Cross-Platform APK & Optional ABI Splitting
    splits {
        abi {
            isEnable = false // Universal APK enabled by default for seamless 1-click install on all Android TV boxes
            isUniversalApk = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Zero heavy third-party runtime dependencies for minimal 1GB RAM footprint on Xiaomi TV 4A
}
