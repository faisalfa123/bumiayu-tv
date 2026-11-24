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
        versionCode = 7
        versionName = "2.1.2"

        ndk {
            abiFilters.addAll(listOf("armeabi-v7a", "arm64-v8a", "x86", "x86_64"))
        }
    }

    // Split per-ABI APKs (arm, arm64, x86, x86_64) + Universal APK
    splits {
        abi {
            isEnable = true
            reset()
            include("armeabi-v7a", "arm64-v8a", "x86", "x86_64")
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
